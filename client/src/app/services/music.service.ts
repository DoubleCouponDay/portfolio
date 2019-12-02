import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpRequest, HttpEvent, HttpUserEvent, HttpEventType } from '@angular/common/http';
import { api, baseroute } from '../../environments/api'
import { HubConnection, HubConnectionBuilder, JsonHubProtocol, LogLevel, IStreamResult, IStreamSubscriber, HttpTransportType, ISubscription, HubConnectionState } from '@aspnet/signalr'
import { streamhublabel, randomdeserttrackroute } from 'src/environments/environment.data';
import { loadstate, LoadingService } from './loading.service';
import { SubSink } from 'subsink';
import { isnullorundefined } from '../utility/utilities';
import { playablebuffercount, streamresponse, bufferdelay, millisecond } from './streaming.data';
import { musicvolume } from '../audio/audio.data';
const crossfade = require("crossfade")

const createbuffer = require("audio-buffer-from")

@Injectable({
  providedIn: 'root'
})
export class MusicService implements OnDestroy {
  private apploaded = false
  private subs = new SubSink()

  /**stream */
  private streamcompleted = false
  private connection: HubConnection
  private defaultsubscriber: IStreamSubscriber<streamresponse> 
  private weirdsubscription: ISubscription<streamresponse> 

  /**audio */
  private musicisplaying = false
  private audiocontext: AudioContext
  private currentbufferplayed = 0
  private buffers = new Array<AudioBuffer>()
  private tryplayagain_intervalid = 0
  private volume: GainNode
  private latency = 0
  private endoflastbufferplayed = 0

  private totalchunks = 0
  private channels = 0
  private samplerate = 0
  private bitdepth = 0

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

    this.audiocontext = new AudioContext()    
    this.audiocontext.suspend()    
    this.volume = this.audiocontext.createGain()
    this.volume.gain.value = 0.0
    this.latency = this.audiocontext.baseLatency * millisecond

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
  public playrandomdeserttrack(customsubscriber?: IStreamSubscriber<streamresponse>): boolean {
    if(this.buffers.length > 0 ||
      this.connection.state === HubConnectionState.Disconnected) {
      return false
    }
    let stream = this.connection.stream<streamresponse>(randomdeserttrackroute)        
    let chosensubscriber = isnullorundefined(customsubscriber) ?  this.defaultsubscriber : customsubscriber
    this.weirdsubscription = stream.subscribe(chosensubscriber)
    return true
  }

  private onmusicdownloaded = async (response: streamresponse) => {    
    let integers = Uint8Array.from(atob(response.chunk), c => c.charCodeAt(0))
    let audiobuffer = await this.audiocontext.decodeAudioData(integers.buffer)    
    this.buffers.push(audiobuffer)

    if(this.musicisreadytoplay() === false) {
      return
    }
    
  }

  private onstreamcomplete = () => {
    this.streamcompleted = true
    this.weirdsubscription.dispose()
    this.checkcanstart()
  }

  private checkcanstart = () => {
    this.tryplayagain_intervalid = window.setInterval(() => {
      if(this.musicisreadytoplay() === false) {
        return
      }
      window.clearInterval(this.tryplayagain_intervalid)
      this.playnextbuffer()      
    }, 500)
  }

  private onapploaded = (state: loadstate) => {
    if(state !== loadstate.done) {
      return
    }    
    this.apploaded = true    
  }

  private musicisreadytoplay(): boolean {
    let musicisnotplaying = this.musicisplaying === false    

    return this.apploaded &&
      musicisnotplaying &&
      (this.hasenoughbuffers() || this.streamcompleted)     
  }

  private hasenoughbuffers = () => {
    let buffersleft = this.buffers.length - this.currentbufferplayed    
    return buffersleft >= playablebuffercount
  }

  private playnextbuffer = () => {    
    let currentbuffer = this.buffers[this.currentbufferplayed]      

    if(isnullorundefined(currentbuffer)) {
      this.weirdsubscription.dispose()
      return 
    }

    if(this.musicisplaying === false) {
      let fullvolumetime = (this.audiocontext.currentTime + 5) / millisecond
      this.volume.gain.exponentialRampToValueAtTime(musicvolume, fullvolumetime)
    }
    this.musicisplaying = true  
    let source = this.audiocontext.createBufferSource()          
    source.buffer = currentbuffer    
    source.connect(this.audiocontext.destination)
    this.audiocontext.resume()            
    source.start()            
    let currenttimemilli = performance.now()  - this.latency
    this.checkshouldplaynextbuffer(currentbuffer, currenttimemilli)  
    this.buffers[this.currentbufferplayed] = null      
    this.currentbufferplayed++  
  }

  private checkshouldplaynextbuffer = (currentbuffer: AudioBuffer, startingtime: number) => {
    let newtime = startingtime + (currentbuffer.duration * millisecond) //in milliseconds

    let checker = () => {            
      let timefornewbuffer = performance.now() >= newtime
      let hasenoughbuffers = this.hasenoughbuffers()

      if(timefornewbuffer === true && 
        hasenoughbuffers) {
        this.playnextbuffer()
      }

      else {
        window.requestAnimationFrame(checker)
      }
    }
    window.requestAnimationFrame(checker)
  }
    
  ngOnDestroy() {    
    this.audiocontext.suspend()
    this.weirdsubscription.dispose()
    this.connection.stop()
    this.subs.unsubscribe()    
  }
}
