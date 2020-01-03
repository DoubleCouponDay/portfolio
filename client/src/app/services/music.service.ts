import { Injectable, OnDestroy } from '@angular/core';
import { baseroute } from '../../environments/api'
import { HubConnection, HubConnectionBuilder, LogLevel, IStreamSubscriber, HttpTransportType, ISubscription, HubConnectionState } from '@aspnet/signalr'
import { streamhublabel, randomdeserttrackroute } from 'src/environments/environment.data';
import { loadstate, LoadingService } from './loading.service';
import { SubSink } from 'subsink';
import { isnullorundefined } from '../utility/utilities';
import { streamresponse, } from './streaming.data';
import { musicplayer } from '../audio/musicplayer';

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
      next: this._musicplayer.onresponse,
      error: this.onerror,
      complete: this.onfullydownloaded
    }

    this.subs.add(
      loading.subscribeloadedevent(this.onapploaded)
    )
    window.addEventListener("beforeunload", this.ngOnDestroy)
  }

  public async startconnection() {
    this._connection = this.connectbuilder.configureLogging(LogLevel.Warning)
      .withUrl(baseroute + streamhublabel, {
        transport: HttpTransportType.LongPolling,
      })
      .build()
    await this._connection.start()
  }
  
  public async playrandomdeserttrack(overridesubscriber?: IStreamSubscriber<streamresponse>) {
    if(this._connection.state === HubConnectionState.Disconnected) {
      await this.startconnection()
    }

    if(this._musicplayer.musicisplaying) {
      this._musicplayer.toggleplayback(true)
      return
    }
    let stream = this._connection.stream<streamresponse>(randomdeserttrackroute)        
    let chosensubscriber = isnullorundefined(overridesubscriber) ?  this.defaultsubscriber : overridesubscriber
    this.weirdsubscription = stream.subscribe(chosensubscriber)
  }

  public restart = () => {
    this._musicplayer.toggleplayback(true)
  }

  public pause = () => {
    this._musicplayer.toggleplayback(false)
  }

  private onapploaded = (state: loadstate) => {
    if(state !== loadstate.done) {
      return
    }    
    this._musicplayer.toggleplayback(true)
  }

  private onerror = (problem: Error) => {
    console.error(problem)
    this.ngOnDestroy()
  }

  private onfullydownloaded = () => {
    this._musicplayer.ondownloadcomplete()
  }
    
  ngOnDestroy = () => {    
    
    this.weirdsubscription.dispose()
    this._connection.stop()
    this.subs.unsubscribe()    
  }
}
