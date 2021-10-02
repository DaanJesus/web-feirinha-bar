import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  @Output()
  event: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  async login(user: any) {

    try {

      const res = await this.http.post<any>(`${environment.api}/login`, user).toPromise();
      if (res && res.token) {
        window.localStorage.setItem('token', res.token)

        this.snackBar.open(res.message, "X", {
          duration: 2000
        })

        return true
      } else {

        return false
      }
    } catch (error: any) {

      this.snackBar.open(error.error.error, "X", {
        duration: 2000
      })

      return false

    }
  }

  getAuthorizationToken() {
    const token = window.localStorage.getItem('token');
    return token;
  }

  getTokenExpirationDate(token: string): Date {
    const decoded: any = jwtDecode(token)

    window.localStorage.setItem('_id', decoded.id)

    if (decoded.exp === undefined) {
      return null
    }

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp)
    return date
  }

  isTokenExpired(token?: string): boolean {
    if (!token) {
      return true
    }

    const date = this.getTokenExpirationDate(token);
    if (date === undefined) {
      return false
    }

    return !(date.valueOf() > new Date().valueOf())
  }

  isUserLoggedIn() {
    const token = this.getAuthorizationToken();
    if (!token) {
      return false;
    } else if (this.isTokenExpired(token)) {

      this.snackBar.open('Sua sessão expirou. Entre novamente', "X", {
        duration: 2000
      })

      return false
    }

    return true
  }

  async getObjectUser() {
    const _id = window.localStorage.getItem('_id')
    let res: any;

    try {

      res = await this.http.get<any>(`${environment.api}/get-user/${_id}`).toPromise();

      if (res) {

        return res
      } else {

        return ""
      }

    } catch (error: any) {

      return ""

    }
  }

}