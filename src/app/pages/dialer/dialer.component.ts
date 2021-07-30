import { Component, OnInit } from '@angular/core';
import { PhoneService } from 'src/app/services/phone.service';
import { Clipboard } from '@capacitor/clipboard';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-dialer',
  templateUrl: './dialer.component.html',
  styleUrls: ['./dialer.component.scss'],
})
export class DialerComponent implements OnInit {

  digits = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['*', '0', '#']];
  phoneNumber: string = "";

  constructor(private phoneService: PhoneService, private common: CommonService) { }

  ngOnInit() {
    const checkClipboard = async () => {
      const { type, value } = await Clipboard.read();

      console.log(`Got ${type} from clipboard: ${value}`);
      if (type == "text/plain") {
        let rawText = value.replace(/\s/g, '').substr(-13, 13)
        if (rawText.startsWith('+91') || rawText.startsWith('0') || rawText.startsWith('9') || rawText.startsWith('8') || rawText.startsWith('7') || rawText.startsWith('6'))
          rawText.length >= 10 ? this.phoneNumber = rawText.substr(-10, 10) : null;
        // this.common.presentToast(`Got ${rawText} from clipboard`)
      }
    };
    checkClipboard();
  }

  dialIn(digit) {
    this.phoneNumber += digit;
  }

  call() {
    this.phoneService.dialNumber(this.phoneNumber);
  }

  clearDigit() {
    this.phoneNumber = this.phoneNumber.slice(0, -1)
  }
}
