import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BackendService } from '../pages/services/backend.service';
import { ApiResult, ApiResultType } from '../shared/common.type';
import { User } from './user';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User | null>;
    public user: Observable<User | null>;

    constructor(
        private router: Router,
        private http: HttpClient,
        private backendService: BackendService,
    ) {
        this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
        this.user = this.userSubject.asObservable();
    }
    public get userValue() {
        return this.userSubject.value;
    }
    public get userId(){
        return this.userSubject.value?.session?.id;
    }
    public get userName(){
        return this.userSubject.value?.session?.username;
    }
    login(username: string, password: string) {
       return this.backendService.login<ApiResult>(username,password).pipe(map(res=>{
            if (res.status === ApiResultType.Success) {
                const user = {
                    accessToken:res.data.accessToken,
                    session:res.data.session
                }
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
            }
        }));
    }
    logout() {
        localStorage.removeItem('user');
        
        return this.backendService.logOut<ApiResult>().pipe(map(res=>{
            if (res.status === ApiResultType.Success) {
                this.userSubject.next(null);
                this.router.navigate(['/login']);
            }
        }))
    }
}
