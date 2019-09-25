import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MainBodyComponent } from './main-body/main-body.component';
import { UserComponent } from './user/user.component';
import { SignupComponent } from './user/signup/signup.component';
import { SignUpService } from './user/signup/singup.service';
import { SigninComponent } from './user/signin/signin.component'

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MainBodyComponent,
    UserComponent,
    SignupComponent,
    SigninComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [SignUpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
