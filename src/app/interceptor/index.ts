import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { AuthInterceptorInterceptor } from './auth-interceptor.interceptor';

export const httpInterceptorProvider = [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorInterceptor, multi: true },
];