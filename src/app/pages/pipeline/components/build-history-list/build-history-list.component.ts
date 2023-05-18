import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

import { zip as _zip, Subscription, delay } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

import { ApiResult, ApiResultType, Option } from 'src/app/shared/common.type';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FormBuilder } from '@angular/forms';
import { BackendService } from 'src/app/pages/services/backend.service';
import { CreateBuildComponent } from '../create-build/create-build.component';
import { BuildComponent } from '../build/build.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { poll } from 'poll';
import { UserService } from 'src/app/helpers/user-service';
import { AccountService } from 'src/app/helpers/account.service';
@Component({
  selector: 'app-build-history-list',
  templateUrl: './build-history-list.component.html',
  styleUrls: ['./build-history-list.component.less'],
})
export class BuildHistorylistComponent implements OnInit {
  @Output() onBuildLog: EventEmitter<object> = new EventEmitter<object>();
  @Output() onShowBuildLog: EventEmitter<object> = new EventEmitter<object>();
  @Input() set loadData(isloadData: boolean) {
    if (isloadData) {
      this.refreshData();
    }
  }

  public name: string = '';
  public loading: boolean = false;
  public total = 0;
  private timeout: NodeJS.Timeout | undefined;
  public buildLogId: string | undefined;
  private pollDelaySecond = 10 * 1000;
  public listData: any = {};
  public cacheQueryObject: any = {
    pageSize: 10,
    pageIndex: 1,
    name: '',
  };
  constructor(
    private fb: FormBuilder,
    private modal: NzModalService,
    private backendService: BackendService,
    private notification: NzNotificationService,
    private router: Router,
    private userService: UserService,
    private accountService:AccountService,
    private changeDetector: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.refreshData();
    this.onLoad();
  }

  ngOnDestroy() {
    clearInterval(this.timeout);
  }
  /**
   * 用户 id 转换 用户名字
   * @param id
   * @returns str
   */
  getNameFunc(id: number): string {
    return this.userService.getNameFunc(id);
  }
  public async clickSearch() {
    await this.refreshData();
  }

  public async refreshData() {
    await this.request();
  }
  public async request(): Promise<void> {
    try {
      const url = `api/v1/buildHistory/list?name=${this.cacheQueryObject.name}
    &pageSize=${this.cacheQueryObject.pageSize}&pageIndex=${this.cacheQueryObject.pageIndex}`;

      const response = (await Promise.race([
        fetch(url,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${this.accountService.userValue?.token}`
            },
          }),
        new Promise(function (resolve, reject) {
          setTimeout(() => reject(new Error('request timeout')), 5 * 5000);
        })
      ])) as any;
      const result = await response.json();
      if (result.status === ApiResultType.Success) {
        this.listData = result.data;
        this.total = result.data.totalItemCount;
      }
    } catch (err:any) {
      console.log(err);
    }
  }

  public onLoad() {
    this.timeout = setInterval(async () => {
      await this.refreshData();
    }, this.pollDelaySecond);
  }

  public async pageSizeChange(pageSize: number) {
    this.cacheQueryObject.pageSize = pageSize;
    await this.onloadData();
  }
  public async pageIndexChange(pageIndex: number) {
    this.cacheQueryObject.pageIndex = pageIndex;
    await this.onloadData();
  }
  private async onloadData() {
    clearInterval(this.timeout); // 先关闭定时器
    // 后面的代码可以确保没有请求在执行了
    await this.refreshData(); // 再请求数据
    await delay(5 * 1000); // 因为 clearInterval 会立刻执行异步任务，所以延时 3 秒再重新启动定时器。不要浪费请求...
    this.onLoad();
  }
  public hadnlerStatusColor(status: number): string {
    switch (status) {
      case 0:
        return '#ccc';
      case 1:
        return '#2db7f5';
      case 2:
        return '#f50';
      case 3:
        return '#108ee9';
      case 4:
        return '#87d068';
      default:
        return '';
    }
  }

  public showBuildLog(history: any) {
    this.buildLogId = history.id;
    this.onShowBuildLog.emit(history);
  }

  public remove(trigger: any) {
    // this.loading = true;
    // this.backendService.deleteBuild<ApiResult>(trigger.id).subscribe(res=>{
    //   this.loading = false;
    //   if (res.status === ApiResultType.Success) {
    //     this.notification.success('提示',"删除成功！");
    //      this.refreshData();
    //   }
    // },err=>{
    //   this.loading = false;
    // });
  }
}
