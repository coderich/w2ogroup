import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Service } from './service';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class SeeClickFixService {
    constructor(private http:HttpClient) {
    }

    findByLatLng(lat, lon):Observable<Service[]> {
        return this.http.get<Service[]>('http://localhost:3000/service?lat=' + lat + '&lon=' + lon).pipe(
            catchError(this.handleError('scf.findByLatLng', []))
        );
    }

    private handleError<T>(operation='operation', result?:T) {
        return (error:any):Observable<T> => {
            console.error(error);
            return of(result as T);
        };
    }
}
