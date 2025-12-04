import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  //servicios HTTP
  public obtenerResumen(): Observable<any> {
    var token = this.authService.getSessionToken();
    var headers = new HttpHeaders({'Content-Type': 'application/json','Authorization': 'Bearer ' + token});
    return this.http.get<any>(`${environment.url_api}/reports-summary/`, { headers: headers });
  }

  public obtenerKpis(): Observable<any> {
    var token = this.authService.getSessionToken();
    var headers = new HttpHeaders({'Content-Type': 'application/json','Authorization': 'Bearer ' + token});
    return this.http.get<any>(`${environment.url_api}/reports-kpis/`, { headers: headers });
  }
}
