import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Service } from '../service';
import { SeeClickFixService } from '../see-click-fix.service';
import { GeoService } from '../geo.service';

@Component({
    selector: 'app-services',
    templateUrl: './services.component.html',
    styleUrls: ['./services.component.css']
})

export class ServicesComponent implements OnInit {
    private services:Service[];
    private serviceMap;
    private serviceKeys;
    private geoStatus;
    private latLng;
    private query = '';
    private searchTerms = new Subject<string>;
    private places$:Observable<any>;
    private loading = false;

    constructor(private seeClickFixService:SeeClickFixService, private geoService:GeoService) {

    }

    ngOnInit() {
        if (this.geoService.isBrowserEnabled()) {
            this.geoService.getCurrentPosition().subscribe(obj => {
                this.latLng = obj;
                this.geoStatus = true;
            });
        }

        this.places$ = this.searchTerms.pipe(
            // wait 300ms after each keystroke before considering the term
            debounceTime(300),

            // ignore new term if same as previous term
            distinctUntilChanged(),

            // switch to new search observable each time the term changes
            switchMap((term:string) => this.geoService.autocomplete(term))
        );
    }

    setServices(data) {
        var self = this;
        this.services = data;

        // Sort all services by open first, then closed
        data.sort(function(a, b) {
            if (a.status == 'open' && b.status == 'closed') return -1;
            if (a.status == 'closed' && b.status == 'open') return 1;
            return 0;
        });

        this.serviceMap = data.reduce(function(prev, curr) {
            prev[curr.code] = prev[curr.code] || {name:curr.name, closed:0, open:0, items:[]};

            if (curr.status == 'open') prev[curr.code].open++;
            if (curr.status == 'closed') prev[curr.code].closed++;
            prev[curr.code].items.push(curr);

            return prev;
        }, {});

        // Sort by open items
        this.serviceKeys = Object.keys(this.serviceMap).sort(function(a, b) {
            return self.serviceMap[b].open - self.serviceMap[a].open;
        });
    }

    autocomplete():void {
        this.searchTerms.next(this.query);
    }

    useCurrentLocation():void {
        this.query = this.latLng.latitude + ',' + this.latLng.longitude;
    }

    usePlace(place):void {
        this.query = place.description;
        this.searchTerms.next([]);
    }

    queryServices():void {
        if (!this.query || !this.query.length) return;

        var arr = this.query.split(',');

        if (arr.length == 2) {
            try {
                var lat = parseFloat(arr[0]);
                var lon = parseFloat(arr[1]);
                this.getServices(lat, lon);
            } catch (e) {
                // Probably not lat,lng
            }
        } else {
            this.geoService.geocodeAddress(this.query).subscribe(obj => {
                this.getServices(obj.latitude, obj.longitude);
            });
        }

        this.query = '';
    }

    getServices(lat, lon):void {
        this.loading = true;

        this.seeClickFixService.getServices(lat, lon).subscribe(services => {
            this.setServices(services);
            this.searchTerms.next([]);
            this.loading = false;
        });
    }
}
