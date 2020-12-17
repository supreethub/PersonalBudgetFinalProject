import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as moment from 'moment';


const jwt = new JwtHelperService();

class DecodedToken {
  exp!: number;
  username!: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private uriseg = 'http://157.230.233.155:8080/api/users';
  private decodedToken;

  constructor(private http: HttpClient) {
    // tslint:disable-next-line: no-non-null-assertion
    this.decodedToken = JSON.parse(localStorage.getItem('auth_meta')!) || new DecodedToken();
   }

  public signup(userData: any): Observable<any> {
    const URI = this.uriseg + '/signup';
    return this.http.post(URI, userData);
  }

  public submit(budgetData: any): Observable<any> {
    const URI = this.uriseg + '/submit';
    return this.http.put(URI, budgetData);
  }

  public addAmtSpent(amtSpent: any): Observable<any> {
    const URI = this.uriseg + '/addAmtSpent';
    return this.http.put(URI, amtSpent);
  }

  public login(userData: any): Observable<any> {
    const URI = this.uriseg + '/login';
    return this.http.post(URI, userData).pipe(map(token => {
      this.getProfile(token).subscribe((res: any) => {})
      return this.saveToken(token);
    }));
  }

  private getProfile(token: any): any{
    const URI = this.uriseg + '/profile';
    return this.http.get(URI, { headers: new HttpHeaders({Authorization: 'Bearer ' + token})
  });
  }

  private saveToken(token: any): any {
    this.decodedToken = jwt.decodeToken(token);
    localStorage.setItem('auth_tkn', token);
    localStorage.setItem('auth_meta', JSON.stringify(this.decodedToken));
    return token;
  }

  public logout(): void {
    localStorage.removeItem('auth_tkn');
    localStorage.removeItem('auth_meta');

    this.decodedToken = new DecodedToken();
  }

  public isAuthenticated(): boolean {
    console.log(this.decodedToken.exp);
    return moment().isBefore(moment.unix(this.decodedToken.exp));
  }

  public getUsername(): string {
    return this.decodedToken.username;
}

}
