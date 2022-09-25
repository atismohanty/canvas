import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: any;
  constructor( private loginSvc: LoginService) { }

  ngOnInit(): void {

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
    });
  }
}
