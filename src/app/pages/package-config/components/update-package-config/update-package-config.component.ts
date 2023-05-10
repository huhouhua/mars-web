import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { BackendService } from 'src/app/pages/services/backend.service';
import { ApiResult, ApiResultType, Member, MemberRole, Option } from 'src/app/shared/common.type';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-package-config-update.component',
  templateUrl: './update-package-config.component.html',
  styleUrls: ['./update-package-config.component.less'],
})
export class UpdatePackageConfigComponent implements OnInit {
  validateForm!: FormGroup;
  @Input() packageConfig:any;

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
    this.validateForm.patchValue(this.packageConfig);
  }
  
  get data():any{
    return this.validateForm.value;
  }


  onCancel() {
    this.modal.triggerCancel();
  }
  submitForm() {
    this.loading = true;
    this.backendService.updatePackageConfig<ApiResult>(this.packageConfig.id,this.data).subscribe(res=>{
      this.loading = false;
      if (res.status === ApiResultType.Success) {
        this.notification.success('提示',"修改成功！");
        this.modal.triggerOk();
      }
    },err=>{
      this.loading = false;
    });
  }
}
