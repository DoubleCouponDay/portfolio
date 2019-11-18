import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpRequest, HttpEvent, HttpUserEvent, HttpEventType } from '@angular/common/http';
import { api, baseroute } from '../../environments/api'
import { HubConnection, HubConnectionBuilder, JsonHubProtocol, LogLevel, IStreamResult, IStreamSubscriber, HttpTransportType, ISubscription, HubConnectionState } from '@aspnet/signalr'
import { streamhublabel, randomdeserttrackroute } from 'src/environments/environment.data';
import { loadstate, LoadingService } from './loading.service';
import { SubSink } from 'subsink';
import { isnullorundefined } from '../utility/utilities';
import { bytesneededtostart, playablebuffercount, streamresponse } from './streaming.data';

@Injectable({
  providedIn: 'root'
})
export class MusicService implements OnDestroy {
  private apploaded = false
  private subs = new SubSink()

  /**stream */
  private streamcompleted = false
  private connection: HubConnection
  private currentbufferdownloaded = 0
  private defaultsubscriber: IStreamSubscriber<streamresponse> 
  private weirdsubscription: ISubscription<streamresponse>

  /**audio */
  private musicisplaying = false
  private audiocontext: AudioContext
  private currentbufferplayed = 0
  private buffers = new Array<AudioBuffer>()
  private tryplayagain_intervalid = 0

  constructor(loading: LoadingService) {
    let builder = new HubConnectionBuilder()
    
    this.connection = builder.configureLogging(LogLevel.Warning)
      .withUrl(baseroute + streamhublabel, {
        transport: HttpTransportType.LongPolling,
      })
      .build()

    this.defaultsubscriber = {
      next: this.onmusicdownloaded,
      error: (error) => {
        console.log(error)
      },
      complete: this.onstreamcomplete
    }

    this.audiocontext = new AudioContext()        

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
        console.log(inputerror)
        let output = {
          outcome: false,
          error: inputerror
        }
        return output
      })       
  }
  
  /** can only be called once. returns false if service decided not a good time. */
  public loadrandomdeserttrack(customsubscriber?: IStreamSubscriber<streamresponse>): boolean {
    if(this.buffers.length > 0 ||
      this.connection.state === HubConnectionState.Disconnected) {
      return false
    }
    let stream = this.connection.stream<streamresponse>(randomdeserttrackroute)        
    let chosensubscriber = isnullorundefined(customsubscriber) ?  this.defaultsubscriber : customsubscriber
    this.weirdsubscription = stream.subscribe(chosensubscriber)
    return true
  }

  private onmusicdownloaded = (response: streamresponse) => {  
    if(response.totalchunks !== 0 &&
      isnullorundefined(this.buffers)) {
      this.buffers = new Array<AudioBuffer>(response.totalchunks) //lets me make correct playback decisions
    }     
    let rawbuffer = new Float32Array(response.chunk)
    let newbuffer = this.audiocontext.createBuffer(1, rawbuffer.length, 44100)
    
    newbuffer.getChannelData(0)
      .set(rawbuffer)
    this.buffers[this.currentbufferdownloaded] = newbuffer
    this.currentbufferdownloaded++

    if(this.musicisreadytoplay() === false) {
      return
    }
    this.playrandomdeserttrack()
  }

  private onstreamcomplete = () => {
    this.streamcompleted = true

    if(this.musicisreadytoplay() === true) {
      this.playrandomdeserttrack()      
    }
    
    else {
      this.tryplayagain()
    }
  }

  private tryplayagain = () => {
    this.tryplayagain_intervalid = window.setInterval(() => {
      if(this.musicisreadytoplay() === false) {
        return
      }
      window.clearInterval(this.tryplayagain_intervalid)
      this.playrandomdeserttrack()      
    }, 500)
  }

  private onapploaded = (state: loadstate) => {
    if(state !== loadstate.done) {
      return
    }    
    this.audiocontext.resume()
    this.apploaded = true    
  }

  private musicisreadytoplay(): boolean {
    let musicisnotplaying = this.musicisplaying === false    
    let buffersleft = this.buffers.length - 1 - this.currentbufferplayed
    let hasenoughbuffers = buffersleft >= playablebuffercount
    let streamonitswayout = this.streamcompleted && buffersleft < playablebuffercount

    return this.apploaded &&
      musicisnotplaying &&
      (hasenoughbuffers || streamonitswayout)     
  }

  public playrandomdeserttrack = () => {    
    this.musicisplaying = true        
    this.playanewbuffer()
  }

  private playanewbuffer = () => {
    let source = this.audiocontext.createBufferSource()
    source.connect(this.audiocontext.destination)
    let currentbuffer = this.buffers[this.currentbufferplayed]
    this.currentbufferplayed++
    source.buffer = currentbuffer    
    source.onended = this.playanewbuffer
    // source.start()        
  }
    
  ngOnDestroy() {    
    this.audiocontext.suspend()
    this.connection.stop()
    this.subs.unsubscribe()
    this.weirdsubscription.dispose()
  }
}
