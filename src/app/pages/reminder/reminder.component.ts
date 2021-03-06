import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Logs } from 'src/app/interfaces/logs';
import { Reminder } from 'src/app/interfaces/reminder';
import { ClickupService } from 'src/app/services/clickup.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  styleUrls: ['./reminder.component.scss'],
})
export class ReminderComponent implements OnInit {

  @Input() log: Logs;

  reminderData: Reminder = {
    priority: null,
    callType: null,
    reminderTime: new Date().toISOString(),
    notes: null
  }
  reminderOptions = {
    priority: [
      { value: 1, name: "Urgent" },
      { value: 2, name: "High" },
      { value: 3, name: "Normal" },
      { value: 4, name: "Low" }
    ],
    callType: [
      { value: "enquiry", name: "Enquiry" },
      { value: "number plate", name: "Number Plate" },
      { value: "registration card", name: "Registration Card" },
      { value: "insurance", name: "Insurance" },
      { value: "dues", name: "Dues" },
      { value: "workshop", name: "Workshop" },
    ],
    popover: {
      header: 'Call was related to'
    }
  }

  constructor(
    private clickup: ClickupService,
    private modal: ModalController,
    private common: CommonService
  ) {
  }


  ngOnInit() { }

  addReminder() {
    console.log(this.log, this.reminderData);
    this.clickup.createReminderTask(this.log, this.reminderData)
      .subscribe(data => {
        console.log(data);
        this.common.presentToast('Reminder Set...');
        this.modal.dismiss();
      }, error => {
        console.log(error);
        this.common.presentToast('An error occurred');
        this.modal.dismiss();
      });
  }
}
