import { Injectable, OnInit } from '@angular/core';
import axios from 'axios'
import { Observable, BehaviorSubject } from 'rxjs';


@Injectable()
export class SignUpService implements OnInit {

  private userBasicData: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  ngOnInit(): void {

  }

  setBasicData(email, number) {
    this.userBasicData.next({ email, number })
  }

  getBasicData(): Observable<any> {
    return this.userBasicData.asObservable();
  }
  sendUser(userData) {
    return axios.post('http://localhost:3000/user/signup', userData);
  }

  verifyUser(email, number): Promise<string> {
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

  uploadImage(imageData) {
    return axios.post('http://localhost:3000/user/uploadpic', imageData);
  }

  deleteImage(imageID) {
    return axios.delete('http://localhost:3000/user/deletepic', {
      params: {
        id: imageID
      }
    });
  }

}