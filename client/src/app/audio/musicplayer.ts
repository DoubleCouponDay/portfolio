import { playablebuffercount, millisecond, streamresponse, playablechunk } from '../services/streaming.data'
import { isnullorundefined } from '../utility/utilities'
import { musicvolume } from './audio.data'

export class musicplayer {
    private queue: Array<playablechunk> = []
    private currentplayingindex = 0

    private _musicisplaying = false
    public get musicisplaying() { return this._musicisplaying }

    private _context: AudioContext
    private playbacksEnd = 0.0
    private fullydownloaded = false
    private tryplayagain_intervalid = 0    
    private waiting = false
    private autoplaycondition = false

    constructor() {
        this._context = new AudioContext()    
        this._context.suspend()    
    }

    public onresponse = async (response: streamresponse) => {
        let integers = new Uint8Array(response.chunk)
        let newbuffer = await this._context.decodeAudioData(integers.buffer)            
        this.queuebuffer(newbuffer)
        let plentifulbuffers = this._musicisplaying === true
        
        if(plentifulbuffers === false) {
            this.decidetypeofplayback()
        }

        else if(this.autoplaycondition === false) {
            this.stop()
        }
    }

    public toggleplayback = (input: boolean) => {
        this.autoplaycondition = input

        if(input === false) {
            this.stop()
        }

        else {
            this.decidetypeofplayback()
        }        
    }

    public onfullydownloaded = () => {
        this.fullydownloaded = true
    }    

    private queuebuffer = (buffer: AudioBuffer) => {
        let source = this._context.createBufferSource()
        source.buffer = buffer
        let volume = this.normalizevolume(source)
        volume.connect(this._context.destination)

        let newplayable = {
            chunk: source,
            time: this.playbacksEnd,
            volume: volume
        }
        this.queue.push(newplayable)
        this.playbacksEnd += buffer.duration  
        source.onended = this.checkstarvation
    }

    private checkstarvation = () => {
        this.currentplayingindex++
        let notstarved = (this.queue.length - 1) > this.currentplayingindex 

        if(notstarved && 
            this.musicisreadytostart() === false) {
            return
        }
        this._musicisplaying = false
    }

    private normalizevolume = (buffer: AudioBufferSourceNode): GainNode => {
        let newvolume = this._context.createGain()
        newvolume.gain.value = musicvolume
        buffer.connect(newvolume)
        return newvolume        
    }

    private stop = () => {
        for(let i = 0; i < this.queue.length; i++) {
            let item = this.queue[i]
            item.chunk.stop()
        }
    }

    private decidetypeofplayback = () => {
        let readytostart = this.musicisreadytostart() === true

        if(readytostart) { 
            this.play()
        } 
        
        else { //scarce buffers
            this.waittostart()
        }
    }

    private waittostart = () => {
        if(this.waiting === true)  {
            return
        }
        this.waiting = true

        if(this.tryplayagain_intervalid != 0) {
            return
        }

        this.tryplayagain_intervalid = window.setInterval(() => {
            if(this.musicisreadytostart() === false) {                
            return
            }            
            window.clearInterval(this.tryplayagain_intervalid)
            this.waiting = false
            this.play()      
        }, 500)
      }
    
    private hasenough = (): boolean => {
        let buffersleft = this.queue.length - this.currentplayingindex + 1
        return buffersleft >= playablebuffercount
    }

    private play = () => {       
        this._musicisplaying = true  
        this._context.resume()  

        for(let i = this.currentplayingindex; i < this.queue.length; i++) {
            let item = this.queue[i]
            item.chunk.start(item.time)
        }
    }
    
    private musicisreadytostart = (): boolean => {
        let musicisnotplaying = this.musicisplaying === false    

        return musicisnotplaying &&
            this.autoplaycondition &&
            (this.hasenough() || this.fullydownloaded)    
    }
}