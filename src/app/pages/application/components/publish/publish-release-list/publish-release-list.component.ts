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

  import { NzNotificationService } from 'ng-zorro-antd/notification';
  import { poll } from 'poll';
  import { UserService } from 'src/app/helpers/user.service';
  import { AccountService } from 'src/app/helpers/account.service';
import { NgEventBus } from 'ng-event-bus';
  @Component({
    selector: 'app-publish-release-list',
    templateUrl: './publish-release-list.component.html',
    styleUrls: ['./publish-release-list.component.less'],
  })
  export class  PublishReleaseListComponent implements OnInit {
    @Output() onBuildLog: EventEmitter<object> = new EventEmitter<object>();
    @Output() onShowBuildLog: EventEmitter<object> = new EventEmitter<object>();
    @Input() set loadData(isloadData: boolean) {
      if (isloadData) {
        // this.refreshData();
        this.refreshData();
      }
    }
   @Input() applicationId:string ='';
    public name: string = '';
    public loading: boolean = false;
    public total = 0;
    private timeout: NodeJS.Timeout | undefined;
    public buildLogId: string | undefined;
    private pollDelaySecond = 10 * 1000;
    public listData: any = {};
    public cacheQueryObject: any = {
      page_size: 10,
      page_index: 1,
      name: '',
    };
    constructor(
      private fb: FormBuilder,
      private modal: NzModalService,
      private backendService: BackendService,
      private notification: NzNotificationService,
      private router: Router,
      private userService: UserService,
      private eventBus: NgEventBus,
      private accountService:AccountService,
      private changeDetector: ChangeDetectorRef
      
    ) {}
  
     ngOnInit(): void {
      // this.refreshData();
      // this.onLoad();

      this.loadList();
      this.eventBus.on("publish-version").subscribe(()=>{
         this.refreshData();
      });
    }
  
    ngOnDestroy() {
      clearInterval(this.timeout);
    }

    public refreshData(){
       this.loadList();
    }
    public loadList(){
      this.loading = true;
      this.backendService
        .getPublishHistoryPageList<ApiResult>(this.applicationId, this.cacheQueryObject)
        .subscribe(
          (res) => {
            if (res.code === ApiResultType.Success) {
              this.listData = res.data;
              this.total = res.data.totalItemCount;
            }
            this.loading = false;
            this.changeDetector.detectChanges();
          },
          (err) => {
            this.loading = false;
          }
        );
    }

    /**
     * 用户 id 转换 用户名字
     * @param id
     * @returns str
     */
    getNameFunc(id: number): string {
      return this.userService.getNameFunc(id);
    }
    // public async clickSearch() {
    //   await this.refreshData();
    // }
  
    // public async refreshData() {
    //   await this.request();
    // }
    // public async request(): Promise<void> {
    //   try {
    //     const url = `api/v1/app-releases?name=${this.cacheQueryObject.name}
    //   &pageSize=${this.cacheQueryObject.pageSize}&pageIndex=${this.cacheQueryObject.pageIndex}`;
    //     const response = (await Promise.race([
    //       fetch(url,
    //         {
    //           method: 'GET',
    //           headers: {
    //             Authorization: `Bearer ${this.accountService.userValue?.token}`
    //           },
    //         }),
    //       new Promise(function (resolve, reject) {
    //         setTimeout(() => reject(new Error('request timeout')), 5 * 5000);
    //       })
    //     ])) as any;
    //     const result = await response.json();
    //     if (result.code === ApiResultType.Success) {
    //       this.listData = result.data;
    //       this.total = result.data.totalItemCount;
    //     }
    //   } catch (err:any) {
    //     console.log(err);
    //   }
    // }
  

    // public onLoad() {
    //   this.timeout = setInterval(async () => {
    //     await this.refreshData();
    //   }, this.pollDelaySecond);
    // }
  
    public async pageSizeChange(pageSize: number) {
      this.cacheQueryObject.page_size = pageSize;
       this.refreshData();
    }
    public async pageIndexChange(pageIndex: number) {
      this.cacheQueryObject.page_index = pageIndex;
       this.refreshData();
    }
    // private async onloadData() {
    //   clearInterval(this.timeout); // 先关闭定时器
    //   // 后面的代码可以确保没有请求在执行了
    //   await this.refreshData(); // 再请求数据
    //   await delay(5 * 1000); // 因为 clearInterval 会立刻执行异步任务，所以延时 3 秒再重新启动定时器。不要浪费请求...
    //   this.onLoad();
    // }
    public hadnlerStatusColor(status: string): string {
      switch (status) {
        case 'fail':
          return 'error';
        case 'publishing':
          return 'processing';
        case 'success':
          return 'success';
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
      //   if (res.code === ApiResultType.Success) {
      //     this.notification.success('提示',"删除成功！");
      //      this.refreshData();
      //   }
      // },err=>{
      //   this.loading = false;
      // });
    }
  }
  