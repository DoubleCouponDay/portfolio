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

@Injectable({
  providedIn: 'root'
})
export class MusicService implements OnDestroy {
  private subs = new SubSink()

  /*stream */
  private connectbuilder = new HubConnectionBuilder()

  private _connection: HubConnection
  public get connection() { return this._connection }

  private defaultsubscriber: IStreamSubscriber<streamresponse> 
  private weirdsubscription: ISubscription<streamresponse> 

  /*audio */
  private _musicplayer = new musicplayer()
  public get musicplayer() { return this._musicplayer }

  constructor(loading: LoadingService) {
    this.defaultsubscriber = {
      next: this._musicplayer.onnewbuffer,
      error: console.error,
      complete: this.onstreamcomplete
    }

    this.subs.add(
      loading.subscribeloadedevent(this.onapploaded)
    )
  }

  public async startconnection() {
    this._connection = this.connectbuilder.configureLogging(LogLevel.Warning)
      .withUrl(baseroute + streamhublabel, {
        transport: HttpTransportType.LongPolling,
      })
      .build()

    await this._connection.start()
  }
  
  public async playrandomdeserttrack(customsubscriber?: IStreamSubscriber<streamresponse>) {
    if(this._connection.state === HubConnectionState.Disconnected) {
      await this.startconnection()
    }
    let stream = this._connection.stream<streamresponse>(randomdeserttrackroute)        
    let chosensubscriber = isnullorundefined(customsubscriber) ?  this.defaultsubscriber : customsubscriber
    this.weirdsubscription = stream.subscribe(chosensubscriber)
  }

  public pause() {
    this._musicplayer.toggleplayback(false)
  }

  private onstreamcomplete = () => {
    this.weirdsubscription.dispose()
    this._musicplayer.onfullydownloaded()
  }

  private onapploaded = (state: loadstate) => {
    if(state !== loadstate.done) {
      return
    }    
    this._musicplayer.toggleplayback(true)
  }
    
  ngOnDestroy() {    
    this.weirdsubscription.dispose()
    this._connection.stop()
    this.subs.unsubscribe()    
  }
}
