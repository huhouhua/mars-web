import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BackendService } from 'src/app/pages/services/backend.service';
import {
  ApiResult,
  ApiResultType,
  Member,
  MemberRole,
  Option,
} from 'src/app/shared/common.type';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { MetaData, NgEventBus } from 'ng-event-bus';
import { EventBus } from '../../shared/event-bus';
import { PackageConfigTemplatePreviewComponent } from '../preview/template-preview.component';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { GenerateTemplateService } from '../../shared/generate-template.service';
import { ChildrenData, Compile, GenerateTemplateContext, Packing, TemplateFile, TemplateFileControl, TypeOptions } from '../../shared/options';
import { GenerateService } from '../../shared/generate.service';

@Component({
  selector: 'app-package-config-template-file',
  templateUrl: './template-file.component.html',
  styleUrls: ['./template-file.component.less'],
})
export class PackageConfigTemplateFileComponent implements OnInit {
  public Context: GenerateTemplateContext = new GenerateTemplateContext();
  @Input()  ValidateForm!: FormGroup;
   public pack!:Packing
  loading: boolean = false;
  projectList: any[] = [];
  loadingWithProjectList: boolean = false;
  public disabled:boolean =true;
  public fileCompileList:Compile[]=[];
  public typeOptions:Option[]=TypeOptions;
  constructor(
    private fb: FormBuilder,
    private drawerService: NzDrawerService,
    private backendService: BackendService,
    private notification: NzNotificationService,
    private router: Router,
    private eventBus: NgEventBus,
    private changeDetector: ChangeDetectorRef,
    private generateService:GenerateService,
    private generateTemplateService:GenerateTemplateService,
  ) {}
  ngOnInit(): void {
    this.eventBus.on(EventBus.packageView).subscribe((control: MetaData) => {
       this.pack = control.data;
       this.disabled =false;
       this.Context = control.data.medaData;
       this.onOpenChange({});
    });
  }
  public addField(e?: MouseEvent, value?: any) {
    if (e) {
      e.preventDefault();
    }
    if(!this.Context){
      return;
    }
    let id = 0;
    if (this.Context.TemplateFiles.length > 0) {
      id = this.Context.TemplateFiles[this.Context.TemplateFiles.length - 1].controlValue.id + 1;
    }
    const control = {
      expand:false,
      controlValue: value ? value : new TemplateFile(),
    };
    control.controlValue.id = id;
     const  index = this.Context.TemplateFiles.push(control);

    const newId = `${this.Context.TemplateFiles[index - 1].controlValue.id}`;
    this.ValidateForm.addControl(
      `${this.pack.id}_${newId}_template_file_target`,
      new FormControl(null, Validators.required)
    );
    this.ValidateForm.addControl(
      `${this.pack.id}_${newId}_template_file_before`,
      new FormControl(null)
    );
    this.ValidateForm.addControl(
      `${this.pack.id}_${newId}_template_file_after`,
      new FormControl(null)
    );
    
    this.Context.TemplateFiles = [...this.Context.TemplateFiles];
  }
  public removeField(value: TemplateFileControl, e: MouseEvent): void {
    e.preventDefault();
    if(!this.Context){
      return;
    }
    if (this.Context.TemplateFiles.length > 0) {
      console.log(this.Context.TemplateFiles);
      this.removeFieldControl(value);
      this.Context.TemplateFiles =[...this.Context.TemplateFiles]
    }
  }
  private removeFieldControl(value: TemplateFileControl){
    if(!this.Context){
      return;
    }
    const index = this.Context.TemplateFiles.indexOf(value);
    this.Context.TemplateFiles.splice(index, 1);
    this.ValidateForm.removeControl(`${this.pack.id}_${value.controlValue.id}_template_file_target`);
    this.ValidateForm.removeControl(`${this.pack.id}_${value.controlValue.id}_template_file_before`);
    this.ValidateForm.removeControl(`${this.pack.id}_${value.controlValue.id}_template_file_after`);
  }
  public addChildrenField(valueTemplate:TemplateFileControl, e?: MouseEvent, value?: any){
    if (e) {
        e.preventDefault();
      }
      if(!this.Context){
        return;
      }
      let id = 0;
      if (valueTemplate.controlValue.listOfChildrenData.length > 0) {
        id =  valueTemplate.controlValue.listOfChildrenData[valueTemplate.controlValue.listOfChildrenData.length - 1].id + 1;
      }
      const control = {
        id:id,
        name: '',
        type: 0,
        fillInName:''
      };
      valueTemplate.controlValue.listOfChildrenData.push(value ?? control);
      valueTemplate.controlValue.listOfChildrenData = [...valueTemplate.controlValue.listOfChildrenData];
      this.Context.TemplateFiles=[...this.Context.TemplateFiles];
     
  }

  public onExpandChange(e:any, value: TemplateFileControl){

  }

  public removeChildrenField(valueTemplate:TemplateFileControl, value: ChildrenData, e: MouseEvent):void{
    e.preventDefault();
    if(!this.Context){
      return;
    }
    if (valueTemplate.controlValue.listOfChildrenData.length > 0) {
        const index = valueTemplate.controlValue.listOfChildrenData.indexOf(value);
        valueTemplate.controlValue.listOfChildrenData.splice(index, 1);
        valueTemplate.controlValue.listOfChildrenData =[...valueTemplate.controlValue.listOfChildrenData]
        this.Context.TemplateFiles=[...this.Context.TemplateFiles];
    }
  }
  public onOpenChange(e:any){
     let newFileCompileList = this.generateService.GetfileCompileList(this.ValidateForm);
     this.fileCompileList = newFileCompileList;
    this.fileCompileList=[...this.fileCompileList];
  
  }

  public onPreview(){
    if(!this.Context){
      return;
    }
    const yamlData = this.generateTemplateService.GenerateTemplateYaml(this.pack, this.ValidateForm, this.Context);
     
    this.drawerService.create({
      nzTitle: `${this.pack.template}-配置预览`,
      nzContent: PackageConfigTemplatePreviewComponent,
      nzWidth: 1300,
      nzContentParams:{
        yamlData,
      },
      nzPlacement:"right"
    });
  }
}