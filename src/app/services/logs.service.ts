import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import * as _ from 'lodash';
import { CommonService } from './common.service';
import { Logs } from '../interfaces/logs';
import { ClickupService } from './clickup.service';
import { VoicecallService } from './voicecall.service';

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
    private voicecall: VoicecallService
  ) {
  }

  public async getCallLogs(fetchedLogs?: Logs[]): Promise<Logs[]> {
    console.log('got logs', JSON.stringify(fetchedLogs));
    if (fetchedLogs.length) {
      this.lastFetched = fetchedLogs[0].date.toString()
      this.storage.setLastFetched(this.lastFetched);
      if (fetchedLogs[0].type == 3) {
        this.sendText(fetchedLogs[0]);
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

  public sendText(logData: Logs) {
    let minutesPassed: number = 720;
    this.storage.getSmsLogs()
      .then((log) => {
        console.log('Found Log', log)
        //if there's no log
        if (!log) {
          this.clickup.createMissedTask(logData)
            .subscribe(success => console.info('created task successfully', success), error => console.error('error while creating missed taks when there\'s no log', error))
          this.smsService.sendSMS(logData.number)
            .then((res) => {
              console.info('Message Sent Success')
              log = [];
              log.push(logData);
              this.storage.setSMSLogs(log)
            })
            .catch((err) => console.error("Can't send SMS", err))
          // this.voicecall.sendVoiceCall()
          //   .subscribe(success => console.info('call sent successfully', success), error => console.error('error while sending call', error))
        } else {
          console.info('log else', log, _.find(log, ['number', logData.number]));
          //if number is present in logs
          if (_.find(log, ['number', logData.number])) {
            let elapsed = new Date().getTime() - Number(_.find(log, ['number', logData.number]).date);
            // console.log('Elapsed', `${elapsed / 60000}m`);
            if (elapsed / 60000 > minutesPassed) {
              this.clickup.createMissedTask(logData)
                .subscribe(success => console.info('created task successfully', success), error => console.error('error while creating missed taks when there\'s log', error))
              this.smsService.sendSMS(logData.number)
                .then(() => {
                  console.info('Message Resent Success')
                  log = _.filter(log, function (o) { return o.number != logData.number });
                  log.push(logData);
                  this.storage.setSMSLogs(log)
                })
                .catch((err) => console.error("Can't send SMS", err))
              // this.voicecall.sendVoiceCall()
              //   .subscribe(success => console.info('call sent successfully', success), error => console.error('error while sending call', error))
            } else {
              console.info('Already Sent Message within ', minutesPassed / 60, ' hours');
            }

          } else {
            this.clickup.createMissedTask(logData)
              .subscribe(success => console.info('created task successfully', success), error => console.error('error while creating missed taks when there\'s no log', error))
            this.smsService.sendSMS(logData.number)
              .then(() => {
                console.info('Message Sent Success')
                log.push(logData);
                this.storage.setSMSLogs(log)
                console.log('send message first time', logData)
              }).catch((err) => {
                console.error('Unable to send message first time', err)
              })
            // this.voicecall.sendVoiceCall()
            //   .subscribe(success => console.info('call sent successfully', success), error => console.error('error while sending call', error))
          }
        }
      })
      .catch((err) => {
        console.error('Unable to fetch logs', err);
      })

  }
}