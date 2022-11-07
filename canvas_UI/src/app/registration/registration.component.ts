import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  registrationForm: any;

  constructor(
    private router: Router,
    private auth: LoginService,
    private notify: NotificationService
  ) { }

  ngOnInit(): void {
    this.initRegistrationForm();
  }

  public initRegistrationForm() {
    this.registrationForm =  new FormGroup( {
      firstName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(40)])),
      lastName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(40)])),
      userName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(40), this.usernameValidator()])),
      emailAddress: new FormControl('', Validators.compose ([Validators.required, Validators.minLength(8), Validators.maxLength(40), this.emailValidator()])),
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(20), this.passwordValidator()])),
      confirmpassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20)])
    },{
      validators: this.matchPasswordsValidator('password', 'confirmpassword')
    }
    );
  }

  public submitUserRegistration() {
    if( this.registrationForm.valid) {
      let {firstName = '', lastName = '', userName = '', emailAddress = '', password = ''} =  {...this.registrationForm.value};
      const body =  new UserRegistration(firstName, lastName, userName, emailAddress, password)
      this.auth.registeruser(body).subscribe((res: any) => {
        if (res) {
          let message =  res?.verificationSent ? 'User Created Successfully. Please check your registered email for the verification link' : 'User Created Successfully';
          this.notify.pushNotification({type: 'Info', message , read: false});
        }
        console.log('Registratoin Successful');
        this.registrationForm.reset();
        this.router.navigate(['../', ['login']]);
      }, 
      (err) => {
        this.notify.pushNotification({type: 'Error', message: 'Something went wrong during registration' , read: false});
        console.log('Error', 'Something went wrong during registration', err);
      })
    } else {
      this.notify.pushNotification({type: 'Error', message: 'Something went wrong during registration' , read: false});
    }
  }

  public rerouteToLogin() {
    this.router.navigate(['../', 'login']);
  }

  private usernameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const re = new RegExp(/^(?=.*[0-9])(?=.*[a-zA-Z]).{8,32}$/);
        return re.test(control.value) ? null :  { userName: {validation : false, reason : 'Mismatch in the pattern.Should contain alphanumeric.'}};
    }
  }

  private emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const re =new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/);
        return re.test(control.value) ? null : { emailAddress: {validation : false, reason : 'Mismatch in the pattern. Value should be an email.'}};
    }
  }

  private passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const re = new RegExp(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%&*]).{8,32}$/);
        return re.test(control.value) ? null :{ password: {validation : false, reason : 'Mismatch in the pattern. Should contain alphanumeric and a special character'}};
    }
  }

  private matchPasswordsValidator(password: any, confirmpassword: any): ValidatorFn | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const passwordControl =  control.get(password);
      const confPassControl =  control.get(confirmpassword);
        if ((passwordControl?.value.length > 0 && confPassControl?.value.length > 0 ) && 
          (passwordControl?.value !== confPassControl?.value)) {
            return {mismatchPwd: {validation : false, reason : 'Password and Confirm password doesn\'t match'}};
        } else {
          return null;
        }
    }
  }

}

class UserRegistration {
  firstName;
  lastName;
  userName;
  emailAddress;
  password
  constructor(firstName: string, lastName: string, userName: string, emailAddress: string, password: string) {
    this.firstName =  firstName;
    this.lastName =  lastName;
    this.emailAddress  = emailAddress;
    this.password =  password;
    this.userName =  userName
  }
}