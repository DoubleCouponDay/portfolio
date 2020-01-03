import { playablebuffercount, streamresponse, playablechunk, processedstate } from '../services/streaming.data'
import { isnullorundefined } from '../utility/utilities'
import { musicvolume } from './audio.data'

const checkplaytime = 1000

export class musicplayer {
    private queue: Array<playablechunk> = []
    private currentplayingindex = 0

    private _musicisplaying = false
    public get musicisplaying() { return this._musicisplaying }

    private _context: AudioContext
    private playbacksEnd = 0.0
    private fullydownloaded = false
    private autoplaycondition = false
    private nolongerautoplaying = false

    constructor() {
        this._context = new AudioContext()    
        this._context.suspend()    
    }

    public onresponse = async (response: streamresponse) => {
        let integers = new Uint8Array(response.chunk)
        let newbuffer = await this._context.decodeAudioData(integers.buffer)            
        let newplayable = this.processbuffer(newbuffer)
        this.queue.push(newplayable)

        try {
            newplayable.chunk.start(newplayable.time)
        }
        catch(error) {}

        console.log("downloaded" + this.queue.length)
        console.log("time: " + newplayable.time + " duration: " + newplayable.chunk.buffer.duration)        
        this.decidetypeofplayback()
    }

    public toggleplayback = (input: boolean) => {
        this.autoplaycondition = input
        console.log("toggle received:" + input)

        if(input) {
            this.decidetypeofplayback()
        }
        
        else {
            this.nolongerautoplaying = true
            this.stop()
        }
    }

    public onwriterfinished = () => {
        this.fullydownloaded = true
    }    

    private processbuffer = (buffer: AudioBuffer): playablechunk => {
        let source = this._context.createBufferSource()
        source.buffer = buffer
        let volume = this.normalizevolume(source)
        volume.connect(this._context.destination)

        let newplayable: playablechunk = {
            hasbeenprocessed: processedstate.initial,
            chunk: source,
            time: this.playbacksEnd,
            volume: volume
        }        
        this.playbacksEnd += buffer.duration  
        source.onended = this.onnodeended
        return newplayable
    }

    private onnodeended = () => {
        this.currentplayingindex++        
    }

    private normalizevolume = (buffer: AudioBufferSourceNode): GainNode => {
        let newvolume = this._context.createGain()
        newvolume.gain.value = musicvolume
        buffer.connect(newvolume)
        return newvolume        
    }

    private stop = () => {
        if(this._musicisplaying === false) {
            return
        }
        this._musicisplaying = false
        console.log("stopping")

        for(let i = 0; i < this.queue.length; i++) {
            let item = this.queue[i]

            try {
                item.chunk.stop()
            }

            catch(e) {}
        }        
    }

    private decidetypeofplayback = () => {
        if(this.musicisreadytostart()) { 
            this.play()            
        } 
    }
    
    private hasenough = (): boolean => {
        let buffersleft = this.queue.length - this.currentplayingindex
        return buffersleft >= playablebuffercount
    }

    private play = () => {      
        if(this._musicisplaying === true) {
            return
        } 
        this._musicisplaying = true  
        this._context.resume()  
        console.log("playing")

        if(this.nolongerautoplaying === true) {
            this.playbacksEnd = 0
        }

        for(let i = this.currentplayingindex; i < this.queue.length; i++) {
            if(this.nolongerautoplaying === true) {
                let reprocessed = this.processbuffer(this.queue[i].chunk.buffer)
                this.queue[i] = reprocessed
            }            

            try {
                this.queue[i].chunk.start(this.queue[i].time)
            }

            catch(error) {}
            
            console.log("time: " + this.queue[i].time + " duration: " + this.queue[i].chunk.buffer.duration)

            if(i === this.currentplayingindex) {
                this.currentplayingindex++
            }
        }
    }
    
    private musicisreadytostart = (): boolean => {
        let musicisnotplaying = this.musicisplaying === false   

        return musicisnotplaying &&
            this.autoplaycondition &&
            (this.hasenough() || this.fullydownloaded)    
    }
}