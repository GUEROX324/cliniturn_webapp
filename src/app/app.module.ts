import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';

//MATERIAL
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './screens/landing/landing.component';
import { LoginComponent } from './screens/auth/login/login.component';
import { RegisterComponent } from './screens/auth/register/register.component';
import { DashboardComponent } from './screens/dashboard/dashboard.component';
import { NavbarComponent } from './partials/navbar/navbar.component';
import { SidebarComponent } from './partials/sidebar/sidebar.component';
import { FooterComponent } from './partials/footer/footer.component';
import { BreadcrumbsComponent } from './partials/breadcrumbs/breadcrumbs.component';
import { ToastAlertsComponent } from './partials/toast-alerts/toast-alerts.component';
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
import { RecordViewModalComponent } from './modals/record-view-modal/record-view-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmAppointmentModalComponent } from './modals/confirm-appointment-modal/confirm-appointment-modal.component';
import { CancelAppointmentModalComponent } from './modals/cancel-appointment-modal/cancel-appointment-modal.component';
import { ConfirmDoctorDeactivationModalComponent } from './modals/confirm-doctor-deactivation-modal/confirm-doctor-deactivation-modal.component';
import { ConsultoriosListComponent } from './screens/consultorios/consultorios-list/consultorios-list.component';
import { ConsultoriosFormComponent } from './screens/consultorios/consultorios-form/consultorios-form.component';
import { GraficasComponent } from './screens/graficas/graficas.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    BreadcrumbsComponent,
    ToastAlertsComponent,
    AppointmentsListComponent,
    DoctorsListComponent,
    SpecialtiesListComponent,
    SpecialtiesFormComponent,
    PatientsListComponent,
    RecordsListComponent,
    ReportsComponent,
    ProfileComponent,
    AppointmentsFormComponent,
    DoctorsFormComponent,
    RecordViewModalComponent,
    ConfirmAppointmentModalComponent,
    CancelAppointmentModalComponent,
    ConfirmDoctorDeactivationModalComponent,
    ConsultoriosListComponent,
    ConsultoriosFormComponent,
    GraficasComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    CommonModule,
    NgChartsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
