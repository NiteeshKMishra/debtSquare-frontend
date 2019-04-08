import { Injectable, OnInit } from '@angular/core';
import axios from 'axios'
import { resolve } from 'q';

@Injectable()
export class SignUpService implements OnInit {
  ngOnInit(): void {

  }

  sendUser(userData) {
    return axios.post('http://localhost:3000/user/signup', userData);
  }

  verifyUser(email, number): Promise<String> {
    var userData = {
      email: email,
      number: number
    }
    return new Promise((resolve, reject) => {
      axios.post('http://localhost:3000/user/verifyuser', userData)
        .then((res) => {
          resolve(res.data.message);

        }).catch((err) => {
          reject('Something went wrong. Please try after sometime');
        })
    });
  }
}