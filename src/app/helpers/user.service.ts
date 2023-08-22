import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { BackendService } from '../pages/services/backend.service';
import { ApiResult, ApiResultType } from '../shared/common.type';

@Injectable()
export class UserService {
  private userMap = new Map<Number, string>();
  private userkey = 'users';
  constructor(private backendService: BackendService) {
    this.getCacheUsers();
  }

  public isExistCurrentUser(id: Number): boolean {
    return this.userMap.has(id);
  }

  public getCacheUsers(): Map<Number, string> {
    const cacheUsers = sessionStorage.getItem(this.userkey);
    if (cacheUsers == null) {
      return new Map<Number,string>();
    }
    this.userMap.clear();
    const users = JSON.parse(cacheUsers);
    users.forEach((item:any)=> {
      this.userMap.set(item.key, item.value);
    });
    return this.userMap;
  }

  public clear(){
    this.userMap.clear();
    sessionStorage.removeItem(this.userkey);
  }
  public getCurrentUsers(): Map<Number, string> {
    return this.userMap;
  }

  public async loadUsers(): Promise<void> {
    return this.backendService
      .GetAllUserFromGitLab<ApiResult>()
      .toPromise()
      .then(res => {
        if (res.code === ApiResultType.Success) {
          this.setCurrentUsers(res.data);
          this.setCacheUsers();
        }
      })
      .catch(err => {
        console.error(err);
      });
  }
  public async LoadWithCache(): Promise<void> {
    if (this.getCurrentUsers().size > 0) {
      return;
    }
    await this.loadUsers();
  }

  /**
   * 用户 id 转换 用户名字
   * @param id
   * @returns str
   */
  public getNameFunc(id:Number): string {
    const user = this.getCurrentUsers().get(Number(id));
        if(user){
            return user;
        }
        return '';
  }

  /**
   * 用户 id 转换 用户名字
   * @param id
   * @returns str
   */
  public getNameFuncForDefault(id:Number): string {
    if (id === 0) {
      return '-';
    }
    return  this.getNameFunc(Number(id));
  }

  private setCacheUsers(): void {
    const list = new Array<any>();
    for (const [key, value] of this.userMap) {
      list.push({ key, value });
    }
    const users = JSON.stringify(list);
    sessionStorage.setItem(this.userkey, users);
  }

  private setCurrentUsers(users: Array<any>): void {
    if (users == null) {
      return;
    }
    users.forEach(item => {
      if (!this.userMap.has(item.id)) {
        this.userMap.set(item.id, item.username);
      }
    });
  }
}
