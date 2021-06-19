import { Component } from '@angular/core';
import { getPlatforms, isPlatform, Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { AudioManagement } from '@ionic-native/audio-management/ngx';
import { CommonService } from './services/common.service';
import { MessagesService } from './services/messages.service';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private platform: Platform,
    private audioman: AudioManagement,
    private common: CommonService,
    private messages: MessagesService,
    private backgroundMode: BackgroundMode
  ) {
    this.platform.ready().then(() => {
      if (isPlatform('android')) {
        this.initAppFunc();
        this.backgroundService();
      }
    })
  }

  initAppFunc() {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1500)
    this.messages.init();
    this.audioman.getAudioMode()
      .then((value: AudioManagement.AudioModeReturn) => {
        console.log('Device audio mode is ' + value.label + ' (' + value.audioMode + ')', value);
        if (value.audioMode != 2)
          this.common.setRingVolMax();
      })
      .catch((reason) => {
        console.log(reason);
      });
  }
  backgroundService() {
    this.backgroundMode.enable();
    this.backgroundMode.on('enable')
      .subscribe(() => {
        console.log('enable called')
        // this.backgroundMode.disableWebViewOptimizations(); 
      }, err => console.log('error background mode'));

    this.backgroundMode.on('disable')
      .subscribe(() => {
        console.log('disable called')
      }, err => console.log('error background mode'));

    this.backgroundMode.on('activate')
      .subscribe(() => {
        console.log('activate called')
      }, err => console.log('error background mode'));

    this.backgroundMode.on('deactivate')
      .subscribe(() => {
        console.log('deactivate called')
      }, err => console.log('error background mode'));

    this.backgroundMode.on('failure')
      .subscribe(() => {
        console.log('failure called')
      }, err => console.log('error background mode'));
  }
}
