import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { BackendService } from 'src/app/pages/services/backend.service';
import { ApiResult, ApiResultType, Member, MemberRole, Option } from 'src/app/shared/common.type';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgEventBus } from 'ng-event-bus';
import { dateFormat } from 'src/app/shared/util/util';

@Component({
  selector: 'app-create-publish',
  templateUrl: './create-publish.component.html',
  styleUrls: ['./create-publish.component.less'],
})
export class CreatePublishComponent implements OnInit {
  @Input() templateId: string ='';
  @Input() applicationId: string ='';
  validateForm!: FormGroup;
  loading:boolean =false;
  versionType:number =0;

  isEnvsDisabled :boolean = false
  envs:any[]=[]
  history:any[]=[]
  constructor( 
    private backendService: BackendService,
    private fb: FormBuilder,
    private eventBus: NgEventBus,
    private notification: NzNotificationService,
    private modal: NzModalRef) {

    }
  ngOnInit(): void {
    const group = {
        name:['',Validators.required],
        version: ['',Validators.required],
        environment_id:['',Validators.required],
        history_version_id:[''],
        type:['0'],
        description: [''],
    };
    this.validateForm = this.fb.group(group);
    this.getEnvList();
    this.getHistoryList();
    
  }
  
  public format(dateStr:any):string{
    return dateFormat(dateStr);
  }

  public getEnvList(){
    this.loading = true;
    this.backendService.getEnvironmentList<ApiResult>({
      status:"running",
    }).subscribe(res => {
       this.loading = false;
      if (res.code === ApiResultType.Success) {
        this.envs = res.data.environment_view_models;
      }
    },err=>{
      this.loading = false;
    });
}
  
public getHistoryList(){
  this.loading = true;
  this.backendService.getPublishHistoryList<ApiResult>(this.templateId, {
    status:"success",
  }).subscribe(res => {
     this.loading = false;
    if (res.code === ApiResultType.Success) {
      this.history = res.data.version_view_models;
    }
  },err=>{
    this.loading = false;
  });
}

  get data():any{
      const d = this.validateForm.value;
      d.template_id = this.templateId;
      if (d.type ==0) {
        d.history_version_id='';
      }
      if (d.type ==1) {
        d.version='';
      }
      d.app_id = this.applicationId;
      
      return d;
  }



  onCancel() {
    this.modal.triggerCancel();
  }
  submitForm() {
    console.log(this.data);

    this.loading = true;
    this.backendService.publishApp<ApiResult>(this.data).subscribe(res=>{
      this.loading = false;
      if (res.code === ApiResultType.Success) {
        this.notification.success('提示',"发布成功");
        this.modal.triggerOk();
        this.eventBus.cast("publish-version","");
      }
    },err=>{
      this.loading = false;
    });
  }

  public onSelectType(type:number){
   if(type==0){
    let history = this.validateForm.get('history_version_id')
    history?.setValidators(null)
    history?.clearAsyncValidators()
    history?.setValue('')
    this.isEnvsDisabled = false
    this.validateForm.get('version')?.setValidators(Validators.required)
    this.validateForm.get('environment_id')?.setValidators(Validators.required)
   }else{
    this.isEnvsDisabled = true
    let version = this.validateForm.get('version')
    version?.setValidators(null)
    version?.clearAsyncValidators()
    version?.setValue('')

    let environment = this.validateForm.get('environment_id')
    environment?.setValidators(null)
    environment?.clearAsyncValidators()
    environment?.setValue('')

    this.validateForm.get('history_version_id')?.setValidators(Validators.required)
    
   }
    this.versionType = type;
  }
}
