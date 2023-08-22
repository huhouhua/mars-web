import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { BackendService } from 'src/app/pages/services/backend.service';
import { ApiResult, ApiResultType, Member, MemberRole, Option } from 'src/app/shared/common.type';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-edit.component',
  templateUrl: './edit-app.component.html',
  styleUrls: ['./edit-app.component.less'],
})
export class EditAppComponent implements OnInit {
    applicationId:string='';
  validateForm!: FormGroup;
  loading:boolean =false;
  constructor( 
    private backendService: BackendService,
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private modal: NzModalRef) {

    }
  ngOnInit(): void {
    const group = {
      name: ['',Validators.required],
      description: [''],
    };
    this.loadApp();
    this.validateForm = this.fb.group(group);
  }

  public loadApp(){
    this.loading = true;
    this.backendService.getApplication<ApiResult>(this.applicationId).subscribe(res=>{
      this.loading = false;
      if (res.code === ApiResultType.Success) {
        let model = res.data.application_view_models;
        this.validateForm.patchValue(model);
      }
    },err=>{
      this.loading = false;
    });
  }

  onCancel() {
    this.modal.triggerCancel();
  }
  submitForm() {
    this.loading = true;
    this.backendService.updateApplication<ApiResult>(this.applicationId, this.validateForm.value).subscribe(res=>{
      this.loading = false;
      if (res.code === ApiResultType.Success) {
        this.notification.success('提示',"修改成功!");
        this.modal.triggerOk();
      }
    },err=>{
      this.loading = false;
    });
  }
}
