import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingComponent } from './screens/landing/landing.component';
import { LoginComponent } from './screens/auth/login/login.component';
import { RegisterComponent } from './screens/auth/register/register.component';
import { DashboardComponent } from './screens/dashboard/dashboard.component';
import { AppointmentsListComponent } from './screens/appointments/appointments-list/appointments-list.component';
import { DoctorsListComponent } from './screens/doctors/doctors-list/doctors-list.component';
import { SpecialtiesListComponent } from './screens/specialties/specialties-list/specialties-list.component';
import { SpecialtiesFormComponent } from './screens/specialties/specialties-form/specialties-form.component';
import { PatientsListComponent } from './screens/patients/patients-list/patients-list.component';
import { RecordsListComponent } from './screens/records/records-list/records-list.component';
import { ReportsComponent } from './screens/reports/reports.component';
import { ProfileComponent } from './screens/profile/profile.component';
import { AppointmentsFormComponent } from './screens/appointments/appointments-form/appointments-form.component';
import { DoctorsFormComponent } from './screens/doctors/doctors-form/doctors-form.component';
import { ConsultoriosListComponent } from './screens/consultorios/consultorios-list/consultorios-list.component';
import { ConsultoriosFormComponent } from './screens/consultorios/consultorios-form/consultorios-form.component';
import { GraficasComponent } from './screens/graficas/graficas.component';



const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'appointments/list', component: AppointmentsListComponent },
  { path: 'appointments/form', component: AppointmentsFormComponent },
  { path: 'appointments/form/:id', component: AppointmentsFormComponent },
  { path: 'doctors/list', component: DoctorsListComponent },
  { path: 'doctors/form', component: DoctorsFormComponent },
  { path: 'doctors/form/:id', component: DoctorsFormComponent },
  { path: 'specialties/list', component: SpecialtiesListComponent },
  { path: 'specialties/form', component: SpecialtiesFormComponent },
  { path: 'specialties/form/:id', component: SpecialtiesFormComponent },
  { path: 'patients/list', component: PatientsListComponent },
  { path: 'records/list', component: RecordsListComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'consultorios/list', component: ConsultoriosListComponent },
  { path: 'consultorios/form', component: ConsultoriosFormComponent },
  { path: 'consultorios/form/:id', component: ConsultoriosFormComponent },
  { path: 'graficas', component: GraficasComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
