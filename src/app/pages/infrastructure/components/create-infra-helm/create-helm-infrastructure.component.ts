import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { BackendService } from 'src/app/pages/services/backend.service';
import { ApiResult, ApiResultType, Member, MemberRole, Option, OptionAny } from 'src/app/shared/common.type';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-helm-infrastructure-create.component',
  templateUrl: './create-helm-infrastructure.component.html',
  styleUrls: ['./create-helm-infrastructure.component.less'],
})
export class CreateHelmInfrastructureComponent implements OnInit {
  validateForm!: FormGroup;
  loading:boolean =false;
  public status: OptionAny[] = [
    {
      value: 'running',
      name: '运行中',
    },
    {
        value: 'maintained',
        name: '维护中',
      },
      {
        value: 'malfunction',
        name: '故障中',
      },
  ];
  constructor( 
    private backendService: BackendService,
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private modal: NzModalRef) {

    }
  ngOnInit(): void {
    const group = {
      name: ['',Validators.required],
      repoName: ['',Validators.required],
      repoUrl: ['',Validators.required],
      repoUsername: [''],
      repoPassword: [''],
      insecure_skip_tls_verify: ["true"],
      description: [''],
      status: ["running",Validators.required],
      type: ["helm"],
    };
    this.validateForm = this.fb.group(group);
  }
  
  public getMetaData():any{
    let value= this.validateForm.value;
    let metadata = {
      name:value.repoName,
      url:value.repoUrl,
      username:value.repoUsername,
      password:value.repoPassword,
      insecure_skip_tls_verify:value.insecure_skip_tls_verify,
    }
    return metadata
  }
  get data():any{
    let v= this.validateForm.value;
    v.meta_data= JSON.stringify(this.getMetaData())
    return v
  }
  onCancel() {
    this.modal.triggerCancel();
  }
  submitForm() {
    this.loading = true;
    this.backendService.createInfrastructure<ApiResult>(this.data).subscribe(res=>{
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
