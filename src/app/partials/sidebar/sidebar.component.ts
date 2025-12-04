import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems = [
    { label: 'Dashboard', icon: '📊', route: '/dashboard' },
    { label: 'Citas', icon: '📅', route: '/appointments/list' },
    { label: 'Médicos', icon: '👨‍⚕️', route: '/doctors/list' },
    { label: 'Especialidades', icon: '🏷️', route: '/specialties/list' },
    { label: 'Pacientes', icon: '🧑‍🤝‍🧑', route: '/patients/list' },
    { label: 'Expedientes', icon: '📁', route: '/records/list' },
    { label: 'Reportes', icon: '📈', route: '/reports' },
    { label: 'Perfil', icon: '👤', route: '/profile' },
  ];

  constructor() {}

  ngOnInit(): void {
    console.log('SidebarComponent inicializado');
  }
}
