import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BackendService } from 'src/app/pages/services/backend.service';
import { ConfigAdvancedEditComponent } from '../config-advanced-edit/config-advanced-edit.component';
import { MetadataService } from 'src/app/pages/services/metadata.service';
import { ApiResultType } from 'src/app/shared/common.type';
@Component({
    selector: 'app-create-template-config',
    templateUrl: './create-template-config.component.html',
    styleUrls: ['./create-template-config.component.less'],
  })
export class CreateTemplateConfig implements OnInit {
     templateId:string ='';
  validateForm!: FormGroup;
  metaData:metaData ={
    metadata:[]=[],
    group:{},
    yaml:''
  };
  loading = false;
  commonparams: [] =[];
  constructor(
    private fb: FormBuilder,
    // private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private notification: NzNotificationService,
    private backendService: BackendService,
    private activeRouter: ActivatedRoute,
    private drawerService: NzDrawerService,
    private  metadataService:MetadataService,
    
    private router: Router,
  ) {}

  ngOnInit() {
    this.templateId = this.activeRouter.snapshot.paramMap.get('templateId') ?? '';
    const group = {
        name: ['',Validators.required],
        serviceName:['',Validators.required],
        serviceVersion: ['',Validators.required],
        repoUrl: ['',Validators.required],
        externalRegistry: [''],
        description: [''],
      };
      this.validateForm = this.fb.group(group);
      
  }
    // if (!(envList && envList.length > 0)) {
    //   this.notification.create('info', '提示', '必须设置一个环境！！');
    //   return;
    // }

  
    // this.loading = true;
    // this.backendService
    //   .createTemplateConfig<ApiResult>({ templateId: this.template.id, envs: envList, appName: this.appName })
    //   .subscribe(
    //     result => {
    //       this.loading = false;
    //       if (result.status === ApiResultType.Success) {
    //         this.msgSrv.success('配置成功');
    //         this.modal.close(true);
    //       }
    //     },
    //     err => {
    //       this.loading = false;
    //     },
    //   );

    public cancel(){
        this.router.navigateByUrl(`/app-list/detail/template/config/${this.templateId}`);
    }

    public syncConfig(){

    }
 
    public openadvancededit(){
  

      
        
    const data:any[] =[

        {
            "description": "镜像地址",
            "key": "repoUrl",
            "type": "string",
            "label": "repoUrl",
            "tags": [],
            "specialFocusLevel": 0,
            "fixedConfig": true,
            "pattern": "",
            "required": true,
            "default": this.validateForm.get("repoUrl")?.value
          },
          {
            "description": "镜像地址",
            "key": "repoUrl",
            "type": "string",
            "label": "repoUrl",
            "tags": [],
            "specialFocusLevel": 0,
            "fixedConfig": true,
            "pattern": "",
            "required": true,
            "default": this.validateForm.get("repoUrl")?.value
          }
    ];
    this.metaData = this.metadataService.initDefaultServiceConfig(this.metaData,null);
    this.metaData.group = this.validateForm.value;
        this.drawerService
        .create<ConfigAdvancedEditComponent>({
          nzTitle: `模板元数据配置`,
          nzSize:'large',
          nzWidth: '90%',
          nzClosable: true,
          nzPlacement: 'left',
          nzContent: ConfigAdvancedEditComponent,
          nzContentParams:  {
            record: this.metaData,     
            }
          }
        )
    }
    public submitConfig(){
        this.metaData.group = this.validateForm.value;

        this.metaData = this.metadataService.initDefaultServiceConfig(this.metaData.group,null);
       
        const data:any[] =[

            {
                "description": "服务名",
                "key": this.validateForm.get('serviceName')?.value,
                "type": "string",
                "label": "serviceName",
                "tags": [],
                "specialFocusLevel": 0,
                "fixedConfig": true,
                "pattern": "",
                "required": true,
                "default": this.validateForm.get("serviceName")?.value,
                "properties":[
                    {
                        "description": "镜像地址",
                        "key": "repoUrl",
                        "type": "string",
                        "label": "repoUrl",
                        "tags": [],
                        "specialFocusLevel": 0,
                        "fixedConfig": true,
                        "pattern": "",
                        "required": true,
                        "default": this.validateForm.get("repoUrl")?.value
                      },
                      {
                        "description": "镜像地址",
                        "key": "repoUrl",
                        "type": "string",
                        "label": "repoUrl",
                        "tags": [],
                        "specialFocusLevel": 0,
                        "fixedConfig": true,
                        "pattern": "",
                        "required": true,
                        "default": this.validateForm.get("repoUrl")?.value
                      }
                ]
              },

       
        ];

        console.log(this.metaData);
        this.metaData.metadata = data;
       let requestData:any={
         templateId:this.templateId,
         name:this.validateForm.get('name')?.value,
         description:this.validateForm.get('description')?.value,
         serviceName:this.validateForm.get('serviceName')?.value,
         metaData:  JSON.stringify(this.metaData.metadata, null, '\t'),
         yamlData: JSON.stringify(this.metaData.yaml, null, '\t'),
         imageInfos:[{
            image:this.validateForm.get('repoUrl')?.value,
            tag:this.validateForm.get('serviceVersion')?.value,
         }]
       }
       this.loading = true;
         this.backendService.createTemplateConfig(requestData).subscribe(res=>{
            this.loading = false;
            if (res.status === ApiResultType.Success) {
                this.notification.success('提示',"创建成功");
                this.router.navigateByUrl(`/app-list/detail/template/config/${this.templateId}`);
             }
         });
    }
  }

class metaData{
    metadata:any[] =[];
    group:any={};
    yaml:string =''
}
