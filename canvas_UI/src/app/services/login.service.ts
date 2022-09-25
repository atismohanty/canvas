import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient
  ) { }

    getLogin(userdata: {username: string, password: string}) {

      const headers =  new HttpHeaders();
      headers.set('Content-Type', 'application/json');
      const options = {headers: headers};
      const body= {emailAddress: userdata.username, password: userdata.password };
      return this.http.post('http://localhost:8080/canvasauth/api/v1/auth/login', body, options);
    }



}
