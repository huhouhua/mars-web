import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { BackendService } from 'src/app/pages/services/backend.service';
import { ApiResult, ApiResultType, Member, MemberRole, Option } from 'src/app/shared/common.type';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-create.component',
  templateUrl: './create-app.component.html',
  styleUrls: ['./create-app.component.less'],
})
export class CreateAppComponent implements OnInit {
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
    this.validateForm = this.fb.group(group);
  }

  onCancel() {
    this.modal.triggerCancel();
  }
  submitForm() {
    this.loading = true;
    this.backendService.createApplication<ApiResult>(this.validateForm.value).subscribe(res=>{
      this.loading = false;
      if (res.code === ApiResultType.Success) {
        this.notification.success('提示',"创建成功!");
        this.modal.triggerOk();
      }
    },err=>{
      this.loading = false;
    });
  }
}
