import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart } from 'chart.js';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  notify!: string;
  notify2!: string;
  formData: any = {};
  errors: any = [];
  overBudget = false;
  titlesOverBudget: any = [];

  data = [] as any;

  public dataSource = {
    datasets: [
      {
        data: [] as any,
        backgroundColor: [] as any,
      },
      {
        data: [] as any,
        backgroundColor: '#0000007f',
        label: 'Amount Spent This Month',
      },
    ],
    labels: [] as any,
  };

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const key1 = 'added';
      const key2 = 'updated';
      const key3 = 'overBudget';

      if (params[key1] === 'success') {
        this.notify = 'Budget Successfully Added!';
      }
      if (params[key2] === 'success') {
        this.notify = 'Budget Successfully Updated!';
      }
      if (params[key3] === 'true') {
        this.notify2 = 'You Are Over Budget!!!!!';
      }
    });

    this.http
      .get('http://157.230.233.155:8080/api/users/budget')
      .subscribe((res: any) => {
        for (let i = 0; i < res.data.length; i++) {
          this.dataSource.datasets[0].data[i] = res.data[i].budgetVal;
          this.dataSource.datasets[0].backgroundColor[i] = res.data[i].color;
          this.dataSource.labels[i] = res.data[i].title;
          this.dataSource.datasets[1].data[i] = res.data[i].amtSpent;

          if (
            this.dataSource.datasets[1].data[i] >
            this.dataSource.datasets[0].data[i]
          ) {
            this.overBudget = true;
            this.titlesOverBudget.push(this.dataSource.labels[i]);
            this.notify2 =
              'You Are Over Budget in ' + this.titlesOverBudget + '!';
          }
        }
        this.createDoughnutChart();
        this.createBarChart();
        this.createPolarAreaChart();
      });
  }

  createDoughnutChart() {
    const canvas = document.getElementById(
      'myDoughnutChart'
    ) as HTMLCanvasElement;
    const ctx: any = canvas.getContext('2d');
    const myPieChart = new Chart(ctx, {
      type: 'doughnut',
      data: this.dataSource,
    });
  }

  createBarChart() {
    const canvas = document.getElementById('myBarChart') as HTMLCanvasElement;
    const ctx: any = canvas.getContext('2d');
    const myBarChart = new Chart(ctx, {
      type: 'bar',
      data: this.dataSource,
    });
  }

  createPolarAreaChart() {
    const canvas = document.getElementById(
      'myPolarAreaChart'
    ) as HTMLCanvasElement;
    const ctx: any = canvas.getContext('2d');
    const myLineChart = new Chart(ctx, {
      type: 'polarArea',
      data: this.dataSource,
    });
  }

  reloadComponent() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/dashboard'], {
      queryParams: { updated: 'success' },
    });
    if (this.overBudget === true) {
      this.router.navigate(['/dashboard'], {
        queryParams: { updated: 'success', overBudget: 'true' },
      });
    }
  }

  addAmtSpent(): void {
    this.errors = [];
    this.auth.addAmtSpent(this.formData).subscribe(
      () => {
        this.reloadComponent();
      },
      (errorResponse: { error: { error: any } }) => {
        this.errors.push(errorResponse.error.error);
      }
    );
  }
}
