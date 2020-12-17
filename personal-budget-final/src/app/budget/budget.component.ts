import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss']
})
export class BudgetComponent implements OnInit {


  formData: any = {};
  errors: any = [];
  notify!: string;

  constructor(private auth: AuthService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
  }

  submit(): void {
    this.errors = [];
    this.auth.submit(this.formData)
      .subscribe(() => {
        this.router.navigate(['/dashboard'], { queryParams: { added: 'success' } });
       },
        (errorResponse: { error: { error: any; }; }) => {
          this.errors.push(errorResponse.error.error);
        });
  }

}
