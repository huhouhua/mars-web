import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BackendService } from 'src/app/pages/services/backend.service';
import { ApiResult, ApiResultType, Option } from 'src/app/shared/common.type';
import { CreateProductVersionComponent } from '../create-version/create-version.component';

@Component({
  selector: 'app-version-list',
  templateUrl: './version-list.component.html',
  styleUrls: ['./version-list.component.less'],
})

export class VersionListComponent implements OnInit {
    public loading: boolean = false;
    public productId: string ='';

    typeOptions: Option[] = [
        { name: '主版本号', value: 1 },
        { name: '次版本号', value: 2 },
        { name: '修订号', value: 3 },
        { name: '自定义', value: 4 },
      ];

      status: Option[] = [
        { name: '研发中', value: 0 },
        { name: '已发布', value: 1 },
        { name: '发布失败', value: 2 },
        { name: '已作废', value: 3 },
      ];

      branchOptions: Option[] = [
        { name: '主分支', value: 1 },
        { name: '某某现场客户1', value: 2 },
        { name: '某某现场客户2', value: 3 },
        { name: '某某现场客户3', value: 4 },
      ];


      listOfData: any={
 
      };
    queryObject: any = {
        pageSize: 10,
        pageIndex: 1,
        name: '',
        productType: null,
      };

    constructor( 
        private backendService: BackendService,
        private activeRouter: ActivatedRoute,
        private modal:NzModalService) {}


    ngOnInit(): void {
        this.productId = this.activeRouter.snapshot.paramMap.get('productId') ?? '';
        this.refreshData();
    }

    public refreshData(){
        this.loading = true;
        this.backendService.productVersionList<ApiResult>({
            pageIndex: this.queryObject.pageIndex,
            pageSize: this.queryObject.pageSize,
            productId: this.productId,
          })
          .subscribe(res => {
            this.loading = false;
            this.listOfData = res.data;
            console.log(this.listOfData);
          },err=>{
            this.loading =false;
          });
        }

        public edit(version:any){

        }
        public detail(version:any){

        }
        public published(version:any){

        }

        public remove(version:any){

        }

        public hadnlerVersionStatus(status:number):string{
            return this.status.find(q=>q.value == status)?.name ?? '';
        }
        public hadnlerbranch(branch:number):string{
            return this.branchOptions.find(q=>q.value == branch)?.name ?? '';
        }
        public hadnlerUpgradeType(branch:number):string{
            return this.typeOptions.find(q=>q.value == branch)?.name ?? '';
        }



        public hadnlerVersionStatusColor(status:number): string {
            switch (status) {
              case 0:
                return '#2db7f5';
              case 1:
                return '#87d068';
              case 2:
                return '#ccc';
                case 3:
                 return '#108ee9';
              default:
                return '';
            }
          }
          
        public openCreateProductVersionModal(){

            this.modal.create({
                nzTitle:'新增版本',
                nzWidth:1000,
                nzComponentParams:{
                    productId: this.productId,
                },
                nzContent:CreateProductVersionComponent,
                nzOnOk:(ret)=>{
                    this.refreshData();
                },
        })
        }
}