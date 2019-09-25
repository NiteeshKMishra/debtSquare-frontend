import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SignUpService } from '../user/signup/singup.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-main-body',
  templateUrl: './main-body.component.html',
  styleUrls: ['./main-body.component.css']
})
export class MainBodyComponent implements OnInit {

  signUpErrorMsg = ''

  emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(private signUpService: SignUpService, private router: Router) { }

  ngOnInit() {
  }

  OnSignupProcced(signupForm: NgForm) {
    var email = signupForm.value.useremail;
    var mNumber = signupForm.value.usermobile;
    if (mNumber.toString().length !== 10) {
      this.signUpErrorMsg = 'Mobile Number should be of 10 digits'
    }
    else if (!this.emailRegex.test(email)) {
      this.signUpErrorMsg = 'Email is not valid. Please Enter Email in correct format'
    }
    else {
      this.signUpErrorMsg = ''
    }
    this.signUpService.verifyUser(email, mNumber)
      .then((res: string) => {
        if (res !== 'No records found') {
          this.signUpErrorMsg = res;
        }
        else if (this.signUpErrorMsg === '') {
          this.signUpService.setBasicData(email, mNumber);
          this.router.navigate(['/signup']);
        }
      })
      .catch((err: string) => {
        this.signUpErrorMsg = err;
      })
  }

}
