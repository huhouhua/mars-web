import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { BackendService } from 'src/app/pages/services/backend.service';
import { ApiResult, ApiResultType, Member, MemberRole, Option } from 'src/app/shared/common.type';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-edit-template',
  templateUrl: './edit-template.component.html',
  styleUrls: ['./edit-template.component.less'],
})
export class EditTemplateComponent implements OnInit {
  @Input() templateId: string ='';

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
    this.loadTemplate();
    this.validateForm = this.fb.group(group);
  }

    public loadTemplate(){
    this.loading = true;
    this.backendService.getTemplate<ApiResult>(this.templateId).subscribe(res=>{
      this.loading = false;
      if (res.code === ApiResultType.Success) {
        let model = res.data.application_template_view_model;
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
    console.log(this.validateForm.value);
    this.loading = true;
    this.backendService.updateTemplate<ApiResult>(this.templateId, this.validateForm.value).subscribe(res=>{
      this.loading = false;
      if (res.code === ApiResultType.Success) {
        this.notification.success('提示',"修改成功");
        this.modal.triggerOk();
      }
    },err=>{
      this.loading = false;
    });
  }
}
