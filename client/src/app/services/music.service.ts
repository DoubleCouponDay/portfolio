import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpRequest, HttpEvent, HttpUserEvent } from '@angular/common/http';
import { api } from '../../environments/api'
import { streamresponse } from '../audio/audio.data';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  constructor(private http: HttpClient) {

  }

  getrandomdeserttrack(): Observable<any> {
    let request = new HttpRequest<ArrayBuffer>("GET", api.getrandomtrack, null, {
      responseType: "arraybuffer",
      reportProgress: false
    })
    return this.http.request<any>(request)
  }
}
