import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Service } from '../service';

@Component({
  selector: 'app-service-card',
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.css']
})

export class ServiceCardComponent implements OnInit {
    @Input() service:Service;
    private mapUrl;

    constructor(private sanitizer:DomSanitizer) {
    }

    ngOnInit() {
        this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.google.com/maps/embed/v1/place?key=AIzaSyDd_rPWLnnzAujG0NTOsDP-rh65mMgMbso&q=' + this.service.address);
    }
}
