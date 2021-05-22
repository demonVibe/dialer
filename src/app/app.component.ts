import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { AudioManagement } from '@ionic-native/audio-management/ngx';
import { CommonService } from './services/common.service';
import { MessagesService } from './services/messages.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private platform: Platform,
    private audioman: AudioManagement,
    private common: CommonService,
    private messages: MessagesService
  ) {
    this.platform.ready().then(() => {
      this.initAppFunc();
    })
  }

  initAppFunc() {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000)
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
}
