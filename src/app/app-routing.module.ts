import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './user/signup/signup.component';
import { MainBodyComponent } from './main-body/main-body.component';
import { SigninComponent } from './user/signin/signin.component';

const routes: Routes = [
  { path: '', component: MainBodyComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'signin', component: SigninComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
