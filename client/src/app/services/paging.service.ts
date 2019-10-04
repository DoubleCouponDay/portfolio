import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagingService {

  private pagewaschanged = new Subject<number>()
  private onpagechanged = this.pagewaschanged.asObservable()

  private pagecompleted = new Subject<number>()
  private onpagecompleted = this.pagecompleted.asObservable()

  constructor() { }

  emitpagechange(pagenumber: number) {
    return this.pagewaschanged.next(pagenumber)
  }

  subscribepagechange(callback: (pagenumber: number) => void): Subscription {
    return this.onpagechanged.subscribe(callback)
  }

  emitpagecompletedmove(pagenumber: number) {
    return this.pagecompleted.next(pagenumber)
  }

  subscribepagecompletedmove(callback: (pagenumber: number) => void): Subscription {
    return this.onpagecompleted.subscribe(callback)
  }
}
