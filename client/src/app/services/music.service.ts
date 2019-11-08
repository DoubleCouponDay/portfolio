import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpRequest, HttpEvent, HttpUserEvent, HttpEventType } from '@angular/common/http';
import { api, baseroute } from '../../environments/api'
import { HubConnection, HubConnectionBuilder, JsonHubProtocol, LogLevel, IStreamResult, IStreamSubscriber, HttpTransportType, ISubscription, HubConnectionState } from '@aspnet/signalr'
import { streamhublabel, randomdeserttrackroute } from 'src/environments/environment.data';
import { samplerate } from '../audio/audio.data';
import { loadstate, LoadingService } from './loading.service';
import { SubSink } from 'subsink';
import { isnullorundefined } from '../utility/utilities';
import { createWorker, ITypedWorker } from 'typed-web-workers'
import { workerinput, workermessage } from './streaming.data';

const bytesneededtostart = 2_000_000

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

  private connection: HubConnection

  private subs = new SubSink()
  private defaultsubscriber: IStreamSubscriber<number[]> 
  private weirdsubscription: ISubscription<number[]>

  private thread2: ITypedWorker<workermessage, workermessage>

  constructor(loading: LoadingService) {
    let builder = new HubConnectionBuilder()
    
    this.connection = builder.configureLogging(LogLevel.Warning)
      .withUrl(baseroute + streamhublabel, {
        transport: HttpTransportType.LongPolling,
      })
      .build()

    this.defaultsubscriber = {
      next: this.onmusicdownloaded,
      error: console.error,
      complete: this.onstreamcomplete
    }


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
  
  /** can only be called once. returns false if service decided not a good time. */
  public loadrandomdeserttrack(customsubscriber?: IStreamSubscriber<number[]>): boolean {
    if(this.currentdownloadedbytes > 0 ||
      this.connection.state === HubConnectionState.Disconnected) {
      return false
    }

    let worker = (workerFunction: (input: workerinput, cb: (_: void, transfer?: ArrayBuffer) => void) => void {

    } 
    
    let onMessage?: (output: void) => void)

    let thread2 = createWorker<number, string>()
    let stream = this.connection.stream<number[]>(randomdeserttrackroute)    
    let chosensubscriber = isnullorundefined(customsubscriber) ?  this.defaultsubscriber : customsubscriber
    this.weirdsubscription = stream.subscribe(chosensubscriber)
    return true
  }

  private onmusicdownloaded = (chunk: number[]) => {    
    this.bytesfields += chunk.length
    let rawbuffer = new Float32Array(chunk)
    let newbuffer = this.audiocontext.createBuffer(1, chunk.length, samplerate)
    newbuffer.copyToChannel(rawbuffer, 0)   

    if(this.musicisreadytoplay() === false) {
      return
    }
    this.playrandomdeserttrack()
  }

  private onstreamcomplete = () => {
    this.streamcompleted = true
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
    this.audiosource.start()
  }
    
  ngOnDestroy() {
    this.audiosource.stop()
    this.connection.stop()
    this.subs.unsubscribe()
    this.weirdsubscription.dispose()
    this.thread2.terminate()
  }
}
