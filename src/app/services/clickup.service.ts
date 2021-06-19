import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Logs } from '../interfaces/logs';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ClickupTask } from '../interfaces/clickup-task';
import { Reminder } from '../interfaces/reminder';

@Injectable({
  providedIn: 'root'
})
export class ClickupService {

  task: ClickupTask = {
    "name": "Task added from dialer",
    "description": "Comment added from dialer",
    "assignees": [
      3425866
    ],
    "tags": [   //todo add tags for call types
    ],
    "status": "Open",
    "priority": 1,
    "due_date": 1508369194377,
    "due_date_time": false,
    "time_estimate": 8640000,
    "start_date": 1567780450202,
    "start_date_time": false,
    "notify_all": true,
    "parent": null,
    "links_to": null,
    "custom_fields": [
    ]
  }
  constructor(
    private http: HttpClient,
  ) { }

  createTask(log: Logs, reminderData: Reminder): Observable<any> {
    console.log(log);
    let task: ClickupTask = {
      "name": `${log.number} ${log.name}`,
      "description": `${reminderData.notes||""} \n\nTotal Calls - ${log.history.length + 1}\nLast Call Duration - ${log.duration}`,
      "assignees": [
        3425866
      ],
      "tags": [
      ],
      "status": "Open",
      "priority": reminderData.priority || 3,
      "due_date": Date.parse(reminderData.reminderTime),
      "due_date_time": true,
      "time_estimate": null,
      "start_date": Date.parse(log.date.toString()),
      "start_date_time": true,
      "notify_all": false,
      "parent": null,
      "links_to": null,
      "custom_fields": [
        {
          id: environment.customFieldId,
          value: [environment.customFieldCallType[reminderData.callType]]
        },
        {
          id: environment.customFieldPhoneId,
          value: `+91${log.number}`
        }
      ]
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: environment.clickupApiKey
      })
    };
    return this.http.post(`${environment.clickupBaseUrl}/list/${environment.list_id}/task`, task, httpOptions)
  }

}
