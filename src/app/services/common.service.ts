import { Injectable } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { AudioManagement } from '@ionic-native/audio-management/ngx';
import { Broadcaster } from '@ionic-native/broadcaster/ngx';
import { SMS } from '@ionic-native/sms/ngx';
import { isPlatform, ToastController } from '@ionic/angular';
import { MessagesService } from './messages.service';
import { Device, DeviceInfo } from '@capacitor/device';
import { Sim } from '@ionic-native/sim/ngx';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public deviceInfo: DeviceInfo;
  public callerId: string

  constructor(
    private audioman: AudioManagement,
    private broadcaster: Broadcaster,
    private messages: MessagesService,
    private sms: SMS,
    private androidPermissions: AndroidPermissions,
    private toastController: ToastController,
    private sim: Sim
  ) {
    if (isPlatform('android')) {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.SEND_SMS).then(
        result => console.log('Has permission?', result.hasPermission),
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.SEND_SMS)
      );
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_PHONE_STATE).then(
        result => console.log('Has permission?', result.hasPermission),
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_PHONE_STATE)
      );
      this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.SEND_SMS, this.androidPermissions.PERMISSION.READ_PHONE_STATE]);
      this.broadcaster.addEventListener('android.media.RINGER_MODE_CHANGED', true).subscribe((event) => {
        console.log('Event Run type', event["android.media.EXTRA_RINGER_MODE"]);
        if (event["android.media.EXTRA_RINGER_MODE"] != 2) {
          this.setRingVolMax();
        }
      });
    }
    this.logDeviceInfo()
  }

  logDeviceInfo = async () => {
    const info = await Device.getInfo();
    console.log(info);
    this.deviceInfo = info
    this.sim.hasReadPermission().then(
      (info) => {
        console.log('Has permission: ', info)
        this.sim.getSimInfo().then(
          (info) => {
            console.log('Sim info: ', info);
            this.callerId = info.phoneNumber.substr(-10, 10);
          },
          (err) => console.log('Unable to get sim info: ', err)
        ).catch((error) => {
          this.presentToast('Unable to read Sim info')
        })
      }
    ).catch((error) => {
      this.presentToast('Unable to read Sim')
    })
  };


  public setRingVolMax() {
    this.audioman.setAudioMode(AudioManagement.AudioMode.NORMAL)
      .then((response) => {
        console.log('Set Audio Mode to Normal')
        this.audioman.getMaxVolume(AudioManagement.VolumeType.RING)
          .then(response => this.audioman.setVolume(AudioManagement.VolumeType.RING, response.maxVolume))
          .catch(err => console.error('Error setting audio volume to Max', err))
      })
      .catch(err => console.error('Error setting audio mode to normal', err))
  }

  public async sendSMS(number?: string) {
    // Send an SMS
    // var number = '9110123627'; 
    //document.getElementById('numberTxt').value.toString(); /* iOS: ensure number is actually a string */
    let message: string = this.messages.settings.missed;
    let hour = new Date().getHours();
    hour > 18 || hour < 9 ? message = this.messages.settings.offHours : null;
    console.log("number=" + number + ", message= " + message);

    //CONFIGURATION
    var options = {
      replaceLineBreaks: false, // true to replace \n by a new line, false by default
      android: {
        // intent: 'INTENT'  // send SMS with the native android SMS messaging
        intent: '' // send SMS without opening any other app, require : android.permission.SEND_SMS and android.permission.READ_PHONE_STATE
      }
    };

    // var success = function () { alert('Message sent successfully'); };
    // var error = function (e) { alert('Message Failed:' + e); };
    return this.sms.send(number, message, options);
  }

  public async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
}
