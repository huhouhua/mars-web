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
import {
  ApiResult,
  ApiResultType,
  Option,
  OptionAny,
} from 'src/app/shared/common.type';
import { removeBodyStyle } from 'src/app/shared/help';
@Component({
  selector: 'app-create-service-config',
  templateUrl: './create-service-config.component.html',
  styleUrls: ['./create-service-config.component.less'],
})
export class CreateServiceConfig implements OnInit {
  templateId: string = '';
  app_id: string = '';
  validateForm!: FormGroup;
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

  public loading = false;
  public chartSelectLoading = false;
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
  ngOnInit() {
    this.loadRepoList();
    this.templateId =
      this.activeRouter.snapshot.paramMap.get('templateId') ?? '';
    this.app_id = this.activeRouter.snapshot.queryParamMap.get('app_id') ?? '';
    const group = {
      name: ['', Validators.required],
      deploy_strategy: ['recreate'],
      deploy_priority: [1],
      respository: ['', Validators.required],
      version: ['', Validators.required],
      config_mode: [0],
      package_name: ['', Validators.required],
      namespace: ['default', Validators.required],
      mode: ['helm'],
      description: [''],
    };
    this.validateForm = this.fb.group(group);
    this.initParam();
  }
  public cancel() {
    this.router.navigateByUrl(`/app/detail/template/config/${this.templateId}`);
  }

  private loadRepoList() {
    this.loading = true;
    this.backendService
      .getInfrastructureList<ApiResult>({
        status: 'running',
        type: 'helm',
      })
      .subscribe(
        (res) => {
          this.loading = false;
          if (res.code === ApiResultType.Success) {
            let model = res.data.infrastructure_view_models;
            if (model != null) {
              this.helmRepo = res.data.infrastructure_view_models;
            }
          }
        },
        (err) => {
          this.loading = false;
        }
      );
  }

  public initParam() {
    if (this.listOfControl.length == 0) {
      this.addField(undefined, null);
    }
  }

  public onRepoChange(infraId: string) {
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
    this.backendService
      .getAllCharts<ApiResult>({
        repo_name: infra.repo,
      })
      .subscribe(
        (res) => {
          this.chartSelectLoading = false;
          if (res.code === ApiResultType.Success) {
            this.chartMap.set(infraId, res.data);
            this.selectedChartList = res.data;
            if (res.data.length > 0) {
              this.validateForm.get('package_name')?.setValue(res.data[0].Key);
            } else {
              this.validateForm.get('package_name')?.setValue('');
            }
          }
        },
        (err) => {
          this.chartSelectLoading = false;
        }
      );
  }

  public onChartsChange(key: string) {
    let charts = this.selectedChartList.find((q) => q.Key == key);
    if (charts == undefined) {
      return;
    }
    if (charts.Group.length > 0) {
      this.validateForm.get('version')?.setValue(charts.Group[0].version,{
        emitViewToModelChange:false
      });
      this.onVersionChange(charts.Group[0].version,key)
    } else {
      this.validateForm.get('version')?.setValue('');
    }
    this.selectedVersionList = charts.Group;
  }

  public onVersionChange(key:string, chartName:string){
    console.log(key);
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
    this.backendService
    .getChart<ApiResult>(
      infra.repo,
      request)
    .subscribe(
      (res) => {
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
    );
  }


  public addField(e?: MouseEvent, value?: any): number {
    if (e) {
      e.preventDefault();
    }
    let id = 0;
    if (this.listOfControl.length > 0) {
      id =
        this.listOfControl[this.listOfControl.length - 1].controlValue.id + 1;
    }
    const control = {
      controlValue: value ? value : {},
    };
    control.controlValue.id = id;
    const index = this.listOfControl.push(control);
    const newId = `${this.listOfControl[index - 1].controlValue.id}`;

    this.validateForm.addControl(`${newId}_key`, new FormControl(''));
    this.validateForm.addControl(`${newId}_value`, new FormControl(''));
    this.listOfControl = [...this.listOfControl];
    return Number(newId);
  }

  public removeField(value: any, e: MouseEvent): void {
    e.preventDefault();
    if (this.listOfControl.length > 0) {
      this.removeFieldControl(value);
      this.listOfControl = [...this.listOfControl];
    }
  }
  private removeFieldControl(value: any) {
    const index = this.listOfControl.indexOf(value);
    this.listOfControl.splice(index, 1);
    this.validateForm.removeControl(`${value.controlValue.id}_key`);
    this.validateForm.removeControl(`${value.controlValue.id}_value`);
  }
  public onConfigModeChange(value: number) {
    this.configMode = value;
    this.templateYaml = this.templateYaml;
    this.valuesYaml = this.valuesYaml; 
    this.configYaml = this.configYaml;
    
  }
  public onSelectedIndexChange(index:number){
    // if(index==1){
    //   this.templateYaml = this.templateYaml;    
    // }
    // if(index==2){
    //   this.valuesYaml = this.valuesYaml;
    //   }
    // if(index==3){
    //   this.configYaml = this.configYaml;
    // }
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
  get data(): any {
    const d = this.validateForm.value;
    d.deploy_mode = 'helm';
    d.config = JSON.stringify(this.getMetdData());
    d.template_id = this.templateId;
    return d;
  }

  public submitForm() {
    this.loading = true;
    this.backendService
      .createAppTemplateService<ApiResult>(this.data)
      .subscribe(
        (res) => {
          this.loading = false;
          if (res.code === ApiResultType.Success) {
            this.notification.success('提示', '提交成功');
            this.router.navigateByUrl(
              `/app/detail/template/config/${this.templateId}`
            );
          }
        },
        (err) => {
          this.loading = false;
        }
      );
  }
}
