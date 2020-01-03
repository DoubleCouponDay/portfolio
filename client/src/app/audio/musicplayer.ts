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
    private tryplayagain_intervalid = 0    
    private waiting = false
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
        this.decidetypeofplayback()
    }

    public toggleplayback = (input: boolean) => {
        this.autoplaycondition = input
        this.waiting = false        

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
        console.log("music fully downloaded")
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
        this.stop()
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
        
        else { 
            this.waittostart()            
        } 
    }

    private waittostart = () => {
        if(this.waiting === true) {
            return
        }
        this.waiting = true
        console.log("waiting")

        this.tryplayagain_intervalid = window.setInterval(() => {
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
        let buffersleft = this.queue.length - this.currentplayingindex
        return buffersleft >= playablebuffercount
    }

    private play = () => {      
        if(this._musicisplaying === true) {
            return
        } 
        console.log("playing")
        this._musicisplaying = true  
        this._context.resume()  
        

        for(let i = this.currentplayingindex; i < this.queue.length; i++) {
            if(this.nolongerautoplaying) {
                if(i === this.currentplayingindex) {
                    this.playbacksEnd = 0
                }
                let reprocessed = this.processbuffer(this.queue[i].chunk.buffer)
                this.queue[i] = reprocessed
            }            
            this.queue[i].chunk.start(this.queue[i].time)

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