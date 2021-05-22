import { Component, OnInit } from '@angular/core';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(
    private messages: MessagesService
  ) { }

  ngOnInit() {
  }

  setMessage() {
    this.messages.setMessage();
  }
}
