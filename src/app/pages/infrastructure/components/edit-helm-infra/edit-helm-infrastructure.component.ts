import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { BackendService } from 'src/app/pages/services/backend.service';
import { ApiResult, ApiResultType, Member, MemberRole, Option, OptionAny } from 'src/app/shared/common.type';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { assign } from 'lodash-es';

@Component({
  selector: 'app-helm-infrastructure-edit.component',
  templateUrl: './edit-helm-infrastructure.component.html',
  styleUrls: ['./edit-helm-infrastructure.component.less'],
})
export class EditHelmInfrastructureComponent implements OnInit {
  validateForm!: FormGroup;
  loading:boolean =false;
  passwordVisible:boolean =false;
  environmentId:string='';
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
      repoName:new FormControl({
         value:'',
         disabled:true
      }),
      repoUrl: ['',Validators.required],
      repoUsername: [''],
      repoPassword: [''],
      insecure_skip_tls_verify: [true],
      description: [''],
      status: ["running",Validators.required]
    };
    this.loadInfra();
    this.validateForm = this.fb.group(group);
  }
  
  public loadInfra(){
    this.loading = true;
    this.backendService.getInfrastructure<ApiResult>(this.environmentId).subscribe(res=>{
      this.loading = false;
      if (res.code === ApiResultType.Success) {
        let model = res.data.infrastructure_view_model;
        this.parseMetaDataOfValue(model,model.config_provider)
        this.validateForm.patchValue(model);
      }
    },err=>{
      this.loading = false;
    });
    
  }

  public parseMetaDataOfValue(model:any, str:string){
    let  obj =JSON.parse(str)
    model.repoName =obj.name;
    model.repoUrl = obj.url;
    model.repoUsername =obj.username;
    model.repoPassword =obj.password;
    model.insecure_skip_tls_verify=obj.insecure_skip_tls_verify;
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
    this.backendService.updateInfrastructure<ApiResult>(this.environmentId, this.data).subscribe(res=>{
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
