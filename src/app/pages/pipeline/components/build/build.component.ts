import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BackendService } from 'src/app/pages/services/backend.service';
import { ApiResult, ApiResultType, Option } from 'src/app/shared/common.type';

@Component({
  selector: 'app-build',
  templateUrl: './build.component.html',
  styleUrls: ['./build.component.less'],
})
export class BuildComponent implements OnInit {
    public listLoading:boolean =false;
    public loading:boolean =false;
    public fromVersionlist:any[] =[]
    public toVersionList:any[] =[]
    public validateForm!: FormGroup;
    // public ngData:any={
    //     fromVersion:'',
    //     toVersion:''
    // };
    @Input() buildInfo:any;

    constructor( 
        private backendService: BackendService,
        private fb: FormBuilder,
        private notification: NzNotificationService,
        private modal: NzModalRef) {
    
        }
     ngOnInit(): void {
       const group = {
          fromVersion: ['',Validators.required],
          toVersion:['',Validators.required],
          description: [''],
         };
         
         this.validateForm = this.fb.group(group);
         this.validateForm.patchValue(this.buildInfo.parameter);
         this.getfromVersionList();
         this.gettoVersionList();
      
     }
   

     public getfromVersionList(){
        this.listLoading = true;
        this.backendService.fromVersionList<ApiResult>(this.buildInfo.platformUrl,this.buildInfo.jobName).subscribe(res => {
           this.listLoading = false;
           if (res.code === ApiResultType.Success) {
            this.fromVersionlist = res.data;
          }
        },err=>{
          this.listLoading = false;
        });
     }
     public gettoVersionList(){
        this.listLoading = true;
        this.backendService.toVersionList<ApiResult>(this.buildInfo.platformUrl,this.buildInfo.jobName).subscribe(res => {
           this.listLoading = false;
           if (res.code === ApiResultType.Success) {
            this.toVersionList = res.data;
          }
        },err=>{
          this.listLoading = false;
        });
     }
     get data():any{
        const d = this.validateForm.value;
        // const productType = this.typeOptions.find(
        //   (q) => q.value == this.validateForm.get('productType')?.value
        // );
        // if (productType != undefined) {
        //   d.productType = productType.value;
        // }
        return d;
    }
  
  onCancel() {
    this.modal.triggerCancel();
  }
  submitForm() {
    this.loading = true;
    console.log(this.buildInfo)
    this.backendService.build<ApiResult>(this.buildInfo.id,this.data).subscribe(res=>{
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