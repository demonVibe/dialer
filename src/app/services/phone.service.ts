import { Injectable } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Injectable({
  providedIn: 'root'
})
export class PhoneService {

  constructor(
    private callNumber: CallNumber,
  ) { }

  dialNumber(num: string) {
    this.callNumber.callNumber(num, true)
      .then(res => console.log('dialed number!', res))
      .catch(err => console.log('Error launching dialer', err));
  }
}
