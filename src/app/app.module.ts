import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AudioManagement } from '@ionic-native/audio-management/ngx';
import { Broadcaster } from '@ionic-native/broadcaster/ngx';
import { IonicStorageModule } from '@ionic/storage-angular';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { CallLog } from '@ionic-native/call-log/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { SMS } from '@ionic-native/sms/ngx';
import { DialerComponent } from './pages/dialer/dialer.component';

@NgModule({
  declarations: [AppComponent, DialerComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, IonicStorageModule.forRoot()],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, AudioManagement, Broadcaster, CallNumber, CallLog, AndroidPermissions, SMS],
  bootstrap: [AppComponent],
})
export class AppModule { }
