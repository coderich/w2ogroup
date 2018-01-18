import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ServiceCardComponent } from './service-card/service-card.component';
import { ServicesComponent } from './services/services.component';
import { AppRoutingModule } from './/app-routing.module';
import { SeeClickFixService } from './see-click-fix.service';
import { GeoService } from './geo.service';


@NgModule({
  declarations: [
    AppComponent,
    ServiceCardComponent,
    ServicesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [SeeClickFixService, GeoService],
  bootstrap: [AppComponent]
})

export class AppModule { }
