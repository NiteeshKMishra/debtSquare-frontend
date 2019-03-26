import { Component } from '@angular/core';
import { UserLoginService } from './app.service';
import axios from 'axios'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ClientSide';

  constructor(private service: UserLoginService) {

  }

  ngOnInit() {
    this.service.getUser().then((res) => {
      this.title = res.data.username;
    })

    this.service.sendUser().then((res) => {
      console.log(res.data)
    })
  }

  sendUser() {
    console.log('Hello');
    var requset = axios.post('http://localhost:3000/login', { user: "Mishi" });
    console.log(requset)
  }
}
