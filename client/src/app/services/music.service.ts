import { Injectable, OnDestroy } from '@angular/core';
import { api, baseroute } from '../../environments/api'
import { samplerate } from '../audio/audio.data';
import { loadstate, LoadingService } from './loading.service';
import { SubSink } from 'subsink';
import { isnullorundefined } from '../utility/utilities';
import { messagestate, workerfilepath, streampartial } from './streaming.data';

const bytesneededtostart = 1_000_000

@Injectable({
  providedIn: 'root'
})
export class MusicService implements OnDestroy {

  private audiocontext: AudioContext
  private audiosource: AudioBufferSourceNode  
  private bytesfields = 0

  public get currentdownloadedbytes(): number {
    return this.bytesfields
  }
  private streamcompleted = false
  private apploaded = false
  private musicisplaying = false
  private streamconnected = false

  private subs = new SubSink()

  private thread2: Worker

  constructor(loading: LoadingService) {
    let sub1 = loading.subscribeloadedevent(this.onapploaded)
    this.subs.add(sub1)
  }

  public startconnection(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if(this.streamconnected === true) {
        reject("already connected")
        return
      }
      this.thread2 = new Worker(workerfilepath)
      this.thread2.onerror = console.error

      this.thread2.onmessage = (message) => {
        switch(message.data) {
          case messagestate.response_connected:
            resolve(true)
            this.cleanupthreadscallback()
            break

          case messagestate.response_connectfailed:
            resolve(false)
            this.cleanupthreadscallback()
            break          
        }
      }
      this.thread2.postMessage(messagestate.request_connecttoserver)        
    })    
  }

  private cleanupthreadscallback() {
    this.thread2.onmessage = null
  }
  
  /** can only be called once. returns false if service decided not a good time. */
  public loadrandomdeserttrack(onchunkreceived?: (output: streampartial) => void): boolean {
    if(this.currentdownloadedbytes > 0 ||
      this.streamconnected === false) {
      return false
    }
    this.thread2.onmessage = (output) => { this.onstream(output, onchunkreceived) }
    this.thread2.postMessage(messagestate.request_startstreaming)
    return true
  }
  
  private onstream = (output: MessageEvent, onchunkreceived?: (output: streampartial) => void) => {    
    let castdata = <streampartial>output.data

    switch(castdata.state) {
      case messagestate.response_haveachunk:        
        let chosenaction = isnullorundefined(onchunkreceived) ? this.onmusicdownloaded : onchunkreceived
        chosenaction(castdata)
        break

      case messagestate.response_finishedtreaming:
        this.onstreamcomplete()
        break
    }
  }

  private onmusicdownloaded = (output: streampartial) => {    
    this.bytesfields += output.chunk.length
    let newbuffer = this.audiocontext.createBuffer(1, output.chunk.length, samplerate)
    newbuffer.copyToChannel(output.chunk, 0)   

    if(this.musicisreadytoplay() === false) {
      return
    }
    this.playrandomdeserttrack()
  }

  private onstreamcomplete = () => {
    this.streamcompleted = true
    this.cleanupthreadscallback()
    this.thread2.terminate()
    console.log("stream fully loaded!")

    let intervalid = window.setInterval(() => {
      if(this.musicisreadytoplay() === false) {
        return
      }
      this.playrandomdeserttrack()
      window.clearInterval(intervalid)
    }, 500)
  }

  private onapploaded = (state: loadstate) => {
    if(state !== loadstate.done) {
      return
    }    
    this.apploaded = true    
  }

  private musicisreadytoplay(): boolean {
    return (this.currentdownloadedbytes >= bytesneededtostart ||
      this.streamcompleted === true) &&
      this.apploaded === true &&
      this.musicisplaying === false
  }

  public playrandomdeserttrack = () => {
    this.musicisplaying = true
    this.audiosource.start()
  }
    
  ngOnDestroy() {    
    this.audiosource.stop()
    this.subs.unsubscribe()
    this.thread2.terminate()
  }
}
