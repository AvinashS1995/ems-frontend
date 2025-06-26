import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardResolverService } from './components/pages/dashboard/dashboard-resolver.service';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    loadComponent: () =>
      import('../app/components/user/login/login.component').then(
        (c) => c.LoginComponent
      ),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import(
        '../app/components/user/forgot-password/forgot-password.component'
      ).then((c) => c.ForgotPasswordComponent),
  },

  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../app/components/pages/dashboard/dashboard.component').then(
            (c) => c.DashboardComponent),
            data: {
              title: "Dashboard"
            },
            resolve: { data: DashboardResolverService }
      },
      
    ],
  },
];
