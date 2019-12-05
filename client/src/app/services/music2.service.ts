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
import { musicplayer } from '../audio/musicplayer';
const crossfade = require("crossfade")

const createbuffer = require("audio-buffer-from")

@Injectable({
  providedIn: 'root'
})
export class Music2Service implements OnDestroy {
  private apploaded = false
  private subs = new SubSink()

  /*stream */
  private streamcompleted = false
  private connectbuilder = new HubConnectionBuilder()
  private connection: HubConnection
  private defaultsubscriber: IStreamSubscriber<streamresponse> 
  private weirdsubscription: ISubscription<streamresponse> 

  /*audio */
  private musicplayer = new musicplayer()

  constructor(loading: LoadingService) {
    this.defaultsubscriber = {
      next: this.musicplayer.onnewbuffer,
      error: console.error,
      complete: this.onstreamcomplete
    }

    this.subs.add(
      loading.subscribeloadedevent(this.onapploaded)
    )
  }

  public async startconnection() {
    this.connection = this.connectbuilder.configureLogging(LogLevel.Warning)
      .withUrl(baseroute + streamhublabel, {
        transport: HttpTransportType.LongPolling,
      })
      .build()

    await this.connection.start()
  }
  
  public async playrandomdeserttrack(customsubscriber?: IStreamSubscriber<streamresponse>) {
    if(this.connection.state === HubConnectionState.Disconnected) {
      await this.startconnection()
    }
    let stream = this.connection.stream<streamresponse>(randomdeserttrackroute)        
    let chosensubscriber = isnullorundefined(customsubscriber) ?  this.defaultsubscriber : customsubscriber
    this.weirdsubscription = stream.subscribe(chosensubscriber)
    this.musicplayer.toggleplayback(true)
  }

  public pause() {
    this.musicplayer.toggleplayback(false)
  }

  private onstreamcomplete = () => {
    this.streamcompleted = true
    this.weirdsubscription.dispose()

    if(this.apploaded === false) {
      return
    }
    this.musicplayer.toggleplayback(true)
  }

  private onapploaded = (state: loadstate) => {
    if(state !== loadstate.done) {
      return
    }    
    this.apploaded = true
  }
    
  ngOnDestroy() {    
    this.weirdsubscription.dispose()
    this.connection.stop()
    this.subs.unsubscribe()    
  }
}
