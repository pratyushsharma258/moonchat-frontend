import {Component} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {AuthService} from "../../../services/auth/auth.service";
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent {
  formData: any = {};

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
  }

  onSubmit() {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.post('http://localhost:8080/api/auth/signin', this.formData, {headers})
      .subscribe({
        next: (response: any) => {
          this.authService.setToken(response.token);
          this.messageService.add({severity: 'success', summary: 'Success', detail: 'Logged in successfully!'});
          this.router.navigate(['/chat/dashboard']);
        },
        error: (error) => {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'Login failed!'});
        }
      });
  }
}
