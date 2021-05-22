import { Component, OnInit } from '@angular/core';
import { PhoneService } from 'src/app/services/phone.service';

@Component({
  selector: 'app-dialer',
  templateUrl: './dialer.component.html',
  styleUrls: ['./dialer.component.scss'],
})
export class DialerComponent implements OnInit {

  digits = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['*', '0', '#']];
  phoneNumber: string = "";

  constructor(private phoneService: PhoneService) { }

  ngOnInit() { }

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
