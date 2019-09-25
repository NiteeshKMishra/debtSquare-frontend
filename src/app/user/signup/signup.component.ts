import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SignUpService } from './singup.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  @ViewChild('signupForm') signUpForm: NgForm;
  basicDataSubs: Subscription;

  imagepath: string;
  isImageAvailable = false;
  profilepicId = '';

  basicUserData = {};

  changeEmail = true;
  changeNumber = true;
  correctFileFormat = true;
  selectedFile: File = null;

  errorText = '';
  errorText1 = '';
  isBasicDetailsVerified = false;
  isOtherDetailsVerified = false;
  isUserVerified = false;

  cityArray = ['Mumbai', 'Delhi', 'Kolkata', 'Chennai', 'Bengaluru', 'Hyderabad', 'Ahmadabad', 'Pune', 'Surat', 'Jaipur', 'Kanpur', 'Lucknow', 'Nagpur', 'Ranchi', 'Ghaziabad', 'Indore', 'Coimbatore', 'Kochi', 'Kozhikode', 'Bhopal', 'Thrissur', 'Vadodara', 'Agra', 'Visakhapatnam', 'Thiruvananthapuram']

  emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  specialCharRegex = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

  constructor(private signupService: SignUpService, private router: Router) {
  }

  ngOnInit() {
    this.basicDataSubs = this.signupService.getBasicData().subscribe((data) => {
      this.basicUserData['email'] = data.email;
      this.basicUserData['number'] = data.number;
    })
  }

  ngOnDestroy() {
    this.basicDataSubs.unsubscribe();
  }

  OnEmailChange() {
    this.changeEmail = !this.changeEmail;
  }

  OnNumberChange() {
    this.changeNumber = !this.changeNumber;
  }

  OnProfilepicUpload(event) {
    var fileType = event.target.files[0].type;
    var fileSize = Math.round(event.target.files[0].size / 1024);
    var correctFileType = false;
    if (fileType === 'image/jpeg' || fileType === 'image/png') {
      correctFileType = true;
    }
    if (correctFileType === false || fileSize > 1024) {
      this.correctFileFormat = false;
    }
    else {
      this.correctFileFormat = true;
      this.selectedFile = <File>event.target.files[0];
      var imageData = new FormData();
      imageData.append('profilePic', this.selectedFile);
      this.signupService.uploadImage(imageData)
        .then((res) => {
          this.profilepicId = res.data.id;
          this.imagepath = `http://localhost:3000/user/profilePic/${res.data.id}`;
          this.isImageAvailable = true;
        })
        .catch((err) => {
          (<HTMLSpanElement>document.getElementById('msgModalSpan')).textContent = 'Unable to Upload your picture!! Please try after sometime.';
          (<HTMLElement>document.getElementById('modalButton')).click();
          setTimeout(() => {
            (<HTMLElement>document.getElementById('modalButton')).click();
          }, 1500)
        });
    }
  }

  DeleteProfilepic() {
    this.signupService.deleteImage(this.profilepicId)
      .then((res) => {
        if (res.data.message === 'File Deleted') {
          this.isImageAvailable = false;
        }
      })
      .catch((err) => {
        (<HTMLSpanElement>document.getElementById('msgModalSpan')).textContent = 'Unable to delete your pic!! Please try after sometime.';
        (<HTMLElement>document.getElementById('modalButton')).click();
        setTimeout(() => {
          (<HTMLElement>document.getElementById('modalButton')).click();
        }, 1500)
      })
  }

  VerifyBasicDetails(basicDetails) {
    this.isBasicDetailsVerified = false;
    var email = basicDetails.value.email;
    var contactNumber = basicDetails.value.contactNumber;
    var password = basicDetails.value.password;
    var confirmPassword = basicDetails.value.confirmPassword;

    if (!this.emailRegex.test(email)) {
      this.errorText = 'Email is not valid. Please Enter Email in correct format'
    }
    else if (password.length < 6 || confirmPassword.length < 6) {
      this.errorText = 'Length of passwords must be greater or equal to Six Characters'
    }
    else if (password !== confirmPassword) {
      this.errorText = 'Passwords are not matching. Please use same passwords'
    }
    else if (contactNumber.toString().length !== 10) {
      this.errorText = 'Contact Number must be of 10 digits'
    }
    else {
      this.errorText = '';
    }
    this.signupService.verifyUser(email, contactNumber).then((res: string) => {
      if (res !== 'No records found') {
        this.errorText = res;
      }
      else if (this.errorText === '') {
        this.isBasicDetailsVerified = true;
        if (this.isBasicDetailsVerified && this.isOtherDetailsVerified) {
          this.isUserVerified = true
        }
        this.signUpForm.getFormGroup(basicDetails).disable();
      }
    }).catch((err: string) => {
      this.errorText = err;
    });
  }


  VerifyOtherDetails(otherDetails) {
    this.isOtherDetailsVerified = false;
    var firstName = otherDetails.value.firstName;
    var lastName = otherDetails.value.lastName;
    var sex = otherDetails.value.sex;
    var securityQuestion = otherDetails.value.securityQuestion;
    var securityAnswer = otherDetails.value.securityAnswer;
    var city = otherDetails.value.city;
    if (!otherDetails.valid) {
      this.errorText1 = 'All Fields are Mandatory'
    }
    else if (this.specialCharRegex.test(firstName) || this.specialCharRegex.test(lastName)) {
      this.errorText1 = 'First Name or Last Name should not contain any Special charcters'
    }
    else if (sex === 'none') {
      this.errorText1 = 'Please Select Your Sex'
    }
    else if (securityQuestion === 'none') {
      this.errorText1 = 'Please Select a Security Question'
    }
    else if (this.specialCharRegex.test(securityAnswer)) {
      this.errorText1 = 'Your Security Answer should not contain any Special Charcters'
    }
    else if (city === 'none') {
      this.errorText1 = 'Please select your city'
    }
    else {
      this.errorText1 = '';
      this.isOtherDetailsVerified = true;
      this.signUpForm.getFormGroup(otherDetails).disable();
      if (this.isBasicDetailsVerified && this.isOtherDetailsVerified) {
        this.isUserVerified = true
      }
    }
  }

  OnBasicDetailsChange(basicDetails) {
    this.isBasicDetailsVerified = false;
    this.isUserVerified = false;
    this.signUpForm.getFormGroup(basicDetails).enable();
  }

  OnOtherDetailsChange(otherDetails) {
    this.isOtherDetailsVerified = false;
    this.isUserVerified = false;
    this.signUpForm.getFormGroup(otherDetails).enable();
  }

  onSubmit() {
    var userData = {};
    Object.assign(userData, this.signUpForm.value.basicDetails, this.signUpForm.value.otherDetails);
    userData['imageId'] = this.profilepicId;
    this.signupService.sendUser(userData).then((res) => {
      (<HTMLSpanElement>document.getElementById('msgModalSpan')).setAttribute('class', 'text-success');
      (<HTMLSpanElement>document.getElementById('msgModalSpan')).textContent = 'Registered Successfully. Please login into your account';
      (<HTMLElement>document.getElementById('modalButton')).click();
      setTimeout(() => {
        (<HTMLElement>document.getElementById('modalButton')).click();
        this.router.navigate(['/']);
      }, 2000)
    }).catch((err) => {
      (<HTMLSpanElement>document.getElementById('msgModalSpan')).textContent = 'Something went wrong!! Please try after sometime.';
      (<HTMLElement>document.getElementById('modalButton')).click();
      setTimeout(() => {
        (<HTMLElement>document.getElementById('modalButton')).click();
      }, 1500)
    })
  }

}
