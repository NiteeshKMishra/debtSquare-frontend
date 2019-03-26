import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

import axios from 'axios'


@Injectable()
export class UserLoginService {

  constructor(private httpClient: HttpClient) {
  }

  getUser() {
    return axios.get('http://localhost:3000/user');
  }

  sendUser() {
    return axios.post('http://localhost:3000/login', { user: "Mishi" })
  }
}