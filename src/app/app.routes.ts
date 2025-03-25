import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FormularioComponent } from './formulario/formulario.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { AuthGuard } from './guards/auth.guard';
import { RegistroComponent } from './registro/registro.component';
import { AgendaComponent } from './agenda/agenda.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {path: 'home', component:HomeComponent},
  { path: 'login', component: LoginComponent },
  { path: 'formulario', component: FormularioComponent },
  { path: 'agenda', component: AdminComponent },
  { path: 'servicios', component: ServiciosComponent },
  { path: 'servicios/:tipo', component: ServiciosComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: { rol: 'admin' } },
  { path: 'usuario', component: UsuarioComponent, canActivate: [AuthGuard], data: { rol: 'usuario' } },
  { path: 'registro', component: RegistroComponent },
  {path: 'mi_cita', component:AgendaComponent}
];
