import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { mergeMap, Observable } from 'rxjs';
  
@Injectable()
  export class AddHeaderInterceptor implements HttpInterceptor {
    constructor(){}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        req = this.handleRequest(req);
        return next.handle(req).pipe(
            mergeMap(evt => this.handleResponse(evt))
        );
    }

    handleRequest(req: any) {
        console.log(`拦截器A在请求发起前的拦截处理`);
        return req;
    }
    handleResponse(evt: any) {
        console.log("拦截器A在数据返回后的拦截处理");
        return new Observable<HttpEvent<any>>(observer => {
            observer.next(evt);
        });
    }
  }