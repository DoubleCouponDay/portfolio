import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { api } from '../../environments/api'

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  constructor(private http: HttpClient) { }

  getrandomdeserttrack(): Observable<any> {
    return this.http.get<any>(api.getrandomtrack)
  }
}
