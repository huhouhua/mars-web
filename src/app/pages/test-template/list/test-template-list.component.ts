import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { zip as _zip, Subscription } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BackendService } from '../../services/backend.service';
import { ApiResult, ApiResultType, Option } from 'src/app/shared/common.type';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FormBuilder } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UserService } from 'src/app/helpers/user.service';
import { CreateTestTemplateComponent } from '../components/template-selected/create-template/create-template.component';
import { TestTemplateSelectedComponent } from '../components/template-selected/template-selected.component';
@Component({
  selector: 'app-test-template-list',
  templateUrl: './test-template-list.component.html',
  styleUrls: ['./test-template-list.component.less'],
})
export class TestTemplateListComponent implements OnInit {
  public loadData: boolean = false;
  public loading: boolean = false;
  public total = 0;
  public cacheQueryObject: any = {
    pageSize: 12,
    pageIndex: 1,
    categorys:[] =[0],
    types:[]=[0],
    name: '',
  };
  public listData: any = {
    pageCount: Number,
    pageIndex: Number,
    pageSize: Number,
    testTemplateViewModels:[],
    totalItemCount: Number,
  };
  constructor(
    private fb: FormBuilder,
    private modal: NzModalService,
    private backendService: BackendService,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    private notification: NzNotificationService,
  ) {}
  ngOnInit(): void {
    this.refreshData();
  }

  public refreshData() {
    this.loading = true;

    this.backendService
      .getTestTemplatePagedList<ApiResult>(this.cacheQueryObject)
      .subscribe(
        (res) => {
          if (res.status === ApiResultType.Success) {
            this.listData = res.data;
            this.total = this.listData.totalItemCount;
          }
          this.loading = false;
          this.changeDetector.detectChanges();
        },
        (err) => {
          this.loading = false;
        }
      );
  }

  public pageIndexChange(pageIndex: number) {
    this.cacheQueryObject.pageIndex = pageIndex;
    this.refreshData();
  }

  public categoryParameterClick(category:number,checked:boolean){
      if(checked){
        this.cacheQueryObject.categorys.push(category);
      }else{
        const index = (this.cacheQueryObject.categorys as []).findIndex(q=>q == category);
        this.cacheQueryObject.categorys.splice(index,1);
      }
      this.refreshData();
  }
  public typeParameterClick(type:number,checked:boolean){
    if(checked){
      this.cacheQueryObject.types.push(type);
    }else{
      const index = (this.cacheQueryObject.types as []).findIndex(q=>q == type);
      this.cacheQueryObject.types.splice(index,1);
    }
    this.refreshData();
}

public removeClick(id:string,event:any){
  event.stopPropagation();
  this.loading = true;
  this.backendService.deleteTestTemplate<ApiResult>(id)
    .subscribe(
      (res) => {
        if (res.status === ApiResultType.Success) {
          this.notification.success('提示',"删除成功!");
          this.refreshData();
        }
        this.loading = false;
      },
      (err) => {
        this.loading = false;
      }
    );
}
  /**
   * 跳转到详情
   * @param template 模板信息
   */
  public navigateDetail(template: any,event:any) {
    this.router.navigateByUrl(
      `/test-template/list/unit-test-detail/${template.id}`
    );
  }

  public openCreateTemplateClick(e: any) {
    this.modal.create({
        nzTitle:'',
        nzWidth:600,
        nzClosable:false,
        nzCancelText:null,
        nzContent:TestTemplateSelectedComponent,
        nzOnOk:(ret)=>{
            this.refreshData();
        },
      });
  }
}
