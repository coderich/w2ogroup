import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Service } from './service';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class SeeClickFixService {
  constructor(private http:HttpClient) {

  }

  getServices(lat, lon):Observable<Service[]> {
    return this.http.get<Service[]>('http://localhost:3000/service?lat=' + lat + '&lon=' + lon);
  }
}
