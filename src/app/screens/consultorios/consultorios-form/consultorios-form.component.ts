import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ConsultoriosService } from 'src/app/services/consultorios.service';
import { AuthService } from 'src/app/services/auth.service';
declare var $: any;

@Component({
  selector: 'app-consultorios-form',
  templateUrl: './consultorios-form.component.html',
  styleUrls: ['./consultorios-form.component.scss']
})
export class ConsultoriosFormComponent implements OnInit {

  public consultorio: any = {};
  public errores: any = {};
  public editar: boolean = false;
  public idConsultorio: number = 0;
  public token: string = '';

  constructor(
    public activatedRoute: ActivatedRoute,
    private location: Location,
    private consultoriosService: ConsultoriosService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.token = this.authService.getSessionToken();
    const rol = this.authService.getUserGroup();

    if (this.token == '' || rol !== 'administrador') {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.consultorio = this.consultoriosService.esquemaConsultorio();

    if (this.activatedRoute.snapshot.params['id'] != undefined) {
      this.editar = true;
      this.idConsultorio = this.activatedRoute.snapshot.params['id'];
      this.obtenerConsultorio();
    }
  }

  public obtenerConsultorio(): void {
    this.consultoriosService.obtenerConsultorioByID(this.idConsultorio).subscribe(
      (response) => {
        this.consultorio = response;
        console.log('Consultorio cargado: ', this.consultorio);
      },
      (error) => {
        alert('No se pudo obtener la información del consultorio');
        console.error(error);
      }
    );
  }

  public guardarConsultorio(): void {
    this.errores = [];
    this.errores = this.consultoriosService.validarConsultorio(this.consultorio, this.editar);

    if (!$.isEmptyObject(this.errores)) {
      return;
    }

    let peticion$;

    if (this.editar) {
      this.consultorio.id = this.idConsultorio;
      peticion$ = this.consultoriosService.editarConsultorio(this.consultorio);
    } else {
      peticion$ = this.consultoriosService.registrarConsultorio(this.consultorio);
    }

    peticion$.subscribe(
      () => {
        alert(this.editar ? 'Consultorio actualizado correctamente' : 'Consultorio registrado correctamente');
        this.router.navigate(['/consultorios/list']);
      },
      (error) => {
        alert('No se pudo ' + (this.editar ? 'actualizar' : 'registrar') + ' el consultorio');
        console.error(error);
      }
    );
  }


  public regresar(): void {
    this.location.back();
  }
}
