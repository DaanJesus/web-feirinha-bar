import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { throwError } from "rxjs";
import { catchError, finalize, tap } from "rxjs/operators";
import { AuthService } from "../service/auth.service";
import { LoadingService } from "../service/loading.service";

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptorInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthService,
        private snackBar: MatSnackBar,
        public loading: LoadingService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        this.loading.isLoading.next(true)

        const token = this.authService.getAuthorizationToken();
        let request: HttpRequest<any> = req;

        if (token && !this.authService.isTokenExpired(token)) {
            request = req.clone({
                headers: req.headers.set('Atuhorization', `Bearer ${token}`)
            })
        }

        /* return next.handle(request)
            .pipe(
                catchError(this.handleError)
            ) */

        return next.handle(request).pipe(
            tap(e => {
                if (request.method == "POST" || request.method == "PUT")
                    if (e instanceof HttpResponse && e.status == 200) {
                        this.snackBar.open('Saved successfully.', 'close', { duration: 2000, panelClass: 'successSnack' });
                    }
            }),
            catchError(error => {
                this.snackBar.open(`${JSON.stringify(error.error.error)}`, "X", {
                    duration: 2000,
                    panelClass: 'errorSnack'
                })

                console.error(
                    `Código do erro ${error.status}, ` +
                    `Erro: ${JSON.stringify(error.error.error)}`
                );
                
                return throwError(error);
            }),
            finalize(() => {
                this.loading.isLoading.next(false)
            })
        );
    }
}