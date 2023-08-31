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
import { EditEnvironmentComponent } from '../components/edit-env/edit-environment.component';
import { CreateEnvironmentComponent } from '../components/create-env/create-environment.component';
import { dateFormat } from 'src/app/shared/util/util';
@Component({
  selector: 'app-environment-list',
  templateUrl: './environment-list.component.html',
  styleUrls: ['./environment-list.component.less'],
})
export class EnvironmentlistComponent implements OnInit {
  public loadData: boolean = false;
  public loading: boolean = false;
  public total = 0;
  public cacheQueryObject: any = {
    page_size: 10,
    page_index: 1,
    name: '',
  };
  public listData: any = {
    page_count: Number,
    page_index: Number,
    page_size: Number,
    total_item_count: Number,
  };

  constructor(
    private fb: FormBuilder,
    private modal: NzModalService,
    private backendService: BackendService,
    private notification: NzNotificationService,
    private router: Router,
    private userService: UserService,
    private changeDetector: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.refreshData();
  }

  /**
   * 用户 id 转换 用户名字
   * @param id
   * @returns str
   */
  getNameFunc(id: number): string {
    return this.userService.getNameFunc(id);
  }

  public clickSearch() {
    this.refreshData();
  }
  public refreshData() {
    this.loading = true;
    this.backendService
      .getEnvironmentPagedList<ApiResult>(this.cacheQueryObject)
      .subscribe(
        (res) => {
          if (res.code === ApiResultType.Success) {
            this.listData = res.data;
            this.total = this.listData.total_item_count;
          }
          this.loading = false;
          this.changeDetector.detectChanges();
        },
        (err) => {
          this.loading = false;
        }
      );
  }

  public pageSizeChange(pageSize: number) {
    this.cacheQueryObject.page_size = pageSize;
    this.refreshData();
  }
  public pageIndexChange(pageIndex: number) {
    this.cacheQueryObject.page_index = pageIndex;
    this.refreshData();
  }
  public format(dateStr:any):string{
    return dateFormat(dateStr);
  }
  public edit(env: any) {
    console.log(env);
    this.modal.create({
      nzTitle: '编辑环境',
      nzWidth: 750,
      nzComponentParams: {
        environmentId: env.id,
      },
      nzContent: EditEnvironmentComponent,
      nzOnOk: (ret) => {
        this.refreshData();
      },
    });
  }

  public remove(env: any) {
    this.loading = true;
    this.backendService.deleteEnvironment<ApiResult>(env.id).subscribe(
      (res) => {
        this.loading = false;
        if (res.code === ApiResultType.Success) {
          this.notification.success('提示', '删除成功！');
          this.refreshData();
        }
      },
      (err) => {
        this.loading = false;
      }
    );
  }

  public openCreateEnvModal() {
    this.modal.create({
      nzTitle: '新建环境',
      nzWidth: 750,
      nzContent: CreateEnvironmentComponent,
      nzOnOk: (ret) => {
        this.refreshData();
      },
    });
  }

  public statusToText(status: string): string {
    switch (status) {
      case "running":
        return 'processing';
      case "maintained":
        return 'default';
      case "malfunction":
        return 'error';
    }
    return ''
  }
}