import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { BackendService } from 'src/app/pages/services/backend.service';
import { NzDrawerOptions, NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PrviewConfigComponent } from '../../../prview-config/prview-config.component';
import { ApiResult, ApiResultType } from 'src/app/shared/common.type';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserService } from 'src/app/helpers/user.service';
import { dateFormat } from 'src/app/shared/util/util';
// import { UserService } from '@services/user/user-service';
@Component({
  selector: 'app-service-config-list',
  templateUrl: './service-config-list.component.html',
  styleUrls: ['./service-config-list.component.less'],
})
export class ServiceConfigList implements OnInit {
    @Input() templateId:string ='';
    loading: boolean = false;
    public listData: any[] =[];

    constructor(
        private router: Router,
        private msg: NzMessageService,
        private modal:NzModalService,
        private userService: UserService,
        private backendService: BackendService,
      ) // private userService: UserService,
      {}
    ngOnInit(): void {
        
        this.loadlist();
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
    public loadlist(){
        this.loading = true;
        this.backendService.getAppTemplateServiceList<ApiResult>(this.templateId).subscribe(res => {
          this.loading = false;
          if (res.code === ApiResultType.Success) {
            let list = res.data.application_service_view_model

            this.listData = list == null ? [] : list;
          }
        });

    }
    public openService(){
        this.router.navigateByUrl(`/app/detail/template/new/${this.templateId}/service`);
    }

    public openEdit(item:any){
      this.router.navigateByUrl(`/app/detail/template/edit/${this.templateId}/service?service_id=${item.id}`);
    }

    public remove(item:any){
      this.loading = true;
      this.backendService.deleteAppTemplateService<ApiResult>(item.id).subscribe(
        res => {
          this.loading = false;
          if (res.code === ApiResultType.Success) {
            this.msg.success('操作成功');
            this.loading = true;
            this.loadlist();
          }
        },
        err => {
          this.loading = false;
        },
      );
    }
}