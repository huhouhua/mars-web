/*
 * @Author: RYH
 * @Date: 2021-05-17 15:29:03
 * @LastEditors: RYH
 * @LastEditTime: 2022-01-07 13:46:59
 */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { DetailService } from './detail.service';
import { BackendService } from 'src/app/pages/services/backend.service';
import { ApiResult, ApiResultType } from 'src/app/shared/common.type';
import { Option } from 'src/app/shared/common.type';
import { UserService } from 'src/app/helpers/user.service';
import { removeBodyStyle } from 'src/app/shared/help';
import { dateFormat } from 'src/app/shared/util/util';

interface Application {
  id?:string
  name?: string;
  description?: string;
  creation_time?: string;
  creation_user_id?: number;
}
@Component({
  selector: 'app-detail',
  templateUrl: './app-detail.component.html',
  styleUrls: ['./app-detail.component.less'],
})
export class AppDetailComponent implements OnInit {
  public visible = false;
  pos = 0;
  loading = false;
  appLoading = false;


 public  application: Application | undefined;
  public id:string ='';

  public buildLogData: object | undefined;
  public buildLogId: any;
  public isRelationPack: boolean | undefined;
  constructor(
    public notifySvc: NzNotificationService,
    private activeRouter: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    public detail: DetailService,
    private backendService: BackendService,
  ) {
    removeBodyStyle();
  }

  ngOnInit() {
    this.id = this.activeRouter.snapshot.paramMap.get('applicationId') ?? '';
    this.loadApp(this.id);
  }

  loadApp(id: any) {
    this.appLoading = true;
    this.backendService.getApplication<ApiResult>(id).subscribe(res => {
        this.appLoading = false;
      if (res.code === ApiResultType.Success) {
        this.application = res.data.application_view_model;
        
      }
    },err=>{
        this.appLoading = false;
    });
  }

  public format(dateStr:any):string{
    return dateFormat(dateStr);
  }
   /**
   * 用户 id 转换 用户名字
   * @param id
   * @returns str
   */
   getNameFunc(id:number): string {
    return this.userService.getNameFunc(id);
  }
  onBuildLogData(event:any) {
    this.buildLogData = event;
  }

  showBuildLog(data:any) {
    this.visible = true;
    this.buildLogId = data.id;
    this.isRelationPack = data.isRelationPack;
  }


  tabChange(index:number) {
    this.detail.pos = index;
  }

  deleteApp() {
    this.loading = true;
    this.backendService.deleteApplication<ApiResult>(this.id).subscribe(
      res => {
        this.loading = false;
        if (res.code === ApiResultType.Success) {
          this.notifySvc.success('删除成功！', '');
          this.router.navigateByUrl(`/app/list`);
        }
      },
      err => {
        this.loading = false;
      },
    );
  }
}
