import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  missedKey: string = 'missedText';
  offHoursKey: string = 'offText';
  public missed: string = null;
  public offHours: string = null;
  defaultMissedMessage: string = `Thankyou for contacting Shubham Auto. Sorry, We couldn’t attend to your call right now. We will call you back as soon as possible. You can also contact us through WhatsApp. http://bit.ly/shubhamauto-whatsapp`;
  defaultOffMessage: string = `Thankyou for contacting Shubham Auto. Sorry, We couldn’t attend to your call right now. We will call you back during office hours i.e 9 am to 6 pm. You can also contact us through WhatsApp. http://bit.ly/shubhamauto-whatsapp`;
  constructor(
    private storage: StorageService
  ) {
    this.missed = this.defaultMissedMessage;
    this.offHours = this.defaultOffMessage;
  }

  public init() {
    this.storage.get(this.missedKey)
      .then((message) => {
        message ? this.missed = message : this.missed = this.defaultMissedMessage;
      })
      .catch((err) => {
        console.log('Unable to get Missed', err)
      })
    this.storage.get(this.offHoursKey)
      .then((message) => {
        message ? this.offHours = message : this.offHours = this.defaultOffMessage;
      })
      .catch((err) => {
        console.log('Unable to get OffHours', err)
      })
  }

  public setMessage() {
    this.storage.set(this.missedKey, this.missed);
    this.storage.set(this.offHoursKey, this.offHours);
  }
}
