import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpRequest, HttpEvent, HttpUserEvent, HttpEventType } from '@angular/common/http';
import { api, baseroute } from '../../environments/api'
import { HubConnection, HubConnectionBuilder, JsonHubProtocol, LogLevel, IStreamResult, IStreamSubscriber, HttpTransportType, ISubscription, HubConnectionState } from '@aspnet/signalr'
import { streamhublabel, randomdeserttrackroute } from 'src/environments/environment.data';
import { loadstate, LoadingService } from './loading.service';
import { SubSink } from 'subsink';
import { isnullorundefined } from '../utility/utilities';
import { playablebuffercount, streamresponse, bufferdelay, musicvolume } from './streaming.data';
const createBuffer = require("audio-buffer-from")

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

  private onmusicdownloaded = async (response: streamresponse) => {  
    if(this.buffers.length === 0) { //the first chunk has metadata
      this.totalchunks = response.totalchunks
      this.samplerate = response.samplerate
      this.bitdepth = response.bitdepth
      this.channels = response.channels
    }     
    let rawbuffer = new Float32Array(response.chunk)
    let newbuffer = await this.audiocontext.decodeAudioData(rawbuffer.buffer, null, console.error)

    this.buffers.push(newbuffer)
    console.log("1 buffer downloaded")

    if(this.musicisreadytoplay() === false) {
      return
    }
    this.playnextbuffer()
  }

  private onstreamcomplete = () => {
    this.streamcompleted = true

    if(this.musicisreadytoplay() === true) {
      this.playnextbuffer()      
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
      this.playnextbuffer()      
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
    let buffersleft = this.buffers.length - this.currentbufferplayed
    let hasenoughbuffers = buffersleft >= playablebuffercount

    return this.apploaded &&
      musicisnotplaying &&
      (hasenoughbuffers || this.streamcompleted)     
  }

  public playnextbuffer = () => {    
    if(this.musicisplaying === false) {
      this.volume.gain.exponentialRampToValueAtTime(musicvolume, this.audiocontext.currentTime + 1)
    }
    this.musicisplaying = true  
    let source = this.audiocontext.createBufferSource()    
    let currentbuffer = this.buffers[this.currentbufferplayed]        
    source.buffer = currentbuffer    
    source.connect(this.audiocontext.destination)
    this.currentbufferplayed++  
    this.volume.connect(this.audiocontext.destination)
    this.audiocontext.resume()        
    source.start()           
    let currenttime = this.audiocontext.currentTime
    console.log("buffer played at time: " + currenttime)

    let newtime = currenttime + currentbuffer.duration    
    this.volume.gain.exponentialRampToValueAtTime(0, newtime - 1)
    this.checkshouldplaynextbuffer(currentbuffer, currenttime, newtime)        
  }

  private checkshouldplaynextbuffer = (currentbuffer: AudioBuffer, startingtime: number, newtime: number) => {
    let checker = () => {      
      let timefornewbuffer = this.audiocontext.currentTime >= newtime

      if(timefornewbuffer === true) {
        let currenttime = this.audiocontext.currentTime
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
    this.connection.stop()
    this.subs.unsubscribe()
    this.weirdsubscription.dispose()
  }
}
