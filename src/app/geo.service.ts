import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class GeoService {
    private geocoder;

    constructor(private http:HttpClient) {
        this.geocoder = new google.maps.Geocoder();
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
        return this.http.get<any[]>('http://localhost:3000/geocode?q=' + address);
    }

    autocomplete(query) {
        return this.http.get<any[]>('http://localhost:3000/autocomplete?q=' + query);
    }
}
