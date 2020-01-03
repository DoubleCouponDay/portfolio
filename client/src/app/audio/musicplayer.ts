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

        if(this._musicisplaying === true) {
            this.playnewchunk(newplayable)
        }

        else {
            this.playexistingchunks()
        }
    }

    public toggleplayback = (input: boolean) => {
        console.log("toggle received:" + input)

        if(input === true) {            
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
    
    private playexistingchunks = () => {
        if(this._musicisplaying === true) {
            return
        }
        this._musicisplaying = true
        console.log("playexistingchunks")
        let shouldrequeue = this.currentplayingindex === 0 ? false : true
        let relativetimesum = 0

        for(let i = this.currentplayingindex; i < this.queue.length; i++) {
            if(shouldrequeue === true) {
                this.queue[i] = this.processbuffer(this.queue[i].chunk.buffer)                
            }
            let item = this.queue[i]
            item.timetoplay = relativetimesum            
            item.chunk.start(item.timetoplay)            
            relativetimesum += item.chunk.buffer.duration
        }
    }

    private playnewchunk = (chunk: playablechunk) => {
        if(this._musicisplaying === false) {
            return
        }
        console.log("playnewchunk")
        let lastchunk = this.queue[this.queue.length - 1]
        let newtimetoplay = lastchunk.timetoplay + lastchunk.chunk.buffer.duration
        chunk.timetoplay = newtimetoplay

        try {
            chunk.chunk.start(chunk.timetoplay)
        }
        
        catch(e) {}
    }
}