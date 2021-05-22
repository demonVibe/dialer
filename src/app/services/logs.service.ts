import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import * as _ from 'lodash';
import { CommonService } from './common.service';
import { Logs } from '../interfaces/logs';

@Injectable({
  providedIn: 'root'
})

export class LogsService {

  data: Logs[];

  constructor(
    private smsService: CommonService,
    private storage: StorageService
  ) {
  }

  public processLogs() {
    console.log('missed logs', this.data)
    if (this.data.length) {
      const logData = this.data[0];
      this.sendText(logData);
    }

  }

  public async getCallLogs(fetchedLogs?: Logs[]) {
    var fLogs = [];
    _.forEach(_.groupBy(fetchedLogs, 'number'), (value, key) => {
      // if (value[0].type == 3) {
      fLogs.push(value[0])
      // }
    })
    return this.storage.getSmsLogs().then((smsLog) => {
      console.log('smsLog', JSON.stringify(smsLog));
      fLogs.forEach((log, index) => {
        fLogs[index].messageSent = typeof (_.find(smsLog, ["number", log.number])) != "undefined"
      })
      console.log('fLogs', JSON.stringify(fLogs));
      return _.orderBy(fLogs, ['date'], ['desc']);
    })
  }

  public sendText(logData: Logs) {
    let minutesPassed: number = 720;
    this.storage.getSmsLogs().then((log) => {
      console.log('Found Log', log)
      if (!log) {
        this.smsService.sendSMS(logData.number).then((res) => {
          console.info('Message Sent Success')
          log = [];
          log.push(logData);
          this.storage.setSMSLogs(log)
        })
      } else {
        console.info('log else', log, _.find(log, ['number', logData.number]));
        if (_.find(log, ['number', logData.number])) {
          let elapsed = new Date().getTime() - Number(_.find(log, ['number', logData.number]).date);
          console.log('Elapsed', `${elapsed / 60000}m`);
          if (elapsed / 60000 > minutesPassed) {
            this.smsService.sendSMS(logData.number).then(() => {
              console.info('Message Resent Success')
              log = _.filter(log, function (o) { return o.number != logData.number });
              log.push(logData);
              this.storage.setSMSLogs(log)
            })
          } else {
            console.info('Already Sent Message within ', minutesPassed / 60, ' hours');
          }

        } else {
          this.smsService.sendSMS(logData.number).then(() => {
            console.info('Message Sent Success')
            log.push(logData);
            this.storage.setSMSLogs(log)
            console.log('send message first time', logData)
          }).catch((err) => {
            console.log('Unable to send message first time', err)
          })
        }
      }
    }).catch((err) => {
      console.log('Unable to fetch logs', err);
    })

  }
}