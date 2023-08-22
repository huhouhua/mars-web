import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BackendService } from 'src/app/pages/services/backend.service';
import { ConfigAdvancedEditComponent } from '../../../config-advanced-edit/config-advanced-edit.component';
import { MetadataService } from 'src/app/pages/services/metadata.service';
import { ApiResult, ApiResultType, Option,OptionAny } from 'src/app/shared/common.type';
import { removeBodyStyle } from 'src/app/shared/help';
@Component({
  selector: 'app-create-service-config',
  templateUrl: './create-service-config.component.html',
  styleUrls: ['./create-service-config.component.less'],
})
export class CreateServiceConfig implements OnInit {
  templateId: string = '';
  app_id:string =''
  validateForm!: FormGroup;
  public listOfControl: any[] = [];

  loading = false;
  constructor(
    private fb: FormBuilder,
    // private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private notification: NzNotificationService,
    private backendService: BackendService,
    private activeRouter: ActivatedRoute,
    private drawerService: NzDrawerService,
    private metadataService: MetadataService,

    private router: Router
  ) {
    removeBodyStyle();
  }

  public strategyList: OptionAny[] = [
    {
      value: 'recreate',
      name: 'recreate(先删除在创建)',
    },
    {
      value: 'readjust',
      name: 'readjust(先创建在删除)',
    },
    {
      value: 'failureIgnore',
      name: 'failureIgnore(创建失败忽略)',
    },
  ];
  ngOnInit() {
    this.templateId =
    this.activeRouter.snapshot.paramMap.get('templateId') ?? '';
    this.app_id = this.activeRouter.snapshot.queryParamMap.get('app_id') ?? '';
    const group = {
      name: ['', Validators.required],
      deploy_strategy: ['recreate'],
      deploy_priority: [1],
      respository: ['', Validators.required],
      version: ['', Validators.required],
      package_name:  ['', Validators.required],
      namespace:['default',Validators.required],
      mode: ['helm'],
      description: [''],
    };
    this.validateForm = this.fb.group(group);
    this.initParam();
  
  }
  public cancel() {
    this.router.navigateByUrl(
      `/app-list/detail/template/config/${this.templateId}`
    );
  }

public initParam(){
  if(this.listOfControl.length==0){
    this.addField(undefined,null)
  }
}
  public addField(e?: MouseEvent, value?: any):number {
    if (e) {
      e.preventDefault();
    }
    let id = 0;
    if (this.listOfControl.length > 0) {
      id = this.listOfControl[this.listOfControl.length - 1].controlValue.id + 1;
    }
    const control = {
      controlValue: value ? value : {},
    };
    control.controlValue.id= id;
    const index = this.listOfControl.push(control);
    const newId = `${this.listOfControl[index - 1].controlValue.id}`;

    this.validateForm.addControl(
      `${newId}_key`,
      new FormControl("")
    );
    this.validateForm.addControl(
      `${newId}_value`,
      new FormControl("")
    );
    this.listOfControl = [...this.listOfControl];
      return Number(newId);
  }

    
  public removeField(value: any, e: MouseEvent): void {
    e.preventDefault();
    if (this.listOfControl.length > 0) {
      this.removeFieldControl(value);
      this.listOfControl =[...this.listOfControl]
    }
  }
  private removeFieldControl(value: any){
    const index = this.listOfControl.indexOf(value);
    this.listOfControl.splice(index, 1);
    this.validateForm.removeControl(`${value.controlValue.id}_key`);
    this.validateForm.removeControl(`${value.controlValue.id}_value`);
  }

public getMetdData(){
  const d = this.validateForm.value;
  let arrs = new Array<any>();
  for (let index = 0; index < this.listOfControl.length; index++) {
   let param = this.listOfControl[index] 
    arrs.unshift({
      key:d[`${param.controlValue.id}_key`],
      value:d[`${param.controlValue.id}_value`],
    })
  }
  const meta={
    respository:d.respository,
    version:d.version,
    package_name:d.package_name,
    run_params:{
      others:arrs,
      namespace:d.namespace
    }
  }  
  return meta     
}
  get data():any{
    const d = this.validateForm.value;
    d.deploy_mode = 'helm'
    d.config= JSON.stringify(this.getMetdData())
    d.template_id = this.templateId;
    return d;
}

  public submitForm() {
    this.loading = true;
    this.backendService.createAppTemplateService<ApiResult>(this.data).subscribe(res=>{
      this.loading = false;
      if (res.code === ApiResultType.Success) {
        this.notification.success('提示',"提交成功");
        this.router.navigateByUrl(`/app/detail/template/config/${this.templateId}`);
      }
    },err=>{
      this.loading = false;
    });

  }
}