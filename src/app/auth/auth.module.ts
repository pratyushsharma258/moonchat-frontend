import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {SignupComponent} from "./components/signup/signup.component";
import {provideHttpClient} from "@angular/common/http";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {InputIconModule} from "primeng/inputicon";
import {IconFieldModule} from "primeng/iconfield";
import {FloatLabelModule} from "primeng/floatlabel";
import {PasswordModule} from "primeng/password";
import {DividerModule} from "primeng/divider";
import {ToastModule} from "primeng/toast";


const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
];

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
  ],
  providers: [
    provideHttpClient()
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    PasswordModule,
    DividerModule,
    ToastModule
  ]
})
export class AuthModule {
}
