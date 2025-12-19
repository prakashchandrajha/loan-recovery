import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { DivisionDashboardComponent } from './dashboard/division-dashboard.component';
import { RecoveryDashboardComponent } from './dashboard/recovery-dashboard.component';
import { LegalDashboardComponent } from './dashboard/legal-dashboard.component';
import { OfficerDashboardComponent } from './dashboard/officer-dashboard.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { AuthGuard } from './auth/auth.guard';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'division-dashboard', component: DivisionDashboardComponent },
      { path: 'recovery-dashboard', component: RecoveryDashboardComponent },
      { path: 'legal-dashboard', component: LegalDashboardComponent },
      { path: 'officer-dashboard', component: OfficerDashboardComponent },
      { path: 'admin-dashboard', component: AdminDashboardComponent }
    ]
  }
];
