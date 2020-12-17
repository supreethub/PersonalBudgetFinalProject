import { KeyValue } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  notify!: string;

  public dataSource = {
    datasets: [
      {
        Title: [] as any,
        Budget: [] as any,
        Amount_Spent: [] as any,
      },
    ],
  };

  constructor(
    public auth: AuthService,
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.http
      .get('http://157.230.233.155:8080/api/users/budget')
      .subscribe((res: any) => {
        for (let i = 0; i < res.data.length; i++) {
          this.dataSource.datasets[0].Budget[i] = res.data[i].budgetVal;
          this.dataSource.datasets[0].Title[i] = res.data[i].title;
          this.dataSource.datasets[0].Amount_Spent[i] = res.data[i].amtSpent;
        }
      });
  }

  /*
This comparer function prevents the default keyvalue pipe from sorting Alphabetically.
It now keeps the original order I have declared above (Title, Budget, Amount_Spent)
*/
  originalOrder = (
    a: KeyValue<string, string>,
    b: KeyValue<string, string>
  ): number => {
    return 0;
  };
}



