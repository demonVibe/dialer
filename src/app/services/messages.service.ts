import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Settings } from '../interfaces/settings';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  settingsKey: string = 'settings';
  public settings: Settings = {
    useSMS: true,
    useVoice: false,
    missed: `Thankyou for contacting ${environment.company}. Sorry, We couldn’t attend to your call right now. We will call you back as soon as possible. You can also contact us through WhatsApp. ${environment.whatsapp}`,
    offHours: `Thankyou for contacting ${environment.company}. Sorry, We couldn’t attend to your call right now. We will call you back during office hours i.e 9 am to 6 pm. You can also contact us through WhatsApp. ${environment.whatsapp}`
  };

  constructor(
    private storage: StorageService
  ) {
  }

  public init() {
    console.log('settings key', this.settingsKey)
    this.storage.get(this.settingsKey)
      .then((settings) => {
        console.log('got settings', settings)
        if (settings) {
          this.settings = settings
        }
      })
      .catch((err) => {
        console.log('Unable to get Settings', err)
      })
  }

  public saveSettings() {
    this.storage.set(this.settingsKey, this.settings);
  }
}
