import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { routes } from './app.routes';
import { LoginComponent } from './login.component';

import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(FormsModule, ReactiveFormsModule),
    AuthService,
    AuthGuard
  ]
};
