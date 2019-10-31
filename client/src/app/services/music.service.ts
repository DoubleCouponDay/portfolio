import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { api } from '../../environments/api'

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  constructor(private http: HttpClient) {

  }

  getrandomdeserttrack(): Observable<HttpEvent<Blob>> {
    let request = new HttpRequest<Blob>("GET", api.getrandomtrack, null, {
      responseType: "blob",
      reportProgress: true
    })
    return this.http.request<Blob>(request)
  }
}
