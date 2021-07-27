import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import * as _ from 'lodash';
import { CommonService } from './common.service';
import { Logs } from '../interfaces/logs';
import { ClickupService } from './clickup.service';
import { VoicecallService } from './voicecall.service';
import { MessagesService } from './messages.service';

@Injectable({
  providedIn: 'root'
})

export class LogsService {

  lastFetched: string;
  data: Logs[];

  constructor(
    private smsService: CommonService,
    private storage: StorageService,
    private clickup: ClickupService,
    private voicecall: VoicecallService,
    private messages: MessagesService
  ) {
  }

  public async getCallLogs(fetchedLogs?: Logs[]): Promise<Logs[]> {
    console.log('got logs', JSON.stringify(fetchedLogs));
    if (fetchedLogs.length) {
      this.lastFetched = fetchedLogs[0].date.toString()
      this.storage.setLastFetched(this.lastFetched);
      if (fetchedLogs[0].type == 3) {
        this.responseHandler(fetchedLogs[0]);
      }
    }
    // @ts-ignore
    return this.storage.getRawLogs()
      .then(cachedLogs => {
        if (cachedLogs) {
          // console.log('cachedLogs', cachedLogs)
          fetchedLogs = _.concat(fetchedLogs, cachedLogs)
        }
        this.storage.setRawLogs(_.take(fetchedLogs, 80))
        cachedLogs = [];
        _.forEach(_.groupBy(fetchedLogs, 'number'), (log) => {
          // console.log('inside loop', JSON.stringify(log));
          log.forEach(value => value.history = [])
          log[0].history = _.without(log, log[0]);
          cachedLogs.push(log[0])
        })
        return _.orderBy(cachedLogs, ['date'], ['desc']);
      })
      .catch(() => console.error('Can\'t get Raw Logs'))
  }

  public responseHandler(logData: Logs) {
    let minutesPassed: number = 720;
    this.storage.getNotifierLogs()
      .then((storageLog) => {
        console.log('Found Log', storageLog)
        //if there's no log
        if (!storageLog) {
          this.notifier(storageLog, logData, 'noLog');
        } else {
          console.info('log else', storageLog, _.find(storageLog, ['number', logData.number]));
          //if number is present in logs
          if (_.find(storageLog, ['number', logData.number])) {
            let elapsed = new Date().getTime() - Number(_.find(storageLog, ['number', logData.number]).date);
            // console.log('Elapsed', `${elapsed / 60000}m`);
            if (elapsed / 60000 > minutesPassed) {
              this.notifier(storageLog, logData, 'resent');
            } else {
              console.info('Already Sent Message within ', minutesPassed / 60, ' hours');
            }
          } else {
            this.notifier(storageLog, logData, 'send');
          }
        }
      })
      .catch((err) => {
        console.error('Unable to fetch logs', err);
      })

  }

  private notifier(storageLog: any, logData: Logs, status: string) {
    let elapsed = new Date().getTime() - Number(logData.date);
    console.log('elapsed time before notification in mins', elapsed / 60000)
    this.clickup.createMissedTask(logData)
      .subscribe(success => console.info('created task successfully', success), error => console.error('error while creating missed task', error))

    if (elapsed / 60000 < 15) {     //if call was missed within 15 minutes
      if (this.messages.settings.useSMS) {
        this.smsService.sendSMS(logData.number)
          .then((res) => {
            if (status == 'noLog') {
              // console.info('Message Sent Success')
              storageLog = [];
            } else if (status = 'resent') {
              // console.info('Message Resent Success')
              storageLog = _.filter(storageLog, function (o) { return o.number != logData.number });
            }
            storageLog.push(logData);
            this.storage.setNotifierLogs(storageLog)
          })
          .catch((err) => console.error("Can't send SMS", err))
      }
      if (this.messages.settings.useVoice) {
        this.voicecall.sendVoiceCall(logData)
          .then(success => console.info('call sent successfully', JSON.stringify(success)))
          .catch(error => console.error('error while sending call', error))
      }
    }

  }
}