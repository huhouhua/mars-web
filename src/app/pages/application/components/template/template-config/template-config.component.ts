import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { BackendService } from 'src/app/pages/services/backend.service';
import { NzDrawerOptions, NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PrviewConfigComponent } from '../../prview-config/prview-config.component';
import { ApiResult, ApiResultType, Member, MemberRole, Option } from 'src/app/shared/common.type';
import { UserService } from 'src/app/helpers/user.service';

// import { UserService } from '@services/user/user-service';
@Component({
  selector: 'app-template-config',
  templateUrl: './template-config.component.html',
  styleUrls: ['./template-config.component.less'],
})
export class TemplateConfigComponent implements OnInit {
  loading = false;
  templateId : string ='';
  app:any={};
  template: any = {};
  version = 0;
  configList: any[] = [];
  constructor(
    private activeRouter: ActivatedRoute,
    private modal: NzModalService,
    private drawerService: NzDrawerService,
    private backendService: BackendService,
    private userService: UserService,
  )
  {}

  ngOnInit() {
    this.templateId = this.activeRouter.snapshot.paramMap.get('templateId') ?? '';
    this.getDetail();
  }


  updateTemplate() {
    this.getDetail();
  }

  getDetail() {
    this.loading = true;
     this.backendService.getTemplateDetail<ApiResult>(this.templateId).subscribe(res => {
        if (res.code === ApiResultType.Success) {
          this.template = res.data.application_template_view_model;
          this.app = res.data.application_view_model;
      }
      this.loading = false;
    })
  }
 /**
   * 用户 id 转换 用户名字
   * @param id
   * @returns str
   */
 getNameFunc(id:number): string {
  return this.userService.getNameFunc(id);
}
  setUserName() {
    // if (this.userService.getCurrentUsers().size === 0) {
    //   await this.userService.loadUsers();
    // }
    // this.template.createUserName = this.userService.getCurrentUsers().get(this.template.creatorUserId);
    // this.template.updateUserName = this.userService.getCurrentUsers().get(this.template.updateUserId);
  }
  setAppName() {
    // const tplConfig = this.template.config ? JSON.parse(this.template.config) : {};
    // this.appName = tplConfig.appName ? tplConfig.appName : this.template.appName;
  }

  viewMetadata(record: any) {
    this.drawerService
      .create<PrviewConfigComponent>({
        nzTitle: `查看模板元数据配置`,
        nzSize:'large',
        nzWidth: '90%',
        nzClosable: true,
        nzPlacement: 'left',
        nzContent: PrviewConfigComponent,
        nzContentParams:  {
            record,
          }
        }
      )
  }
}
