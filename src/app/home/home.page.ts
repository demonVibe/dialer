import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Broadcaster } from '@ionic-native/broadcaster/ngx';
import { CallLog, CallLogObject } from '@ionic-native/call-log/ngx';
import { ModalController } from '@ionic/angular';
import { Logs } from '../interfaces/logs';
import { DialerComponent } from '../pages/dialer/dialer.component';
import { LogsService } from '../services/logs.service';
import { PhoneService } from '../services/phone.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage {

  filteredLogs: Logs[] = [];
  unFilteredLogs: Logs[] = [];
  logFilters: CallLogObject[] = [{
    "name": "type",
    "value": '1',
    "operator": ">="
  }, {
    "name": "date",
    "value": JSON.stringify(Date.now() - 86400000),
    "operator": ">="
  }];

  constructor(
    private callLog: CallLog,
    private broadcaster: Broadcaster,
    private logs: LogsService,
    private cd: ChangeDetectorRef,
    private modalController: ModalController,
    private phoneService: PhoneService
  ) {
    // this.unFilteredLogs = [
    //   { "date": new Date(1621002230943), "number": "6505551212", "type": 3, "duration": 0, "name": "", "photo": "", "messageSent": true },
    //   { "date": new Date(1221002238943), "number": "5505551222", "type": 1, "duration": 90, "name": "", "photo": "", "messageSent": false },
    //   { "date": new Date(1521002260943), "number": "8505541212", "type": 3, "duration": 0, "name": "", "photo": "", "messageSent": false },
    //   { "date": new Date(1621002290943), "number": "9505251212", "type": 2, "duration": 37, "name": "", "photo": "", "messageSent": false }
    // ]

    this.broadcaster.addEventListener('android.intent.action.PHONE_STATE', true).subscribe((event) => {
      console.log('Event Run', event)
      if (event.incoming_number && event.state == "IDLE") {
        setTimeout(() => {
          this.fetchMissed();
        }, 2000)
      }
      else if (event.state == "IDLE")
        this.getLogs();
    });
    this.requestPermission();
  }

  private fetchMissed() {
    let missedFilter: CallLogObject[] = [{
      "name": "type",
      "value": '3',
      "operator": ">="
    }, {
      "name": "date",
      "value": JSON.stringify(Date.now() - 86400000),
      "operator": ">="
    }];
    this.callLog.getCallLog(missedFilter)
      .then((res) => {
        console.log('Result Missed', res);
        this.logs.data = res;
        this.logs.processLogs();
        this.getLogs();
      })
      .catch((err) => console.error("Can't get Log"))
  }

  private requestPermission() {
    this.callLog.hasReadPermission().then(response => {
      if (!response) {
        this.callLog.requestReadPermission()
          .then(() => {
            this.getLogs();
            console.log('Permission granted')
          })
          .catch(() => {
            console.error('Permissiion Denied, Requesting Again')
            this.requestPermission();
          })
      } else {
        this.getLogs();
      }
    })
  }

  private getLogs(callType?: number) {
    this.callLog.getCallLog(this.logFilters)
      .then((fetchedLogs) => {
        this.logs.getCallLogs(fetchedLogs).then((processedLog) => {
          this.unFilteredLogs = processedLog;
          this.filteredLogs = processedLog;
          this.cd.detectChanges();
        })
      })
      .catch((err) => console.error("Can't get Log"))
  }

  sendText(log: Logs) {
    log.messageSent = true;
    console.log('sending text to ', log)
    this.logs.sendText(log)
  }

  async presentDialer() {
    const modal = await this.modalController.create({
      component: DialerComponent,
      cssClass: 'dialer'
    });
    return await modal.present();
  }

  public call(num: string) {
    this.phoneService.dialNumber(num);
  }

  showLogs(ev) {
    console.log('event', ev.detail.value)
    switch (ev.detail.value) {
      case '1':
      case '2':
        console.log('1 or 2');
        this.filteredLogs = this.unFilteredLogs;
        break;
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
        console.log('missed');
        this.filteredLogs = this.unFilteredLogs.filter((log => log.type == 3));
        break;
    }
  }
}
