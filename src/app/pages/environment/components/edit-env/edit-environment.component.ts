import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { BackendService } from 'src/app/pages/services/backend.service';
import { ApiResult, ApiResultType, Member, MemberRole, Option, OptionAny } from 'src/app/shared/common.type';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-environment-edit.component',
  templateUrl: './edit-environment.component.html',
  styleUrls: ['./edit-environment.component.less'],
})
export class EditEnvironmentComponent implements OnInit {
  validateForm!: FormGroup;
  loading:boolean =false;
  environmentId:string='';
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
    this.loadEnv();
    this.validateForm = this.fb.group(group);
  }
  
  public loadEnv(){
    this.loading = true;
    this.backendService.getEnvironment<ApiResult>(this.environmentId).subscribe(res=>{
      this.loading = false;
      if (res.code === ApiResultType.Success) {
        let model = res.data.environment_view_model;
        this.parseMetaDataOfValue(model,model.config_provider)
        this.validateForm.patchValue(model);
      }
    },err=>{
      this.loading = false;
    });
    
  }

  public parseMetaDataOfValue(model:any, str:string){
    let  obj =JSON.parse(str)
    model.kubeConfig = obj.kube_config;

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
    this.backendService.updateEnvironment<ApiResult>(this.environmentId, this.data).subscribe(res=>{
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
