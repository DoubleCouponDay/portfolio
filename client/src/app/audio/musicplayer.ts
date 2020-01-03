import { playablebuffercount, streamresponse, playablechunk, dontplay } from '../services/streaming.data'
import { isnullorundefined } from '../utility/utilities'
import { musicvolume } from './audio.data'

export class musicplayer {
    private _context: AudioContext

    private queue: Array<playablechunk> = []
    private currentplayingindex = 0

    private _musicisplaying = false
    public get musicisplaying() { return this._musicisplaying }

    private fullydownloaded = false
    private shouldplay = false
    
    constructor() {
        this._context = new AudioContext()    
        this._context.suspend()    
    }

    public onresponse = async (response: streamresponse) => {
        let integers = new Uint8Array(response.chunk)
        let newbuffer = await this._context.decodeAudioData(integers.buffer)            
        let newplayable = this.processbuffer(newbuffer)
        this.queue.push(newplayable)
        console.log("downloaded" + this.queue.length)

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
        console.log("toggle received:" + input)
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
        let volume = this.normalizevolume(source)
        volume.connect(this._context.destination)

        let newplayable: playablechunk = {
            chunk: source,
            timetoplay: dontplay,
            volume: volume
        }        
        source.onended = this.onnodeended
        return newplayable
    }

    private onnodeended = () => {
        this.currentplayingindex++  
        
        if(this.currentplayingindex >= this.queue.length &&
            this.fullydownloaded === true) {
            this.currentplayingindex = 0
        }
    }

    private normalizevolume = (buffer: AudioBufferSourceNode): GainNode => {
        let newvolume = this._context.createGain()
        newvolume.gain.value = musicvolume
        buffer.connect(newvolume)
        return newvolume        
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
        console.log("playexistingchunks")
        let shouldrequeue = this.currentplayingindex === 0 ? false : true
        let relativetimesum = 0

        for(let i = this.currentplayingindex; i < this.queue.length; i++) {
            if(shouldrequeue === true) {
                this.queue[i] = this.processbuffer(this.queue[i].chunk.buffer)                
            }
            let item = this.queue[i]
            item.timetoplay = relativetimesum   
            
            try {
                item.chunk.start(item.timetoplay)            
            }
            
            catch(e) {}
            relativetimesum += item.chunk.buffer.duration
            console.log("played at: " + item.timetoplay + "    duration: " + item.chunk.buffer.duration)
        }
        this.currentplayingindex = 1
    }

    private playnewchunk = (item: playablechunk) => {
        if(this._musicisplaying === false) {
            return
        }
        console.log("playnewchunk")
        console.log("queue length: " + this.queue.length)
        let previouschunk = this.queue[this.queue.length - 2]
        let newtimetoplay = previouschunk.timetoplay + previouschunk.chunk.buffer.duration
        item.timetoplay = newtimetoplay

        try {
            item.chunk.start(item.timetoplay)
        }
        
        catch(e) {}
        console.log("played at: " + item.timetoplay + "    duration: " + item.chunk.buffer.duration)
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
            item.timetoplay = dontplay
        }        
    }    
}