import { playablebuffercount, millisecond, streamresponse } from '../services/streaming.data'
import { isnullorundefined } from '../utility/utilities'
import { musicvolume } from './audio.data'


export class musicplayer {
    private _buffers = new Array<AudioBuffer>()
    public get buffers() { return this._buffers }

    private _bufferindex = 0
    public get bufferindex() { return this._bufferindex }

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

    public onnewbuffer = async (response: streamresponse) => {
        let integers = Uint8Array.from(
            atob(response.chunk), c => c.charCodeAt(0))

        let audiobuffer = await this._context.decodeAudioData(integers.buffer)    
        this.buffers.push(audiobuffer)
        let plentifulbuffers = this._musicisplaying === true
        
        if(plentifulbuffers) {
            this.queuebuffer(audiobuffer)
        }

        else {
            this.decidetypeofplayback()
        }
    }

    public onfullydownloaded: () => void = () => {
        this.fullydownloaded = true
    }

    private queuebuffer(buffer: AudioBuffer) {
        let source = this._context.createBufferSource()
        source.buffer = buffer
        let volume = this.normalizevolume(source)
        volume.connect(this._context.destination)
        source.start(this.playbacksEnd)                

        this.playbacksEnd += buffer.duration
        this._buffers[this._bufferindex] = null      
        let currentindex = this._bufferindex
        this._bufferindex++      

        source.onended = () => {
            let notstarved = (this._buffers.length - 1) > currentindex

            if(notstarved) {
                return
            }
            this._musicisplaying = false
        }
    }

    private normalizevolume(buffer: AudioBufferSourceNode): GainNode {
        let newvolume = this._context.createGain()
        newvolume.gain.value = musicvolume
        buffer.connect(newvolume)
        return newvolume        
    }

    public toggleplayback(input: boolean) {
        this.autoplaycondition = input
        this.decidetypeofplayback()
    }

    private decidetypeofplayback() {
        let readytostart = this.musicisreadytostart() === true

        if(readytostart) { 
            this.beginplayback()
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

        this.tryplayagain_intervalid = window.setInterval(() => {
            if(this.musicisreadytostart() === false) {                
            return
            }            
            window.clearInterval(this.tryplayagain_intervalid)
            this.waiting = false
            this.beginplayback()      
        }, 500)
      }
    
    private hasenoughbuffers = () => {
        let buffersleft = this._buffers.length - (this._bufferindex  + 1)   
        return buffersleft >= playablebuffercount
    }

    private beginplayback = () => {       
        this._musicisplaying = true  
        this._context.resume()   
        for(let i = this.bufferindex; i < this._buffers.length; i++) {
            let currentbuffer = this._buffers[i]
            this.queuebuffer(currentbuffer)
        }
    }
    
    private musicisreadytostart(): boolean {
        let musicisnotplaying = this.musicisplaying === false    

        return musicisnotplaying &&
            this.autoplaycondition &&
            (this.hasenoughbuffers() || this.fullydownloaded)    
    }
}