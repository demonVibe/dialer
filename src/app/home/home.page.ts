import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Broadcaster } from '@ionic-native/broadcaster/ngx';
import { CallLog, CallLogObject } from '@ionic-native/call-log/ngx';
import { isPlatform, ModalController } from '@ionic/angular';
import { Logs } from '../interfaces/logs';
import { DialerComponent } from '../pages/dialer/dialer.component';
import { LogsService } from '../services/logs.service';
import { PhoneService } from '../services/phone.service';
import { StorageService } from '../services/storage.service';
import { environment } from '../../environments/environment';
import { ReminderComponent } from '../pages/reminder/reminder.component';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage {

  filteredLogs: Logs[] = [];
  unFilteredLogs: Logs[] = [];

  constructor(
    private callLog: CallLog,
    private broadcaster: Broadcaster,
    private logs: LogsService,
    private cd: ChangeDetectorRef,
    private modalController: ModalController,
    private phoneService: PhoneService,
    private storage: StorageService,
    private common:CommonService
  ) {

    // !isPlatform('android') ? this.filteredLogs = environment.demoLogs : null

    if (isPlatform('android')) {
      this.broadcaster.addEventListener('android.intent.action.PHONE_STATE', true)
        .subscribe((event) => {
          console.log('Event Run', event)
          if (event.incoming_number && event.state == "IDLE") {
            setTimeout(() => {
              this.getLogs();
            }, 2000)
          }
        })
    }

    this.storage.getLastFetched()
      .then(lastFetched => {
        console.log('got lastfetched'); this.logs.lastFetched = lastFetched
        if (isPlatform('android'))
          this.requestPermission();
      })
      .catch(err => console.error('Unable to get lastFetched'))
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
    let logFilters: CallLogObject[] = [{
      "name": "type",
      "value": '1',
      "operator": ">="
    }];
    this.logs.lastFetched ? logFilters.push({
      "name": "date",
      "value": this.logs.lastFetched,
      "operator": ">"
    }) : null;
    console.log('fetching from', this.logs.lastFetched)
    this.callLog.getCallLog(logFilters)
      .then((fetchedLogs) => {
        this.logs.getCallLogs(fetchedLogs)
          .then((processedLog) => {
            console.log('logs now', JSON.stringify(processedLog));
            this.unFilteredLogs = processedLog;
            this.filteredLogs = processedLog;
            this.cd.detectChanges();
          })
          .catch((err) => console.error("Can't get Logs"))
      })
      .catch((err) => console.error("Can't get phone Log"))
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

  async presentReminder(log) {
    const modal = await this.modalController.create({
      component: ReminderComponent,
      cssClass: 'reminder',
      componentProps: {
        log: log
      }
    });
    return await modal.present();
  }

  recordNote(){
    this.common.presentToast('Coming Soon...')
  }
}
