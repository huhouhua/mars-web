import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { map, mergeMap, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AccountService } from './account.service';
  
@Injectable()
  export class ErrorInterceptor implements HttpInterceptor {
    constructor(private accountService: AccountService,
      private notification: NzNotificationService ){}
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return next.handle(request).pipe(catchError(err => {
          if ([401, 403].includes(err.status) && this.accountService.userValue) {
              this.accountService.logout();
          }
          const error = err.error?.message || err.statusText;
          console.error(err);
          return throwError(() => error);
      }))
  }
  }