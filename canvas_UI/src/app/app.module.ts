import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { WildRouteComponent } from './components/wild-route/wild-route.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RegistrationComponent } from './registration/registration.component';
import { FormErrorDirective } from './directives/form-error.directive';
import { NotificationComponent } from './components/notification/notification.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    WildRouteComponent,
    RegistrationComponent,
    FormErrorDirective,
    NotificationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
