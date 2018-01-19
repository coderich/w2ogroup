import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';


@Injectable()
export class GeoService {

    constructor(private http:HttpClient) {
    }

    isBrowserEnabled() {
        if ('geolocation' in navigator) return true;
        return false;
    }

    getCurrentPosition():Observable<any> {
        return new Observable((obv) => {
            navigator.geolocation.getCurrentPosition(function(position) {
                obv.next({latitude:position.coords.latitude, longitude:position.coords.longitude});
                obv.complete();
            });
        });
    }

    geocodeAddress(address):Observable<any> {
        return this.http.get<any[]>('http://localhost:3000/api/geocode?q=' + address).pipe(
            catchError(this.handleError('geo.geocodeAddress', {latitude:0, longitude:0}))
        );
    }

    autocomplete(query) {
        return this.http.get<any[]>('http://localhost:3000/api/autocomplete?q=' + query).pipe(
            catchError(this.handleError('geo.autocomplete', []))
        );
    }

    private handleError<T>(operation='operation', result?:T) {
        return (error:any):Observable<T> => {
            console.error(error);
            return of(result as T);
        };
    }
}
