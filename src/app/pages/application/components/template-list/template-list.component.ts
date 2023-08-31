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
import { CreateTemplateComponent } from '../template/create-template/create-template.component';
import { ApiResult, ApiResultType, Member, MemberRole, Option } from 'src/app/shared/common.type';
import { CreatePublishComponent } from '../publish/create-publish/create-publish.component';
import { UserService } from 'src/app/helpers/user.service';

// import { UserService } from '@services/user/user-service';
import { map } from 'rxjs/operators';
import { EditTemplateComponent } from '../template/edit-template/edit-template.component';
import { removeBodyStyle } from 'src/app/shared/help';
import { DetailService } from '../app-detail/detail.service';
import { dateFormat } from 'src/app/shared/util/util';


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
    page_count: Number,
    page_index: Number,
    page_size: Number,
    total_item_count: Number,
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
    private userService: UserService,
    private backendService: BackendService,
    public detail: DetailService,
  ) 
  {
    removeBodyStyle();
  }

  ngOnInit(): void {
 
    this.getData();
  }
   /**
   * 用户 id 转换 用户名字
   * @param id
   * @returns str
   */
   getNameFunc(id:number): string {
    return this.userService.getNameFunc(id);
  }

  public format(dateStr:any):string{
    return dateFormat(dateStr);
  }
  
  async getData(): Promise<void> {
    // if (this.userService.getCurrentUsers().size === 0) {
    //   await this.userService.loadUsers();
    // }

    this.initLoading = true;
    this.backendService
      .templateList<ApiResult>({app_id:this.applicationId, page_size: 9999 })
      .subscribe((res: any) => {
        // if(res.data.application_template_view_models!=null){
        //   this.listData = res.data.map(res=>{
        //     res.loading = true
        //     return res
        //   })

        // }else{
        //   this.listData =res.data
        // }
        this.listData = res.data;
        this.initLoading = false;
      });
  }


  configTpl(item: any): void {
     this.router.navigateByUrl(`/app/detail/template/config/${item.id}`);
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

  editStructure(item: any) {
    this.modal.create({
        nzTitle:'编辑模板',
        nzWidth:700,
        nzComponentParams:{
            templateId: item.id,
        },
        nzContent:EditTemplateComponent,
        nzOnOk:(ret)=>{
            this.ngOnInit();
        },
        });
  }

  publish(item: any): void {

    this.modal.create({
      nzTitle:'发布',
      nzWidth:700,
      nzComponentParams:{
          templateId: item.id,
          applicationId:this.applicationId
      },
      nzContent:CreatePublishComponent,
      nzOnOk:(ret)=>{
        this.detail.pos =1
      },
      });

  }

  removeTemplate(item: any): void {
    this.initLoading = true;
    this.backendService.deleteTemplate<ApiResult>(item.id).subscribe(
      res => {
        this.initLoading = false;
        if (res.code === ApiResultType.Success) {
          this.msg.success('操作完成！');
          this.initLoading = true;
          this.getData();
        }
      },
      err => {
        this.initLoading = false;
      },
    );
  }
}
