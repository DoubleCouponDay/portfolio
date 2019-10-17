import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService implements OnDestroy {

  private apploaded = new Subject<loadstate>()
  private onapploaded = this.apploaded.asObservable()

  constructor() { }

  subscribeloadedevent(handler: (state: loadstate) => void) {
    return this.onapploaded.subscribe(handler)
  }

  emitloadedevent(state: loadstate) {
    this.apploaded.next(state)
  }

  ngOnDestroy() {
    this.apploaded.unsubscribe()
  }
}

export enum loadstate {
  loading,
  waitingforpress,
  done
}
