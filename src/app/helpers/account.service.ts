import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BackendService } from '../pages/services/backend.service';
import { ApiResult, ApiResultType } from '../shared/common.type';
import { User } from './user';
import { parseJwt } from '../shared/util/jwt-util';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;
  private readonly storageUserKey: string = 'user';
  constructor(private router: Router, private backendService: BackendService) {
    this.userSubject = new BehaviorSubject(JSON.parse(this.StorageUser!));
    this.user = this.userSubject.asObservable();
  }
  public get userValue(): User | null {
    return this.userSubject.value;
  }
  public get userId(): number {
    const id = this.userSubject.value?.gitLabSession?.id;
    if (!id) {
      return 0;
    }
    return id;
  }
  public get username(): string {
    const name = this.userSubject.value?.gitLabSession?.username;
    if (!name) {
      return '';
    }
    return name;
  }
  private get StorageUser(): string | null {
    return localStorage.getItem(this.storageUserKey);
  }
  private removeStorageUser(): void {
    return localStorage.removeItem(this.storageUserKey);
  }
  private setStorageUser(user: User): void {
    return localStorage.setItem(this.storageUserKey, JSON.stringify(user));
  }
  public login(username: string, password: string): Observable<void> {
    return this.backendService.login<ApiResult>(username, password).pipe(
      map((res) => {
        if (res.code === ApiResultType.Success) {
          const profile= parseJwt(res.data.token)
          const user = {
            gitLabAccessToken: profile.gitlab.accessToken,
            gitLabSession: profile.gitlab.session,
            token: res.data.token,
          };
          this.setStorageUser(user);
          this.userSubject.next(user);
        }
      })
    );
  }
  public logout(): void {
    this.clear();
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }
  public clear(): void {
    this.removeStorageUser();
  }
}
