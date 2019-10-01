import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class mouseservice implements OnDestroy {

  private mousewasreleased = new Subject<MouseEvent>()
  private onmousereleased = this.mousewasreleased.asObservable()

  private mousewasmoved = new Subject<MouseEvent>()
  private onmousemoved = this.mousewasmoved.asObservable()

  constructor() { }

  emitreleasedevent(event: MouseEvent): void {
    this.mousewasreleased.next(event)
  }

  subscribereleasedevent(callback: (event: MouseEvent) => void): Subscription {
    return this.onmousereleased.subscribe(callback)
  }

  emitmousemovedevent(event: MouseEvent): void {
    this.mousewasmoved.next(event)
  }

  subscribemovedevent(callback: (event: MouseEvent) => void): Subscription {
    return this.onmousemoved.subscribe(callback)
  }

  ngOnDestroy() {
    this.mousewasreleased.unsubscribe()
    this.mousewasmoved.unsubscribe()
  }  
}
