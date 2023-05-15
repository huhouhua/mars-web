import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { zip as _zip, Subscription } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BackendService } from '../../services/backend.service';
import { ApiResult, ApiResultType, Option } from 'src/app/shared/common.type';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FormBuilder } from '@angular/forms';
import { CreatePackageConfigComponent } from '../components/create-package-config/create-package-config.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UpdatePackageConfigComponent } from '../components/update-package-config/update-package-config.component';
@Component({
  selector: 'app-package-config-list',
  templateUrl: './package-config-list.component.html',
  styleUrls: ['./package-config-list.component.less'],
})
export class PackageConfiglistComponent implements OnInit {
  public loadData: boolean = false;
  public loading: boolean = false;
  public total = 0;
  public cacheQueryObject: any = {
    pageSize: 10,
    pageIndex: 1,
    name: '',
  };
  public listData: any = {
    pageCount: Number,
    pageIndex: Number,
    pageSize: Number,
    totalItemCount: Number,
  };

  constructor(
    private fb: FormBuilder,
    private modal: NzModalService,
    private backendService: BackendService,
    private notification: NzNotificationService,
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.refreshData();
  }

  public clickSearch() {
    this.refreshData();
  }
  public refreshData() {
    this.loading = true;
    this.backendService
      .getPackageConfigList<ApiResult>(this.cacheQueryObject)
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

  public pageSizeChange(pageSize: number) {
    this.cacheQueryObject.pageSize = pageSize;
    this.refreshData();
  }
  public pageIndexChange(pageIndex: number) {
    this.cacheQueryObject.pageIndex = pageIndex;
    this.refreshData();
  }

  public config(config: any):void {
    this.router.navigateByUrl(`/package-config-list/detail/config/${config.id}`);
  }

  public edit(config: any) {
    this.modal.create({
      nzTitle: '编辑配置项',
      nzWidth: 750,
      nzComponentParams: {
        packageConfig: config,
      },
      nzContent: UpdatePackageConfigComponent,
      nzOnOk: (ret) => {
        this.refreshData();
      },
    });
  }

  public remove(config: any) {
    this.loading = true;
    this.backendService.deletePackageConfig<ApiResult>(config.id).subscribe(
      (res) => {
        this.loading = false;
        if (res.status === ApiResultType.Success) {
          this.notification.success('提示', '删除成功！');
          this.refreshData();
        }
      },
      (err) => {
        this.loading = false;
      }
    );
  }

  public openCreatePackageConfigModal() {
    this.modal.create({
      nzTitle: '新建配置项',
      nzWidth: 750,
      nzContent: CreatePackageConfigComponent,
      nzOnOk: (ret) => {
        this.refreshData();
      },
    });
  }
}
