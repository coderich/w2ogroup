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
    private searchTerms = new Subject<string>();
    private places$:Observable<any>;
    private loading = false;
    private query = '';

    constructor(private seeClickFixService:SeeClickFixService, private geoService:GeoService) {
    }

    ngOnInit() {
        // Store latLng if user ever wants to use current position
        if (this.geoService.isBrowserEnabled()) {
            this.geoService.getCurrentPosition().subscribe(obj => {
                this.latLng = obj;
                this.geoStatus = true;
            });
        }

        // places$ is an Observable using for input autocomplete
        // https://angular.io/tutorial/toh-pt6#!#observables
        this.places$ = this.searchTerms.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap((term:string) => this.geoService.autocomplete(term))
        );
    }

    /**
     * Take user input, geocode, then find by lat lng
     */
    findByQuery():void {
        if (!this.query || !this.query.length) return;

        this.geoService.geocodeAddress(this.query).subscribe(obj => {
            this.findByLatLng(obj.latitude, obj.longitude);
        });

        this.query = '';
        this.loading = true;
        this.searchTerms.next('');
    }

    /**
     * Request data from the seeClickFixService service.
     */
    findByLatLng(lat, lng):void {
        this.loading = true;
        this.searchTerms.next('');

        this.seeClickFixService.findByLatLng(lat, lng).subscribe(services => {
            this.transformResponse(services);
            this.loading = false;
        });
    }

    /**
     * Transforms response from the API into something more "interesting" for UI consumption:
     *    - Groups by service code
     *    - Sorts by open listings on both the group level and individual listings
     */
    transformResponse(data) {
        var self = this;
        this.services = data;

        // Sort all services by open first, then closed
        data.sort(function(a, b) {
            if (a.status == 'open' && b.status == 'closed') return -1;
            if (a.status == 'closed' && b.status == 'open') return 1;
            return 0;
        });

        // Create a map, keyed by code, that groups listings
        this.serviceMap = data.reduce(function(prev, curr) {
            prev[curr.code] = prev[curr.code] || {name:curr.name, closed:0, open:0, items:[]};

            if (curr.status == 'open') prev[curr.code].open++;
            if (curr.status == 'closed') prev[curr.code].closed++;
            prev[curr.code].items.push(curr);

            return prev;
        }, {});

        // Keys are sorted by those having the most items open
        this.serviceKeys = Object.keys(this.serviceMap).sort(function(a, b) {
            return self.serviceMap[b].open - self.serviceMap[a].open;
        });
    }

    autocomplete():void {
        this.searchTerms.next(this.query);
    }

    useCurrentLocation():void {
        this.findByLatLng(this.latLng.latitude, this.latLng.longitude);
    }

    usePlace(place):void {
        this.query = place.description;
        this.searchTerms.next('');
        // this.findByQuery(); // Could do this too
    }
}
