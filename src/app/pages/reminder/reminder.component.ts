import { Component, Input, OnInit } from '@angular/core';
import { Logs } from 'src/app/interfaces/logs';
import { ClickupService } from 'src/app/services/clickup.service';

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  styleUrls: ['./reminder.component.scss'],
})
export class ReminderComponent implements OnInit {

  @Input() log: Logs;

  constructor(
    private clickup: ClickupService
  ) { 
  }

  ngOnInit() { }

  addReminder() {
    console.log(this.log);
    this.clickup.createTask(this.log)
      .subscribe(data => {
        console.log(data);
      }, error => {
        console.log(error);
      });
  }
}
