import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { BackendService } from 'src/app/pages/services/backend.service';
import { NzDrawerOptions, NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PrviewConfigComponent } from '../prview-config/prview-config.component';
import { ApiResult, ApiResultType } from 'src/app/shared/common.type';
import { NzMessageService } from 'ng-zorro-antd/message';
// import { UserService } from '@services/user/user-service';
@Component({
  selector: 'app-template-config-list',
  templateUrl: './template-config-list.component.html',
  styleUrls: ['./template-config-list.component.less'],
})
export class TemplateConfigList implements OnInit {
    @Input() templateId:string ='';
    loading: boolean = false;
    public listData: any[] =[];

    constructor(
        private router: Router,
        private msg: NzMessageService,
        private modal:NzModalService,
      
        private backendService: BackendService,
      ) // private userService: UserService,
      {}
    ngOnInit(): void {
        
        this.getTemplateConfig();
    }

    public getTemplateConfig(){
        this.loading = true;
        this.backendService.templateConfigList<ApiResult>(this.templateId).subscribe(res => {
          this.loading = false;
          if (res.status === ApiResultType.Success) {
            this.listData = res.data.templateConfigs;
          }
        });

    }
    public openTemplate(){
        this.router.navigateByUrl(`/app-list/detail/template/config/${this.templateId}/service`);
    }

    public config(item:any){

    }
    public removeTemplate(item:any){
        
    }
}