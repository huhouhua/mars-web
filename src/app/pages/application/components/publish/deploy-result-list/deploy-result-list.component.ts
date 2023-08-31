import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';

import { zip as _zip, Subscription } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiResult, ApiResultType, Option } from 'src/app/shared/common.type';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FormBuilder } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UserService } from 'src/app/helpers/user.service';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { ViewAppDeployComponent } from '../view-deploy/view-deploy.component';
import * as YAML from 'js-yaml';
import { ViewAppDeployFailComponent } from '../view-deploy-fail/view-deploy-fail.component';
import { cloneDeep, uniq, uniqBy } from 'lodash-es';
import { BackendService } from 'src/app/pages/services/backend.service';
import { dateFormat } from 'src/app/shared/util/util';
@Component({
  selector: 'app-deploy-list',
  templateUrl: './deploy-result-list.component.html',
  styleUrls: ['./deploy-result-list.component.less'],
})
export class DeployResultlistComponent implements OnInit {
  @Input() public Id!: string;
  public loadData: boolean = false;
  public loading: boolean = false;
  public total = 0;
  public name:string ='';
  public cacheListData: any = {
    list: [],
    total: 0,
  };
  public listData: any = {
    list: [],
    total: 0,
  };

  constructor(
    private fb: FormBuilder,
    private modal: NzModalService,
    private backendService: BackendService,
    private notification: NzNotificationService,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    private drawerService: NzDrawerService
  ) {}

  ngOnInit(): void {
      this.loadDeploy();
  }
  public clickSearch() {
    if(this.name.trim()==''){
        this.listData = cloneDeep(this.cacheListData)
        this.total = this.cacheListData.total;
        return;
    }
    let list =  this.cacheListData.list.filter((a:any)=>{
        return a.svc.svc_name.includes(this.name);
     })
     this.listData.list =  list;
     this.listData.total = list.length;
     this.total= list.length;
  }

  private loadDeploy(){
    this.loading = true;
    this.backendService
      .getPublishResult<ApiResult>(this.Id)
      .subscribe(
        (res) => {
          if (res.code === ApiResultType.Success) {
            let deployArray =JSON.parse(res.data.deploy_Result) as Array<any>
            this.listData.list = deployArray.sort((a:any,b:any)=>a.svc.priority-b.svc.priority);
            this.listData.total = deployArray.length;
            this.total = deployArray.length;
            this.cacheListData = cloneDeep(this.listData)
          }
          this.loading = false;
          this.changeDetector.detectChanges();
        },
        (err) => {
          this.loading = false;
        }
      );
  }

  private toYaml(str:string):string{
   return YAML.dump(str, {
        lineWidth: 5000,
      });
  }
  public view(data:any) {
    let provider  = JSON.parse(data.svc.provider);
    provider.repo_username
    provider.repo_password="*********"

    if(data.status ==1){
        this.drawerService.create({
            nzTitle: `查看元数据`,
            nzContent: ViewAppDeployFailComponent,
            nzWidth: 1300,
            nzContentParams: {
              providerToYaml: this.toYaml(provider),
              err:data.err
            },
            nzPlacement: 'right',
          });
        return
    }
  
    let release = JSON.parse(data.release);
    release.configToYaml = this.toYaml(release.config);
    release.valuesToYaml = this.toYaml(release.chart.values);
    this.drawerService.create({
      nzTitle: `查看元数据`,
      nzContent: ViewAppDeployComponent,
      nzWidth: 1300,
      nzContentParams: {
        release: release,
        providerToYaml: this.toYaml(provider),
      },
      nzPlacement: 'right',
    });

    console.log(release);
  }

  public strategyToTest(strategy: string): string {
    switch (strategy) {
      case 'recreate':
        return 'recreate(先删除在创建)';
      case 'readjust(先创建在删除)':
        return 'fail';
      case 'failureIgnore':
        return 'failureIgnore(创建失败忽略)';
    }
    return '';
  }
  public statusToColor(status: number): string {
    switch (status) {
      case 0:
        return 'default';
      case 1:
        return 'error';
      case 2:
        return 'success';
    }
    return '';
  }
  public statusToText(status: number): string {
    switch (status) {
      case 0:
        return 'unstart';
      case 1:
        return 'fail';
      case 2:
        return 'success';
    }
    return '';
  }
}
