import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BackendService } from 'src/app/pages/services/backend.service';
import { ApiResult, ApiResultType, Member, MemberRole, Option } from 'src/app/shared/common.type';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ActivatedRoute, Router } from '@angular/router';
import { GenerateTemplateContext, GitLabProject } from './shared/options';
import { GenerateService } from './shared/generate.service';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { PackagePreviewComponent } from './preview/package-preview.component';
import * as Tar from 'tar-js';
import * as FileSaver from 'file-saver';
import { DownloadUtilityService } from 'src/app/shared/util/download-util.service';
import { MetaData, NgEventBus } from 'ng-event-bus';
import { EventBus } from './shared/event-bus';
import { FormService } from './shared/form.service';

@Component({
  selector: 'app-package-config-detail.component',
  templateUrl: './config-detail.component.html',
  styleUrls: ['./config-detail.component.less'],
})
export class PackageConfigDetailComponent implements OnInit {
 public validateForm!: FormGroup;
  public loading:boolean =false;
  public projectList: any[] = [];
  public  loadingWithProjectList: boolean = false;
  private packageConfigId:string ='';
  public tabs_selected_index:number =0;
  public template_config_title:string ='打包模板';
  constructor( 
    private backendService: BackendService,
    private fb: FormBuilder,
    private activeRouter: ActivatedRoute,
    private generateService: GenerateService,
    private downloadUtilityService: DownloadUtilityService,
    private eventBus: NgEventBus,
    private router: Router,
    private fromService: FormService,
    private drawerService: NzDrawerService,
    private notification: NzNotificationService) {

    }
  ngOnInit(): void {
    this.packageConfigId = this.activeRouter.snapshot.paramMap.get('configId')??'';
    const group = {
        name: ['',Validators.required],
        prefix: ['',Validators.required],
        stage: ['',Validators.required],
        date: [null,Validators.required],
        version: [null,Validators.required],
      };
      
      this.validateForm = this.fb.group(group);
      this.loadProjectList();
      this.eventBus.on(EventBus.packageView).subscribe((control: MetaData) => {
        this.template_config_title = `${control.data.template}(打包模板)`;
    });
  }
  private getConfig(){
    this.loading = true;
    this.backendService.getPackageConfigDetail<ApiResult>(this.packageConfigId).subscribe(
      (res) => {
        if (res.status === ApiResultType.Success) {
            let data = res.data.packageConfigDetailViewModel;
            this.fromService.SetFromValue(data.gitLabProjects as GitLabProject[],data.metaData,this.validateForm);
        }
        this.loading = false;
      },
      (err) => {
        this.loading = false;
      }
    );
  }
  private loadProjectList(): void {
    this.loadingWithProjectList = true;
    this.backendService.getProjectListFromGitlab<ApiResult>().subscribe(
      (res) => {
        if (res.status === ApiResultType.Success) {
          this.projectList = res.data;
           this.getConfig();
        }
        this.loadingWithProjectList = false;
      },
      (err) => {
        this.loadingWithProjectList = false;
      }
    );
  }
  public handleClick(e: string):void{
    console.log(e);
  }

  public onPreview(){
    const yamlAllData =  this.generateService.GenerateAllYaml(this.validateForm,this.projectList);
       this.drawerService.create({
         nzTitle: `配置预览`,
         nzContent: PackagePreviewComponent,
         nzWidth: 1300,
         nzContentParams:{
          yamlAllData,
         },
         nzPlacement:"right"
       });
  }

  public onDownload(){
    try {
      const tar = new Tar();
      const yamlAllData =  this.generateService.GenerateAllYaml(this.validateForm,this.projectList);
      const fileName = this.validateForm.get("name")?.value;
      const arrayBuffer = this.downloadUtilityService.base64toUint8Array(btoa(yamlAllData.productYaml));
      tar.append(`${fileName}.yml`,arrayBuffer);
      for (let [key, value] of yamlAllData.packageItems.entries()) {
         tar.append(key,this.downloadUtilityService.base64toUint8Array(btoa(value)));
      }
      const blob = new Blob([tar.out], { type: 'application/octet-stream' });
      FileSaver.saveAs(blob, `${fileName}.tar`);
    } catch (error) {
      this.notification.error("错误","压缩失败！");
      console.log(error);
    }

  }
  public submitForm(e?: MouseEvent){
    if(e==undefined){
      return;
    }
    if (e) {
      e.preventDefault();
    }
     let compileList =  this.fromService.GetfileCompileList(this.validateForm);
     const projectIds = compileList.map(q=>q.git);
     let gitlabProjects = new Array<GitLabProject>();
     projectIds.forEach(id => {
        const project = this.projectList.find(q=>q.id == id );
        let obj:GitLabProject ={
            id:Number(id),
            sshUrlRepo:project.ssh_url_to_repo
        };
         gitlabProjects.push(obj);
    });
    let yaml:any ={};
    const yamlAllData =  this.generateService.GenerateAllYaml(this.validateForm,this.projectList);
    yaml.productYaml =  yamlAllData.productYaml;

    let yamlItmes:any[] =[];
    for (let [key, value] of yamlAllData.packageItems.entries()) {
      yamlItmes.push({key:key,value:value });
    }
    yaml.packageYaml=JSON.stringify(yamlItmes,null, '\t'); 
    this.loading = true;
    this.backendService.updatePackageMetadata<ApiResult>(this.packageConfigId,{
      gitLabProjects:gitlabProjects,
      metaData:JSON.stringify(yaml),
    }).subscribe(res=>{
      this.loading = false;
      if (res.status === ApiResultType.Success) {
        this.notification.success('提示',"保存成功!");
        this.router.navigateByUrl('/package-config-list');
      }
    },err=>{
      this.loading = false;
    });
  }
  }