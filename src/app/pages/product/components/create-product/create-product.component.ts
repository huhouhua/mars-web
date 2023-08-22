import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { BackendService } from 'src/app/pages/services/backend.service';
import { ApiResult, ApiResultType, Member, MemberRole, Option } from 'src/app/shared/common.type';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-product-create',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.less'],
})
export class CreateProductComponent implements OnInit {
  validateForm!: FormGroup;
  loading:boolean =false;
  transferTitles: string[] = ['人员列表', '产品组成员'];
  typeOptions: Option[] = [
    { name: '产品级', value: 1 },
    { name: '组件级', value: 2 },
    { name: '外部依赖', value: 3 },
  ];
  public memberRoles:MemberRole[]=[
    {value:1,displayName:"产品负责人"},
    {value:2,displayName:"研发负责人"},
    {value:3,displayName:"测试负责人"},
    {value:4,displayName:"普通成员"},
    {value:5,displayName:"访客"},
  ]
  allMembers:Member[]=[]
  constructor( 
    private backendService: BackendService,
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private modal: NzModalRef) {

    }


  ngOnInit(): void {

    const group = {
      name: ['',Validators.required],
      code:['',Validators.required],
      productType: [1,Validators.required],
      description: [''],
    };
    this.validateForm = this.fb.group(group);
  }
  
  select(ret:{}):void{
    this.displayValid();
  }
  change(ret: {}):void{
    this.displayValid();
  }
  get data():any{
      const d = this.validateForm.value;
      const productType = this.typeOptions.find(
        (q) => q.value == this.validateForm.get('productType')?.value
      );
      if (productType != undefined) {
        d.productType = productType.value;
      }
      return d;
  }


  displayValid(){
    
  }

  searchChange(e:any){

  }
  roleSelect(e:any){

  }

  onCancel() {
    this.modal.triggerCancel();
  }
  submitForm() {
    console.log(this.data);
    this.loading = true;
    this.backendService.createProduct<ApiResult>(this.data).subscribe(res=>{
      this.loading = false;
      if (res.code === ApiResultType.Success) {
        this.notification.success('提示',"创建成功");
        this.modal.triggerOk();
      }
    },err=>{
      this.loading = false;
    });
  }
}
