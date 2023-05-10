import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ApiResult, ApiResultType, Option } from 'src/app/shared/common.type';
import { CreateProductComponent } from '../components/create-product/create-product.component';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.less'],
})

export class ProductListComponent implements OnInit {

public productName: string = '';
public loading: boolean = false;
public pageIndex = 1;
public pageSize = 12;
public total = 0;

  public listData: any = {
    pageCount: Number,
    pageIndex: Number,
    pageSize: Number,
    totalItemCount: Number,
  };


  constructor(private fb: FormBuilder,
    private modal:NzModalService,
    private backendService: BackendService,
    private router: Router,
    private changeDetector: ChangeDetectorRef){
    
  }
  ngOnInit(): void {
   this.refreshData();

  }


  public pageIndexChange(pageIndex:number) {
    this.pageIndex = pageIndex;
    this.refreshData();
  }


    public refreshData(){
      this.loading = true;
      const pageQueryParameter = {
        name: this.productName,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
      };
      this.backendService.productList<ApiResult>(pageQueryParameter).subscribe(
        res => {
          if (res.status === ApiResultType.Success) {
            this.listData = res.data;
            this.total = this.listData.totalItemCount;
          }
          this.loading = false;
          this.changeDetector.detectChanges();
        },
        err => {
          this.loading = false;
        },
      );
    }

    /**
   * 点击搜索
   */
    clickSearch() {
        // this.pageIndex = 1;
        // this.refreshData();
      }


    openCreateProjectModal(){

      }
  /**
   * 编辑项目
   * @param product
   */
  openEdidProjectModal(product: any) {
    const params = {
      project: product,
    };
  }

    /**
   * 跳转到详情
   * @param project 项目信息
   */
    navigateProductDetail(product: any) {
      this.router.navigateByUrl(`/app-product-list/detail/${product.id}/version/list`);
     
  }

openCreateHospitalProductModal(){
  this.modal.create({
    nzTitle:'新增产品',
    nzWidth:1000,
    nzContent:CreateProductComponent,
    nzOnOk:(ret)=>{
        this.refreshData();
      //   const item = ret?.data;
      //   item.id = this.listOfData.length+1;
      //   this.listOfData.unshift(item);
      //   this.listOfData=[...this.listOfData];

      //  this.notification.success("feedback!","add success!");
    },
  });

}

  /**
   * 删除
   * @param product
   */
  openDeleteHospitalProjectModal(product: any) {


  }


  openEdidHospitalProjectModal(product:any){

  }

  navigateProjectDetail(product:any){
    
  }
}
