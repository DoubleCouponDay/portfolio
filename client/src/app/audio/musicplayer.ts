import { streamresponse, playablechunk, dontplay, audiocontextlatency } from '../services/streaming.data'
import { musicvolume, faderamptime } from './audio.data'
import { EventEmitter, OnDestroy, Injectable } from '@angular/core'

export class musicplayer {
    
    dispose(): void {
        this.songfinished.unsubscribe()
    }

    private _context: AudioContext
    private _gainnode: GainNode

    private queue: Array<playablechunk> = []

    private currentplayingindex = 0
    public get playindex() { return this.currentplayingindex }

    private _musicisplaying = false
    public get musicisplaying() { return this._musicisplaying }

    private fullydownloaded = false
    private shouldplay = false

    private _isdownloading = false

    public songfinished = new EventEmitter<void>(true)
    
    constructor() {
        this._context = new AudioContext()    
        this._context.suspend()
        this._gainnode = this._context.createGain()
        this._gainnode.gain.value = 0
    }

    public onchunk = async (response: streamresponse) => {
        if(this._isdownloading === false) {
            console.log('starting download...')
            this._isdownloading = true
        }
        let integers = new Uint8Array( response.chunk)
        let newbuffer = await this._context.decodeAudioData(integers.buffer)            
        let newplayable = this.processbuffer(newbuffer)
        this.queue.push(newplayable)

        if(this.shouldplay === false) {
            return
        }

        if(this._musicisplaying === true) {
            this.playnewchunk(newplayable)
        }

        else {
            this.playexistingchunks()
        }
    }

    public toggleplayback = (input: boolean) => {
        this.shouldplay = input

        if(this.shouldplay === true) {
            this.playexistingchunks()
        }

        else {            
            this.stop()
        }
    }

    public ondownloadcomplete = () => {
        this.fullydownloaded = true
    }

    private processbuffer = (buffer: AudioBuffer): playablechunk => {
        let source = this._context.createBufferSource()
        source.buffer = buffer

        let newplayable: playablechunk = {
            chunk: source,
            timetoplay: dontplay,
            timetoend: dontplay
        }
        source.onended = this.onnodeended
        return newplayable
    }

    private onnodeended = () => {
        if(this.shouldplay === false) {
            return
        }
        this.currentplayingindex++  
        
        if(this.currentplayingindex >= this.queue.length &&
            this.fullydownloaded === true) {
            this.currentplayingindex = 0
            this.stop()
            this.songfinished.emit()
        }
    }

    private fadeinandout = (chunk: AudioBufferSourceNode, bufferstarttime: number, bufferendtime: number): void => {        
        this._gainnode.gain.setValueAtTime(0, bufferstarttime)
        let volumeuptime = bufferstarttime + faderamptime
        this._gainnode.gain.linearRampToValueAtTime(musicvolume, volumeuptime)
        let volumedowntime = bufferendtime - faderamptime
        this._gainnode.gain.linearRampToValueAtTime(musicvolume, volumedowntime)
        this._gainnode.gain.linearRampToValueAtTime(0, bufferendtime)
        let faded = chunk.connect(this._gainnode)
        faded.connect(this._context.destination)
    }

    private playexistingchunks = () => {
        if(this.queue.length === 0) {
            return
        }

        if(this._musicisplaying === true) {
            return
        }
        this._musicisplaying = true
        this._context.resume()
        let previousbuffer: null | playablechunk = null

        for(let index = this.currentplayingindex; index < this.queue.length; index++) {
            this.queue[index] = this.processbuffer(this.queue[index].chunk.buffer)                
            let nextchunk = this.queue[index] 
            let endtime = (previousbuffer === null) ? dontplay : previousbuffer.timetoend
            this.queueabuffer(nextchunk, endtime)
            previousbuffer = nextchunk
        }
    }

    private playnewchunk = (item: playablechunk) => {
        if(this._musicisplaying === false) {
            return
        }
        let previouschunkindex = this.queue.length - 2
        let previouschunksend = previouschunkindex < 0 ? dontplay : this.queue[previouschunkindex].timetoend        
        this.queueabuffer(item, previouschunksend)
    }

    private queueabuffer = (buffer: playablechunk, lastbuffersendtime: number): void => {          
        let newtimetoplay: number = this._context.currentTime

        if(lastbuffersendtime === dontplay) {
            newtimetoplay = lastbuffersendtime - faderamptime
        }   
        buffer.timetoplay = newtimetoplay
        let endtime = buffer.timetoplay + buffer.chunk.buffer.duration
        buffer.timetoend = endtime
        this.fadeinandout(buffer.chunk, buffer.timetoplay, buffer.timetoend)
        
        try {
            buffer.chunk.start(buffer.timetoplay)            
        }
        
        catch(e) {}
    }

    private stop = () => {
        if(this._musicisplaying === false) {
            return
        }
        this._musicisplaying = false

        for(let i = 0; i < this.queue.length; i++) {
            let item = this.queue[i]

            try {
                item.chunk.stop()
            }

            catch(e) {}
            item.timetoplay = dontplay
        }        
    }    
}
