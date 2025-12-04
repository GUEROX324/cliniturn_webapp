import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ValidatorService } from './tools/validator.service';
import { ErrorsService } from './tools/errors.service';
import { AuthService } from './auth.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private authService: AuthService
  ) {}

  public esquemaPaciente() {
    return {
      rol: 'paciente',
      matricula: '',
      nombre: '',
      email: '',
      password: '',
      confirmar_password: '',
      telefono: '',
      carrera: ''
    };
  }

  public validarPaciente(data: any, editar: boolean) {
    console.log('Validando paciente...', data);

    let error: any = [];

    if (!this.validatorService.required(data['matricula'])) {
      error['matricula'] = this.errorService.required;
    }

    if (!this.validatorService.required(data['nombre'])) {
      error['nombre'] = this.errorService.required;
    }

    if (!this.validatorService.required(data['email'])) {
      error['email'] = this.errorService.required;
    } else if (!this.validatorService.max(data['email'], 40)) {
      error['email'] = this.errorService.max(40);
    } else if (!this.validatorService.email(data['email'])) {
      error['email'] = this.errorService.email;
    }

    if (!editar) {
      if (!this.validatorService.required(data['password'])) {
        error['password'] = this.errorService.required;
      }
      if (!this.validatorService.required(data['confirmar_password'])) {
        error['confirmar_password'] = this.errorService.required;
      }
    }

    if (!this.validatorService.required(data['telefono'])) {
      error['telefono'] = this.errorService.required;
    }

    if (!this.validatorService.required(data['carrera'])) {
      error['carrera'] = this.errorService.required;
    }

    return error;
  }

  public registrarPaciente(data: any): Observable<any> {
    return this.http.post<any>(`${environment.url_api}/patients/`, data, httpOptions);
  }

  public obtenerListaPacientes(): Observable<any> {
    const token = this.authService.getSessionToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.http.get<any>(`${environment.url_api}/lista-pacientes/`, { headers });
  }

  public getPacienteByID(idPaciente: number): Observable<any> {
    const token = this.authService.getSessionToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.http.get<any>(`${environment.url_api}/patients/?id=${idPaciente}`, { headers });
  }

  public editarPaciente(data: any): Observable<any> {
    const token = this.authService.getSessionToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.http.put<any>(`${environment.url_api}/patients-edit/`, data, { headers });
  }

  public cambiarEstadoPaciente(idPaciente: number): Observable<any> {
    const token = this.authService.getSessionToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.http.post<any>(`${environment.url_api}/patients/change-status/`, { id: idPaciente }, { headers });
  }
}
