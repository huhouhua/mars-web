import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { BackendService } from 'src/app/pages/services/backend.service';
import { ApiResult, ApiResultType, Member, MemberRole, Option } from 'src/app/shared/common.type';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-product-version-create',
  templateUrl: './create-version.component.html',
  styleUrls: ['./create-version.component.less'],
})
export class CreateProductVersionComponent implements OnInit {
  @Input()  productId:string ='';
  validateForm!: FormGroup;
  loading:boolean =false;
  transferTitles: string[] = ['人员列表', '产品组成员'];
  typeOptions: Option[] = [
    { name: '主版本号', value: 1 },
    { name: '次版本号', value: 2 },
    { name: '修订号', value: 3 },
    { name: '自定义', value: 4 },
  ];
  branchOptions: Option[] = [
    { name: '主分支', value: 1 },
    { name: '某某现场客户1', value: 2 },
    { name: '某某现场客户2', value: 3 },
    { name: '某某现场客户3', value: 4 },
  ];
  

  allMembers:Member[]=[]
  constructor( 
    private backendService: BackendService,
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private modal: NzModalRef) {

    }
  ngOnInit(): void {

    const group = {
      version: ['',Validators.required],
      upgradeType:[1,Validators.required],
      branchVersion: [1,Validators.required],
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
      const upgradeType = this.typeOptions.find(
        (q) => q.value == this.validateForm.get('upgradeType')?.value
      );
      if (upgradeType != undefined) {
        d.productType = upgradeType.value;
      }

      const branch = this.branchOptions.find(
        (q) => q.value == this.validateForm.get('branchVersion')?.value
      );
      if (branch != undefined) {
        d.branchVersion = branch.value;
      }
      d.productId = this.productId;
      d.code = d.version;
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
    this.backendService.createProductVersion<ApiResult>(this.data).subscribe(res=>{
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
