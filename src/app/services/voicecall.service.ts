import { Injectable } from '@angular/core';
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Logs } from '../interfaces/logs';

@Injectable({
  providedIn: 'root'
})
export class VoicecallService {

  constructor(
    private http: HTTP
  ) { }

  sendVoiceCall(logData: Logs): Promise<HTTPResponse> {
    const caller_id = 9798973260;
    const voice_text = "हम अभी आपके कॉल में शामिल होने में असमर्थ हैं, लेकिन हमारा प्रतिनिधि आपको शीघ्र ही वापस कॉल करेगा। इसके अलावा आप हमसे whatsapp पर भी संपर्क कर सकते हैं| धन्यवाद";
    const mobile_no = logData.number;
    // let body = `caller_id=${caller_id}&voice_source=voice_text&voice_text=${voice_text}&voice_name=Aditi&mobile_no=${mobile_no}`
    let body = {
      caller_id: caller_id,
      voice_source: 'voice_text',
      voice_text: voice_text,
      voice_name: 'Aditi',
      mobile_no: mobile_no
    }
    //`=${}&voice_source=voice_text&voice_text=${voice_text}&voice_name=Aditi&mobile_no=${mobile_no}`
    this.http.setDataSerializer('urlencoded');
    return this.http.post(`${environment.clickiURL}/campaign`, body, {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${environment.clickiApi}`
    })
  }
}
