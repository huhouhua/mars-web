import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

import { zip as _zip, Subscription } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

import { ApiResult, ApiResultType, Option } from 'src/app/shared/common.type';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FormBuilder } from '@angular/forms';
import { BackendService } from 'src/app/pages/services/backend.service';
import { CreateBuildComponent } from '../create-build/create-build.component';
import { BuildComponent } from '../build/build.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-build-template-list',
  templateUrl: './build-template-list.component.html',
  styleUrls: ['./build-template-list.component.less'],
})
export class BuildTemplatelistComponent implements OnInit {
  @Output() onSelectIndex: EventEmitter<number> = new EventEmitter<number>();
  public name: string = '';
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
    this.backendService.buildList<ApiResult>(this.cacheQueryObject).subscribe(
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
  public pageSizeChange(pageSize: number) {
    this.cacheQueryObject.pageSize = pageSize;
    this.refreshData();
  }
  public build(trigger: any) {
    this.modal.create({
      nzTitle: '构建',
      nzWidth: 900,
      nzContent: BuildComponent,
      nzComponentParams: {
        buildInfo: trigger,
      },
      nzOnOk: (ret) => {
        this.onSelectIndex.emit(1);
      },
    });
  }

  public remove(trigger: any) {
    this.loading = true;
    this.backendService.deleteBuild<ApiResult>(trigger.id).subscribe(
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
  public openCreateBuildModal() {
    this.modal.create({
      nzTitle: '新建构建器',
      nzWidth: 1000,
      nzContent: CreateBuildComponent,
      nzOnOk: (ret) => {
        this.refreshData();
      },
    });
  }
}
