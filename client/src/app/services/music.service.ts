import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpRequest, HttpEvent, HttpUserEvent, HttpEventType } from '@angular/common/http';
import { api, baseroute } from '../../environments/api'
import { HubConnection, HubConnectionBuilder, JsonHubProtocol, LogLevel, IStreamResult, IStreamSubscriber, HttpTransportType } from '@aspnet/signalr'
import { streamhublabel, randomdeserttrackroute } from 'src/environments/environment.data';
import { samplerate } from '../audio/audio.data';
import { loadstate, LoadingService } from './loading.service';
import { SubSink } from 'subsink';

const bytesneededtostart = 10_000_000

@Injectable({
  providedIn: 'root'
})
export class MusicService implements OnDestroy {

  private audiocontext: AudioContext
  private audiosource: AudioBufferSourceNode

  private currentdownloadedbytes = 0
  private streamcompleted = false
  private apploaded = false
  private musicisplaying = false

  private connection: HubConnection
  private subscriber: IStreamSubscriber<number>

  private subs = new SubSink()

  constructor(loading: LoadingService) {
    let builder = new HubConnectionBuilder()
    
    this.connection = builder.configureLogging(LogLevel.Information)
      .withUrl(baseroute + streamhublabel, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .build()

    this.subscriber = {
      next: this.onmusicdownloaded,
      closed: null,
      error: console.error,
      complete: this.onstreamcomplete
    }

    this.connection.start()
      .catch(console.error)
      .then(() => {
        this.getrandomdeserttrack()
          .subscribe(this.subscriber)
        })

    this.audiocontext = new AudioContext()
    this.audiosource = this.audiocontext.createBufferSource()
    this.audiosource.connect(this.audiocontext.destination)

    this.subs.add(loading.subscribeloadedevent(this.onapploaded))
  }
  
  private getrandomdeserttrack(): IStreamResult<number> {
    return this.connection.stream<number>(randomdeserttrackroute)      
  }
  
  private onmusicdownloaded = (chunk: number) => {    
    this.currentdownloadedbytes++
    let rawbuffer = new Float32Array([chunk])
    let newbuffer = this.audiocontext.createBuffer(1, 1, samplerate)
    newbuffer.copyToChannel(rawbuffer, 1)   
    console.log('stream chunk received') 

    if(this.musicisreadytoplay() === false) {
      return
    }
    this.play()
  }

  private onstreamcomplete = () => {
    this.streamcompleted = true
    console.log("stream completed!")

    if(this.musicisreadytoplay() === false) {
      return
    }
    this.play()
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

  private play = () => {
    this.audiosource.start()
    this.audiosource.loop = true

  }
    
  ngOnDestroy() {
    this.audiosource.stop()
    this.connection.stop()
    this.subs.unsubscribe()
  }
}
