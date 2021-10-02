import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './account/login/login.component';
import { FinanceiroComponent } from './dashboard/financeiro/financeiro.component';
import { PerformanceComponent } from './dashboard/performance/performance.component';
import { FormPontuacaoComponent } from './account/form-pontuacao/form-pontuacao.component';
import { HomeComponent } from './layout/home/home.component';
import { AuthenticateComponent } from './layout/authenticate/authenticate.component';
import { CreateAccountComponent } from './account/create-account/create-account.component';
import { AuthGuard } from './service/auth.guard';

const routes: Routes = [

  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'dash-financeiro', pathMatch: 'full' },
      { path: 'dash-financeiro', component: FinanceiroComponent },
      { path: 'dash-performance', component: PerformanceComponent },
      { path: 'form-relatorio', component: FormPontuacaoComponent }
    ],
    canActivate: [AuthGuard]
  },
  {
    path: '',
    component: AuthenticateComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'create-account', component: CreateAccountComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
