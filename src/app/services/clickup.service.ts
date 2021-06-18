import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Logs } from '../interfaces/logs';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ClickupTask } from '../interfaces/clickup-task';

@Injectable({
  providedIn: 'root'
})
export class ClickupService {

  demoTask: ClickupTask = {
    "name": "Task added from dialer",
    "description": "Comment added from dialer",
    "assignees": [
      3425866
    ],
    "tags": [
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

  createTask(log: Logs): Observable<any> {
    console.log(log);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: environment.clickupApiKey
      })
    };
    let postData = this.demoTask

    return this.http.post(`${environment.clickupBaseUrl}/list/${environment.list_id_tasks}/task`, postData, httpOptions)
  }
}
