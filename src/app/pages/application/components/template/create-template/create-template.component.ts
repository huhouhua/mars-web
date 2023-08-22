import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { BackendService } from 'src/app/pages/services/backend.service';
import { ApiResult, ApiResultType, Member, MemberRole, Option } from 'src/app/shared/common.type';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-create-template',
  templateUrl: './create-template.component.html',
  styleUrls: ['./create-template.component.less'],
})
export class CreateTemplateComponent implements OnInit {
  @Input() applicationId: string ='';

  validateForm!: FormGroup;
  loading:boolean =false;
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
      web_hook:[''],
      description: [''],
    };
    this.validateForm = this.fb.group(group);
  }
  
  get data():any{
      const d = this.validateForm.value;
      d.app_id = this.applicationId;
      return d;
  }
  onCancel() {
    this.modal.triggerCancel();
  }
  submitForm() {
    console.log(this.data);

    this.loading = true;
    this.backendService.createTemplate<ApiResult>(this.data).subscribe(res=>{
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
