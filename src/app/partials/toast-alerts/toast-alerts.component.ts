import { Component, OnInit } from '@angular/core';

interface ToastMessage {
  type: 'success' | 'error' | 'info';
  text: string;
}

@Component({
  selector: 'app-toast-alerts',
  templateUrl: './toast-alerts.component.html',
  styleUrls: ['./toast-alerts.component.scss']
})
export class ToastAlertsComponent implements OnInit {

  // placeholder: luego esto vendrá de un servicio
  public messages: ToastMessage[] = [
    // Ejemplo:
    // { type: 'success', text: 'Operación realizada correctamente.' },
    // { type: 'error', text: 'Ocurrió un error al cargar las citas.' }
  ];

  constructor() {}

  ngOnInit(): void {
    console.log('ToastAlertsComponent inicializado');
  }
}
