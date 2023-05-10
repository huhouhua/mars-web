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

interface Application {
  name?: string;
  description?: string;
  creationTime?: string;
  author?: string;
  builderPageName?:string
  packageBuildId?: number
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

  public buildList:Option[] =[
    {
        value:1,
        name:"新包构建器"
    },
    {
        value:2,
        name:"老包构建器"
    },
  ];


 public  application: Application | undefined;
  public id:string ='';

  public buildLogData: object | undefined;
  public buildLogId: any;
  public isRelationPack: boolean | undefined;
  constructor(
    public notifySvc: NzNotificationService,
    private activeRouter: ActivatedRoute,
    private router: Router,
    public detail: DetailService,
    private backendService: BackendService,
  ) {}

  ngOnInit() {
    this.id = this.activeRouter.snapshot.paramMap.get('applicationId') ?? '';

    this.getApp(this.id);
  }

  getApp(id: any) {
    this.appLoading = true;
    this.backendService.getApplication<ApiResult>(id).subscribe(res => {
        this.appLoading = false;
      if (res.status === ApiResultType.Success) {
        this.application = res.data;
    
      }
    },err=>{
        this.appLoading = false;
    });
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
        if (res.status === ApiResultType.Success) {
          this.notifySvc.success('删除成功！', '');
          this.router.navigateByUrl(`/delivery/application/list`);
        }
      },
      err => {
        this.loading = false;
      },
    );
  }
}
