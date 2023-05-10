/*
 * @Author: RYH
 * @Date: 2021-11-26 19:01:59
 * @LastEditors: RYH
 * @LastEditTime: 2022-02-10 13:37:26
 */
import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';

import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BackendService } from 'src/app/pages/services/backend.service';
import { CreateTemplateComponent } from '../create-template/create-template.component';
import { ApiResult, ApiResultType, Member, MemberRole, Option } from 'src/app/shared/common.type';
import { CreateBuildPackageComponent } from '../create-build-package/create-build-package.component';

// import { UserService } from '@services/user/user-service';


const count = 5;
@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.less'],
})
export class TemplateListComponent implements OnInit {
  @Input() applicationId: string ='';
  @Input() appName: string ='';
  public initLoading = true; // bug
  public listData: any = {
    pageCount: Number,
    pageIndex: Number,
    pageSize: Number,
    totalItemCount: Number,
  };
  typeOptions: Option[] = [
    { name: '结构化配置模版', value: 1 },
    { name: 'raw配置模版', value: 2 },
    { name: '微服务模板', value: 3 },
    { name: '测试部署模板', value: 4 },
  ];
  constructor(
    private router: Router,
    private msg: NzMessageService,
    private modal:NzModalService,
  
    private backendService: BackendService,
  ) // private userService: UserService,
  {}

  ngOnInit(): void {
 
    this.getData();
  }

  async getData(): Promise<void> {
    // if (this.userService.getCurrentUsers().size === 0) {
    //   await this.userService.loadUsers();
    // }

    this.initLoading = true;
    this.backendService
      .templateList<ApiResult>({ pageSize: 9999, applicationId: this.applicationId })
      .subscribe((res: any) => {
        this.listData = res.data;
        this.initLoading = false;
      });
  }


  configTpl(item: any): void {
     this.router.navigateByUrl(`/app-list/detail/template/config/${item.id}`);
  }

  public handlerType(type:number):string{
    return this.typeOptions.find(q=>q.value == type)?.name ?? '';
  }

  openStructure() {
    this.modal.create({
        nzTitle:'新增模板',
        nzWidth:700,
        nzComponentParams:{
            applicationId: this.applicationId,
        },
        nzContent:CreateTemplateComponent,
        nzOnOk:(ret)=>{
            this.ngOnInit();
        },
        });
  }

  build(item: any): void {

    this.modal.create({
      nzTitle:'发包',
      nzWidth:700,
      nzComponentParams:{
          templateId: item.id,
      },
      nzContent:CreateBuildPackageComponent,
      nzOnOk:(ret)=>{
          this.ngOnInit();
      },
      });


    // this.modal
    //   .create(
    //     BuildPackRestructureComponent,
    //     {
    //       templateId: item.id,
    //       applicationId: this.applicationId,
    //       title: item.name,
    //     },
    //     {
    //       size: 'xl',
    //       modalOptions: {
    //         nzClosable: false,
    //         nzMaskClosable: false,
    //         nzKeyboard: false,
    //       },
    //     },
    //   )
    //   .subscribe(res => {
    //     this.getData();
    //     this.initLoading = false;
    //     this.detail.pos = 1;
    //   });
  }

  removeTemplate(item: any): void {
    // if (!this.ciLoading) {
    //   this.ciLoading = true;
    //   this.backendService.releaseTemplateDelete<ApiResult>(item.id).subscribe(
    //     res => {
    //       this.ciLoading = false;
    //       if (res.status === ApiResultType.Success) {
    //         this.msg.success('操作完成！');
    //         this.initLoading = true;
    //         this.getData();
    //       }
    //     },
    //     err => {
    //       this.ciLoading = false;
    //     },
    //   );
    // }
  }
}
