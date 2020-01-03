import { playablebuffercount, millisecond, streamresponse, playablechunk } from '../services/streaming.data'
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
        let newplayable = this.processbuffer(newbuffer)
        this.queue.push(newplayable)
        this.decidetypeofplayback()
    }

    public toggleplayback = (input: boolean) => {
        this.autoplaycondition = input
        console.log("toggle received: " + this.autoplaycondition)
        this.waiting = false

        if(input) {
            this.decidetypeofplayback()
            
        }
        
        else {
            this.stop()
        }
    }

    public onwriterfinished = () => {
        this.fullydownloaded = true
        console.log("music fully downloaded")
    }    

    private processbuffer = (buffer: AudioBuffer): playablechunk => {
        let source = this._context.createBufferSource()
        source.buffer = buffer
        let volume = this.normalizevolume(source)
        volume.connect(this._context.destination)

        let newplayable = {
            chunk: source,
            time: this.playbacksEnd,
            volume: volume
        }        
        console.log("downloaded: " + this.queue.length)
        this.playbacksEnd += buffer.duration  
        source.onended = this.checkstarvation
        return newplayable
    }

    private checkstarvation = () => {
        this.currentplayingindex++
        let notstarved = (this.queue.length - 1) > this.currentplayingindex 

        if(notstarved && 
            this.musicisreadytostart() === false) {
            return
        }
        this._musicisplaying = false
        this.stop()
    }

    private normalizevolume = (buffer: AudioBufferSourceNode): GainNode => {
        let newvolume = this._context.createGain()
        newvolume.gain.value = musicvolume
        buffer.connect(newvolume)
        return newvolume        
    }

    private stop = () => {
        console.log("stopping")

        for(let i = 0; i < this.queue.length; i++) {
            let item = this.queue[i]

            try {
                item.chunk.stop()
            }

            catch(e) {}
        }
        this._musicisplaying = false
    }

    private decidetypeofplayback = () => {
        if(this.musicisreadytostart()) { 
            this.play()            
        } 
        
        else if(this.waiting === false) { 
            this.waittostart()            
        } 
    }

    private waittostart = () => {
        this.waiting = true
        console.log("waiting")

        this.tryplayagain_intervalid = window.setInterval(() => {
            console.log("still waiting")
            if(this.musicisreadytostart() === false) {                
                return
            }            
            this.waiting = false
            window.clearInterval(this.tryplayagain_intervalid)            
            console.log("cleared wait")  
            this.play()    
        }, checkplaytime)
      }
    
    private hasenough = (): boolean => {
        let normalizedtoindex = this.queue.length > 0 ? (this.queue.length - 1) : 0
        let buffersleft = normalizedtoindex - this.currentplayingindex
        return buffersleft >= playablebuffercount
    }

    private play = () => {       
        console.log("playing")
        this._musicisplaying = true  
        this._context.resume()  

        for(let i = this.currentplayingindex; i < this.queue.length; i++) {
            let reprocessed = this.processbuffer(this.queue[i].chunk.buffer)
            this.queue[i] = reprocessed
            // let newstart = i === this.currentplayingindex ? i : this.queue[i].time
            this.queue[i].chunk.start(this.queue[i].time)
        }
    }
    
    private musicisreadytostart = (): boolean => {
        let musicisnotplaying = this.musicisplaying === false   

        return musicisnotplaying &&
            this.autoplaycondition &&
            (this.hasenough() || this.fullydownloaded)    
    }
}