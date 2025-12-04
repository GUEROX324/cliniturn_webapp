import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ValidatorService } from './tools/validator.service';
import { ErrorsService } from './tools/errors.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const session_cookie_name = 'cliniturn-token';
const user_email_cookie_name = 'cliniturn-email';
const user_id_cookie_name = 'cliniturn-user_id';
const user_complete_name_cookie_name = 'cliniturn-user_complete_name';
const group_name_cookie_name = 'cliniturn-group_name';
const codigo_cookie_name = 'cliniturn-codigo';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    public router: Router,
    private cookieService: CookieService,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
  ) { }

  public validarLogin(username: String, password: String) {
    var data = {
      username: username,
      password: password
    };
    let error: any = [];

    if (!this.validatorService.required(data['username'])) {
      error['username'] = this.errorService.required;
    } else if (!this.validatorService.max(data['username'], 40)) {
      error['username'] = this.errorService.max(40);
    } else if (!this.validatorService.email(data['username'])) {
      error['username'] = this.errorService.email;
    }

    if (!this.validatorService.required(data['password'])) {
      error['password'] = this.errorService.required;
    }

    return error;
  }

  public login(username: String, password: String): Observable<any> {
    var data = {
      username: username,
      password: password
    };
    return this.http.post<any>(`${environment.url_api}/token/`, data, httpOptions);
  }

  public logout(): Observable<any> {
    var headers: any;
    var token = this.getSessionToken();
    headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    return this.http.get<any>(`${environment.url_api}/logout/`, { headers: headers });
  }

  public retrieveSignedUser() {
    var headers: any;
    var token = this.getSessionToken();
    headers = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    return this.http.get<any>(`${environment.url_api}/me/`, { headers: headers });
  }

  public getCookieValue(key: string) {
    return this.cookieService.get(key);
  }

  public saveCookieValue(key: string, value: string) {
    var secure = environment.url_api.indexOf('https') != -1;
    this.cookieService.set(key, value, undefined, undefined, undefined, secure, secure ? 'None' : 'Lax');
  }

  public getSessionToken() {
    return this.cookieService.get(session_cookie_name);
  }

  public saveUserData(user_data: any) {
    var secure = environment.url_api.indexOf('https') != -1;
    if (user_data.rol == 'administrador') {
      this.cookieService.set(user_id_cookie_name, user_data.id, undefined, undefined, undefined, secure, secure ? 'None' : 'Lax');
      this.cookieService.set(user_email_cookie_name, user_data.email, undefined, undefined, undefined, secure, secure ? 'None' : 'Lax');
      this.cookieService.set(user_complete_name_cookie_name, user_data.first_name + ' ' + user_data.last_name, undefined, undefined, undefined, secure, secure ? 'None' : 'Lax');
    } else {
      this.cookieService.set(user_id_cookie_name, user_data.user.id, undefined, undefined, undefined, secure, secure ? 'None' : 'Lax');
      this.cookieService.set(user_email_cookie_name, user_data.user.email, undefined, undefined, undefined, secure, secure ? 'None' : 'Lax');
      this.cookieService.set(user_complete_name_cookie_name, user_data.user.first_name + ' ' + user_data.user.last_name, undefined, undefined, undefined, secure, secure ? 'None' : 'Lax');
    }
    this.cookieService.set(session_cookie_name, user_data.token, undefined, undefined, undefined, secure, secure ? 'None' : 'Lax');
    this.cookieService.set(group_name_cookie_name, user_data.rol, undefined, undefined, undefined, secure, secure ? 'None' : 'Lax');
  }

  public destroyUser() {
    this.cookieService.deleteAll();
  }

  public getUserEmail() {
    return this.cookieService.get(user_email_cookie_name);
  }

  public getUserCompleteName() {
    return this.cookieService.get(user_complete_name_cookie_name);
  }

  public getUserId() {
    return this.cookieService.get(user_id_cookie_name);
  }

  public getUserGroup() {
    return this.cookieService.get(group_name_cookie_name);
  }
}
