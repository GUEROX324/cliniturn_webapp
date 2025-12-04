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
export class SpecialtiesService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private validatorService: ValidatorService,
    private errorService: ErrorsService
  ) { }

  public esquemaEspecialidad() {
    return {
      id: '',
      clave: '',
      nombre: '',
      descripcion: '',
      activa: true
    };
  }

  public validarEspecialidad(data: any, editar: boolean) {
    let error: any = [];

    if (!this.validatorService.required(data["clave"])) {
      error["clave"] = this.errorService.required;
    }

    if (!this.validatorService.required(data["nombre"])) {
      error["nombre"] = this.errorService.required;
    }

    return error;
  }


   //servicios HTTP
  public registrarEspecialidad(data: any): Observable<any> {
    var token = this.authService.getSessionToken();
    var headers = new HttpHeaders({'Content-Type': 'application/json','Authorization': 'Bearer ' + token});
    return this.http.post<any>(`${environment.url_api}/specialties/`, data, { headers: headers });
  }

  public obtenerListaEspecialidades(): Observable<any> {
    var token = this.authService.getSessionToken();
    var headers = new HttpHeaders({'Content-Type': 'application/json','Authorization': 'Bearer ' + token});
    return this.http.get<any>(`${environment.url_api}/lista-especialidades/`, { headers: headers });
  }

  public getEspecialidadByID(idEspecialidad: number): Observable<any> {
    var token = this.authService.getSessionToken();
    var headers = new HttpHeaders({'Content-Type': 'application/json','Authorization': 'Bearer ' + token});
    return this.http.get<any>(`${environment.url_api}/specialties/?id=${idEspecialidad}`, { headers: headers });
  }

  public editarEspecialidad(data: any): Observable<any> {
    var token = this.authService.getSessionToken();
    var headers = new HttpHeaders({'Content-Type': 'application/json','Authorization': 'Bearer ' + token});
    return this.http.put<any>(`${environment.url_api}/specialties-edit/`, data, { headers: headers });
  }

  public cambiarEstadoEspecialidad(idEspecialidad: number): Observable<any> {
    var token = this.authService.getSessionToken();
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.http.put<any>(
      `${environment.url_api}/specialties/change-status/?id=${idEspecialidad}`,
      {},
      { headers: headers }
    );
  }

}
