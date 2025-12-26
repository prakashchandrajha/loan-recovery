import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { DivisionDashboardComponent } from './dashboard/division-dashboard.component';
import { RecoveryDashboardComponent } from './dashboard/recovery-dashboard.component';
import { LegalDashboardComponent } from './dashboard/legal-dashboard.component';
import { RegionalOffice1DashboardComponent } from './dashboard/regional-office-1-dashboard.component';
import { RegionalOffice2DashboardComponent } from './dashboard/regional-office-2-dashboard.component';
import { OfficerDashboardComponent } from './dashboard/officer-dashboard.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'division-dashboard', component: DivisionDashboardComponent, canActivate: [AuthGuard] },
  { path: 'recovery-dashboard', component: RecoveryDashboardComponent, canActivate: [AuthGuard] },
  { path: 'legal-dashboard', component: LegalDashboardComponent, canActivate: [AuthGuard] },
  { path: 'regional-office-1-dashboard', component: RegionalOffice1DashboardComponent, canActivate: [AuthGuard] },
  { path: 'regional-office-2-dashboard', component: RegionalOffice2DashboardComponent, canActivate: [AuthGuard] },
  { path: 'officer-dashboard', component: OfficerDashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard] }
];
