import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { zip as _zip, Subscription } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BackendService } from '../../services/backend.service';
import { ApiResult, ApiResultType, Option } from 'src/app/shared/common.type';
import { UserService } from 'src/app/helpers/user.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CreateAppComponent } from '../components/app/create-app/create-app.component';
import { EditAppComponent } from '../components/app/edit-app/edit-app.component';
import { removeBodyStyle } from 'src/app/shared/help';
// import { UserService } from '@user/user-service';

@Component({
  selector: 'app-app-list',
  templateUrl: './app-list.component.html',
  styleUrls: ['./app-list.component.less'],
})

export class ApplistComponent implements OnInit {
  public colorList = ['#f56a00', '#1890ff', '#7265e6', '#ffbf00', '#00a2ae', '#00a2ae'];
  public apps: any[] = [];
  public loading = true;
  public query:Query ={
    page_size: 9999,
    name: ''
  };

  public inputValue: string = '@afc163';
  public suggestions = ['afc163', 'benjycui', 'yiminghe', 'RaoHai', '中文', 'にほんご'];

  constructor(
    public msg: NzMessageService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private modal: NzModalService,
    private userService: UserService,
    private backendService: BackendService,
    private activatedRoute: ActivatedRoute,
  )
  {
    removeBodyStyle();
  }

  async ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    this.loading = true;
    this.backendService.applicationList<ApiResult>(this.query).subscribe(res => {
      this.loading = false;
      if (res.code === ApiResultType.Success) {
        this.apps = res.data.application_view_models;
      }
    });
  }
   /**
   * 用户 id 转换 用户名字
   * @param id
   * @returns str
   */
   getNameFunc(id:number): string {
    return this.userService.getNameFunc(id);
  }

  goApp(id:string) {
    this.router.navigateByUrl(`/app/detail/${id}`);
  }

  search() {
    this.refreshData();
  }

  public openCreateAppModal() {
    this.modal.create({
      nzTitle: '新建应用',
      nzWidth: 750,
      nzContent: CreateAppComponent,
      nzOnOk: (ret) => {
        this.refreshData();
      },
    });
  }

  public openEditModal(app: any) {
    console.log(app);
    this.modal.create({
      nzTitle: '编辑应用',
      nzWidth: 750,
      nzComponentParams: {
        applicationId: app.id,
      },
      nzContent: EditAppComponent,
      nzOnOk: (ret) => {
        this.refreshData();
      },
    });
  }

}
class Query{
  page_size:number =9999;
  name:string = '';
}