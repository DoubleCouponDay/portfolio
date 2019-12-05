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
    private volume: GainNode

    private tryplayagain_intervalid = 0    
    private playbacksEnd = 0.0
    private shouldplay = false

    constructor() {
        this._context = new AudioContext()    
        this._context.suspend()    
        this.volume = this._context.createGain()
        this.volume.gain.value = 0.0
    }

    public onnewbuffer = async (response: streamresponse) => {
        let integers = Uint8Array.from(
            atob(response.chunk), c => c.charCodeAt(0))

        let audiobuffer = await this._context.decodeAudioData(integers.buffer)    
        this.buffers.push(audiobuffer)
    
        if(this._musicisplaying === true) {
            this.queuebuffer(audiobuffer)
            return
        }

        else if(this.musicisreadytostart() === false) {
            return
        } 
        this.beginplayback()
    }

    private queuebuffer(buffer: AudioBuffer) {
        let source = this._context.createBufferSource()
        source.connect(this._context.destination)
        source.buffer = buffer
        source.start(this.playbacksEnd)
        this.playbacksEnd += buffer.duration
    }

    public toggleplayback(input: boolean) {
        this.shouldplay = input

        if(this.shouldplay === false) {
            return
        }
        this.checkcanstart()
    }

    private checkcanstart = () => {
        this.tryplayagain_intervalid = window.setInterval(() => {
          if(this.musicisreadytostart() === false) {
            return
          }
          window.clearInterval(this.tryplayagain_intervalid)
          this.beginplayback()      
        }, 500)
      }
    
    private hasenoughbuffers = () => {
        let buffersleft = this._buffers.length - this._bufferindex    
        return buffersleft >= playablebuffercount
    }

    private beginplayback = () => {       
        if(this._musicisplaying === false) {
            let fullvolumetime = (this._context.currentTime + 5) / millisecond
            this.volume.gain.exponentialRampToValueAtTime(musicvolume, fullvolumetime)
        }
        this._musicisplaying = true  
        this._context.resume()   

        for(let i = this.bufferindex; i < this._buffers.length; i++) {
            let currentbuffer = this._buffers[i]
            this.queuebuffer(currentbuffer)
            this._buffers[this._bufferindex] = null      
        }
    }
    
    private musicisreadytostart(): boolean {
        let musicisnotplaying = this.musicisplaying === false    

        return this.shouldplay &&
            musicisnotplaying &&
            this.hasenoughbuffers()     
    }
}