
import { Component, OnInit } from '@angular/core';
import { AuthService } from './../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  formData: any = {};
  errors: any = [];

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  signup(): void {
    this.errors = [];
    this.auth.signup(this.formData)
      .subscribe(() => {
        this.router.navigate(['/login'], { queryParams: { registered: 'success' } });
       },
        (errorResponse: { error: { error: any; }; }) => {
          this.errors.push(errorResponse.error.error);
        });
  }
}
