import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { ValidatorService } from './tools/validator.service';
import { ErrorsService } from './tools/errors.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private validatorService: ValidatorService,
    private errorService: ErrorsService
  ) {}

  public esquemaDoctor() {
    return {
      id: null,
      rol: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmar_password: '',
      cedula: '',
      telefono: '',
      especialidad: null,
      activo: true
    };
  }

  public validarDoctor(data: any, editar: boolean) {
    let error: any = [];

    if (!this.validatorService.required(data["first_name"])) {
      error["first_name"] = this.errorService.required;
    }

    if (!this.validatorService.required(data["last_name"])) {
      error["last_name"] = this.errorService.required;
    }

    if (!this.validatorService.required(data["email"])) {
      error["email"] = this.errorService.required;
    } else if (!this.validatorService.max(data["email"], 40)) {
      error["email"] = this.errorService.max(40);
    } else if (!this.validatorService.email(data["email"])) {
      error["email"] = this.errorService.email;
    }

    if (!editar) {
      if (!this.validatorService.required(data["password"])) {
        error["password"] = this.errorService.required;
      }

      if (!this.validatorService.required(data["confirmar_password"])) {
        error["confirmar_password"] = this.errorService.required;
      }
    }

    if (!this.validatorService.required(data["cedula"])) {
      error["cedula"] = this.errorService.required;
    }

    if (!this.validatorService.required(data["telefono"])) {
      error["telefono"] = this.errorService.required;
    }

    if (!this.validatorService.required(data["especialidad"])) {
      error["especialidad"] = this.errorService.required;
    }

    return error;
  }


  //servicios HTTP
  public registrarDoctor(data: any): Observable<any> {
    var token = this.authService.getSessionToken();
    var headers = new HttpHeaders({'Content-Type': 'application/json','Authorization': 'Bearer ' + token});
    return this.http.post<any>(`${environment.url_api}/doctors/`, data, { headers: headers });
  }

  public obtenerListaDoctores(): Observable<any> {
    var token = this.authService.getSessionToken();
    var headers = new HttpHeaders({'Content-Type': 'application/json','Authorization': 'Bearer ' + token});
    return this.http.get<any>(`${environment.url_api}/lista-medicos/`, { headers: headers });
  }

  public getDoctorByID(idDoctor: number): Observable<any> {
    var token = this.authService.getSessionToken();
    var headers = new HttpHeaders({'Content-Type': 'application/json','Authorization': 'Bearer ' + token});
    return this.http.get<any>(`${environment.url_api}/doctors/?id=${idDoctor}`, { headers: headers });
  }

  public editarDoctor(data: any): Observable<any> {
    var token = this.authService.getSessionToken();
    var headers = new HttpHeaders({'Content-Type': 'application/json','Authorization': 'Bearer ' + token});
    return this.http.put<any>(`${environment.url_api}/doctors-edit/`, data, { headers: headers });
  }

  public cambiarEstadoDoctor(idDoctor: number): Observable<any> {
    var token = this.authService.getSessionToken();
    var headers = new HttpHeaders({'Content-Type': 'application/json','Authorization': 'Bearer ' + token});
    return this.http.put<any>(
      `${environment.url_api}/doctors/change-status/?id=${idDoctor}`,
      {},
      { headers: headers }
    );
  }

}
