import {Component} from '@angular/core';
import {UserInfo} from "../../../models/user-info";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MessageService} from "primeng/api";
import {Router} from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  providers: [MessageService]
})
export class SignupComponent {
  formData: UserInfo = {}

  constructor(private http: HttpClient, private messageService: MessageService, private router: Router) {
  }

  onSubmit() {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.post('http://localhost:8080/api/auth/signup', this.formData, {headers})
      .subscribe({
        next: (response) => {
          this.messageService.add({severity: 'success', summary: 'Success', detail: 'User registered successfully!'});
          this.formData = {};
          this.router.navigate(['/auth/login']).then(r => {
          });
        },
        error: ({error}) => {
          this.formData = {};
          Object.keys(error).forEach(param => {
            this.messageService.add({severity: 'error', summary: "Invalid credentials", detail: error[param]});
          });
        }
      });
  }
}
