import { Component, EventEmitter, Input, OnInit } from '@angular/core';
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
import { lastValueFrom, tap } from 'rxjs';
@Component({
  selector: 'app-edit-service-config',
  templateUrl: './edit-service-config.component.html',
  styleUrls: ['./edit-service-config.component.less'],
})
export class EditServiceConfig implements OnInit {
  serviceId: string = '';
  templateId: string ='';
  validateForm!: FormGroup;
  public isInitData:boolean =false;
  public configMode: number = 0;
  public configYaml: string = '';
  public templateYaml: string = '';
  public valuesYaml: string = '';
  public helmRepo: any[] = [];
  public listOfControl: any[] = [];
  public selectedChartList: any[] = [];
  public selectedVersionList: any[] = [];
  public chartMap: Map<string, any[]> = new Map<string, any[]>();
  public templateList: Array<any> = new Array<any>();
  public configModeList: Option[] = [
    {
      value: 0,
      name: '键值对',
    },
    {
      value: 1,
      name: '文件',
    },
  ];
  public options = {
    lineNumbers: true,
    readOnly: false, // nocursor can not copy
    mode: 'yaml',
    autofocus: true,
    lineWiseCopyCut: true,
    theme: 'material',
    //cursorBlinkRate: 500 // hide cursor
  };
  public optionReadOnly = {
    lineNumbers: true,
    readOnly: true, // nocursor can not copy
    mode: 'yaml',
    autofocus: true,
    lineWiseCopyCut: true,
    theme: 'material',
    //cursorBlinkRate: 500 // hide cursor
  };

  public chartSelectLoading = false;
  public loading = false;
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
 async  ngOnInit() {
    this.templateId =
    this.activeRouter.snapshot.paramMap.get('templateId') ?? '';
    this.serviceId =
    this.activeRouter.snapshot.queryParamMap.get('service_id') ?? '';
    const group = {
      name: ['', Validators.required],
      deploy_strategy: ['recreate'],
      deploy_priority: [1],
      respository: ['', Validators.required],
      version: ['', Validators.required],
      config_mode: [0],
      package_name:  ['', Validators.required],
      namespace:['default',Validators.required],
      mode: ['helm'],
      description: [''],
    };
    this.validateForm = this.fb.group(group);
    await this.loadSvc();
  }
  public cancel() {
    this.router.navigateByUrl(`/app/detail/template/config/${this.templateId}`);
  }

  private async loadSvc(){
    this.loading = true;
    this.isInitData = true;
    this.backendService.getAppTemplateService<ApiResult>(this.serviceId).subscribe(async res=>{
      this.loading = false;
      await this.loadRepoList();
      if (res.code === ApiResultType.Success) {
        let model = res.data.application_service_view_model;
        let config = await this.parseMetaDataOfValue(model, model.config)
        this.validateForm.patchValue(model);
        this.isInitData = false;
        await this.onVersionChange(config.version,config.package_name)
      }
    },async  err=>{
       this.loading = false;
       await this.loadRepoList();
       this.isInitData = false;
    });
  }
  
  private async parseMetaDataOfValue(model:any, str:string):Promise<any>{
    let config = JSON.parse(str)
    model.config_mode = config.config_mode;
    model.respository = config.repo_id;
    model.version = config.version;
    model.package_name = config.package_name;
    model.namespace = config.run_params.namespace;
    await this.onRepoChange(config.repo_id)
    if(config.config_mode==0){
      config.run_params.value.key_values.forEach((element:any) => {
          let id= this.addField(undefined,element)
          this.setValue(id)
      });
      if(config.run_params.value.key_values==null ||  
        config.run_params.value.key_values.length==0){
        this.initParam();
    }
  }else{
       this.configYaml=config.run_params.value.value_file;
  }
  return config
  }

public initParam(){
  if(this.listOfControl.length==0){
    this.addField(undefined,null)
  }
}

private  async loadRepoList() {
  this.loading = true;
  const service = this.backendService
  .getInfrastructureList<ApiResult>({
    status: 'running',
    type: 'helm',
  }).pipe(tap( res=>{
    this.loading = false;
    if (res.code === ApiResultType.Success) {
      let model = res.data.infrastructure_view_models;
      if (model != null) {
        this.helmRepo = res.data.infrastructure_view_models;
      }
    }
  }))
  await lastValueFrom(service).catch(res=>{
    this.loading = false;
  });
}

public async onRepoChange(infraId:string) {
  if (this.chartMap.has(infraId)) {
    let cacheList = this.chartMap.get(infraId) as any[];
    if (cacheList.length > 0) {
      this.validateForm.get('package_name')?.setValue(cacheList[0].Key);
    } else {
      this.validateForm.get('package_name')?.setValue('');
    }
    this.selectedChartList = cacheList;
    return;
  }
  let infra = this.helmRepo.find((q) => q.id == infraId);
  this.chartSelectLoading = true;
  const service = this.backendService
    .getAllCharts<ApiResult>({
      repo_name: infra.repo,
    })
    .pipe(
      tap(res => {
        this.chartSelectLoading = false;
        if (res.code === ApiResultType.Success) {
          this.chartMap.set(infraId, res.data);
          this.selectedChartList = res.data;
          if (!this.isInitData && res.data.length > 0) {
            this.validateForm.get('package_name')?.setValue(res.data[0].Key);
          } else {
            this.validateForm.get('package_name')?.setValue('');
          }
        }
      }
    ));
    await lastValueFrom(service).catch(res=>{
      this.chartSelectLoading = false;
    }); 
}

public async onChartsChange(key: string) {
  let charts = this.selectedChartList.find((q) => q.Key == key);
  console.log(charts)
  if (charts == undefined) {
    return;
  }
  if(!this.isInitData){
    if (charts.Group.length > 0) {
      this.validateForm.get('version')?.setValue(charts.Group[0].version,{
        emitViewToModelChange:false
      });
     await this.onVersionChange(charts.Group[0].version,key)
    } else {
      this.validateForm.get('version')?.setValue('');
    }
  }
  this.selectedVersionList = charts.Group;
}
public async  onVersionChange(key:string, chartName:string){
  if(this.isInitData){
    return;
  }
  let value = this.validateForm.value
  if(value.package_name==""){
    return
  }
  let request = {
    chart_name: chartName =='' ?  value.package_name:chartName,
    version:key
 }
  let template = this.templateList.find((q) => 
  q.repoId == value.respository && q.chart_name == request.chart_name && q.version == request.version);
  if (template!=undefined) {
    this.templateYaml =template.templateYaml;
    this.valuesYaml = template.valuesYaml;
    return;
  }
  let infra = this.helmRepo.find((q) => q.id == value.respository);
  let service =this.backendService
  .getChart<ApiResult>(
    infra.repo,
    request)
  .pipe(
    tap(res => {
      if (res.code === ApiResultType.Success) {
        this.templateList.push({
            repoId:value.id,
            chart_name:request.chart_name,
            version:request.version,
            templateYaml:res.data.templates,
            valuesYaml :res.data.values,
        })
        this.templateYaml = res.data.templates;
        this.valuesYaml = res.data.values;
      }
    },
    (err) => {
    }
  ));
  await lastValueFrom(service).catch(err=>{
    console.log(err);
  }); 
}

public onConfigModeChange(value: number) {
  this.configMode = value;
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

  private setValue(id:number):void{
    const  control = this.listOfControl.find(q=>q.controlValue.id == id);
    if(!control){
      return;
    }
    this.validateForm.get(`${id}_key`)?.setValue(control?.controlValue.key);
    this.validateForm.get(`${id}_value`)?.setValue(control?.controlValue.value);
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

  public getMetdData() {
    const d = this.validateForm.value;
    let value_config = {
      key_values: new Array<any>(),
      value_file: '',
    };
    
    if (d.config_mode == 0) {
      for (let index = 0; index < this.listOfControl.length; index++) {
        let param = this.listOfControl[index];
        value_config.key_values.unshift({
          key: d[`${param.controlValue.id}_key`],
          value: d[`${param.controlValue.id}_value`],
        });
      }
    } else {
      value_config.value_file = this.configYaml;
    }
    const meta = {
      config_mode: d.config_mode,
      repo_id: d.respository,
      version: d.version,
      package_name: d.package_name,
      run_params: {
        value:value_config,
        namespace: d.namespace,
      },
    };
    return meta;
  }
  get data():any{
    const d = this.validateForm.value;
    d.deploy_mode = 'helm'
    d.config= JSON.stringify(this.getMetdData())
    return d;
}

  public submitForm() {
    this.loading = true;
    this.backendService.updateAppTemplateService<ApiResult>(this.serviceId, this.data).subscribe(res=>{
      this.loading = false;
      if (res.code === ApiResultType.Success) {
        this.notification.success('提示',"更新成功");
        this.router.navigateByUrl(`/app/detail/template/config/${this.templateId}`);
      }
    },err=>{
      this.loading = false;
    });

  }
}