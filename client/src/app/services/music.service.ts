import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpRequest, HttpEvent, HttpUserEvent, HttpEventType } from '@angular/common/http';
import { api, baseroute } from '../../environments/api'
import { HubConnection, HubConnectionBuilder, JsonHubProtocol, LogLevel, IStreamResult, IStreamSubscriber, HttpTransportType, ISubscription, HubConnectionState } from '@aspnet/signalr'
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
  private weirdsubscription: ISubscription<number>

  constructor(loading: LoadingService) {
    let builder = new HubConnectionBuilder()
    
    this.connection = builder.configureLogging(LogLevel.Information)
      .withUrl(baseroute + streamhublabel, {
        skipNegotiation: false,
        transport: HttpTransportType.WebSockets,
      })
      .build()

    this.subscriber = {
      next: this.onmusicdownloaded,
      closed: null,
      error: console.error,
      complete: this.onstreamcomplete
    }
    this.audiocontext = new AudioContext()
    this.audiosource = this.audiocontext.createBufferSource()
    this.audiosource.connect(this.audiocontext.destination)

    this.subs.add(
      loading.subscribeloadedevent(this.onapploaded)
    )
  }

  public startconnection(): Promise<{outcome: boolean, error?: Error}> {
    return this.connection.start()
      .then(() => {
        return {
          outcome:true
        }
      })
      .catch((inputerror: Error) => {
        console.error(inputerror)
        let output = {
          outcome: false,
          error: inputerror
        }
        return output
      })       
  }
  
  /** can only be called once */
  public playrandomdeserttrack(): boolean {
    if(this.currentdownloadedbytes >= 0 ||
      this.connection.state === HubConnectionState.Disconnected) {
      return false
    }
    let stream = this.connection.stream<number>(randomdeserttrackroute)    
    this.weirdsubscription = stream.subscribe(this.subscriber)   
    return true 
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
    this.weirdsubscription.dispose()
  }
}
