import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { BackendService } from 'src/app/pages/services/backend.service';
import { ApiResult, ApiResultType, Member, MemberRole, Option, OptionAny } from 'src/app/shared/common.type';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-environment-create.component',
  templateUrl: './create-environment.component.html',
  styleUrls: ['./create-environment.component.less'],
})
export class CreateEnvironmentComponent implements OnInit {
  validateForm!: FormGroup;
  loading:boolean =false;

  public typeList: Option[] = [
    {
      value: 0,
      name: 'kubernetes',
    },
  ];
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
      kubeConfig: ['',Validators.required],
      description: [''],
      runtime: ["kubernetes",Validators.required],
      status: ["running",Validators.required],
    };
    this.validateForm = this.fb.group(group);
  }
  
  public getMetaData():any{
    let v= this.validateForm.value;
    let metadata = {
        kube_config:v.kubeConfig,
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
    this.backendService.createEnvironment<ApiResult>(this.data).subscribe(res=>{
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
