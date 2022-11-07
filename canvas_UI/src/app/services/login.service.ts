import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { apiHost } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(
    private http: HttpClient
  ) { 
    console.log(apiHost);
  }

    getLogin(userdata: {username: string, password: string}) {
      const headers =  new HttpHeaders();
      headers.set('Content-Type', 'application/json');
      const options = {headers: headers};
      const body= {username: userdata.username, password: userdata.password };
      return this.http.post(`${apiHost.authUrl}/canvasauth/api/v1/auth/login`, body, options);
    }

    registeruser(data: any) {
        const header =  this.initHeaders();
        const option =  {headers: header};
        const regUrl  =  `${apiHost.authUrl}/canvasauth/api/v1/registration/new`;
        return this.http.post(regUrl, data, option);

    }

    initHeaders() {
      const header =  new HttpHeaders();
      header.set('Content-Type', 'application/json');
      if( localStorage.getItem('@canvas/AuthToken')) {
        header.append('Authorization', `Bearer${localStorage.getItem('@canvas/AuthToken')}`);
      }
      return header;
    }


}
