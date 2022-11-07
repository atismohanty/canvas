import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { fromEvent, interval, Subscription } from 'rxjs';
import { ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: any;
  @ViewChild('userName', { static: false })
  userName!: ElementRef<HTMLInputElement>;
  subscriptions: Subscription[] = [];

  constructor( private loginSvc: LoginService, private router: Router, private notify: NotificationService) { }

  ngOnInit(): void {
    this.initLoginFieldAnimation();
    this.initLoignForm();

  }

  initLoignForm(): void {
    this.loginForm =  new FormGroup({
      username: new FormControl(''),
      password: new FormControl('')
    });
  }

  public submitUserCreds(): void {
    console.log('Passing the credentials', this.loginForm.value);
    this.loginSvc.getLogin(this.loginForm.value).subscribe((res) =>{
      console.log(res);
      this.notify.pushNotification({type: 'Success', message: 'User logged in to the system', read: false });

    }, (err) => {
      this.notify.pushNotification({type: 'Error', message: 'Error in login.', read: false });
      console.log('Error', ' Something went wrong while loggin to CANVAS')
    });
  }

  public initLoginFieldAnimation() {
    const placeholdertext  = 'john@email.com or john1111';
    let count = 0;
    this.subscriptions.push( interval(300).subscribe(() => {
      if( this.userName.nativeElement.value.length > 0 ) {
        return;
      }
      if ( placeholdertext.length + 10 === count) {
        this.userName.nativeElement.placeholder = '';
        count = 0;
      } else if (placeholdertext.length >
         count) {
        this.userName.nativeElement.placeholder = this.userName.nativeElement.placeholder += placeholdertext[count];
        count++;
      } else {
        count++;
      }
    }));
  }

  nav_to_registration() {
    this.router.navigate(['../','registration']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    })
  }
}
