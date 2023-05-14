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
import { ChildrenData, Compile, GenerateTemplateContext, Packing, TemplateImage, TemplateImageControl,TypeOptions } from '../../shared/options';
import { GenerateService } from '../../shared/generate.service';

@Component({
  selector: 'app-package-config-template-image',
  templateUrl: './template-image.component.html',
  styleUrls: ['./template-image.component.less'],
})
export class PackageConfigTemplateImageComponent implements OnInit {
 @Input()  public Context: GenerateTemplateContext = new GenerateTemplateContext();
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
      this.disabled =false;
      this.pack = control.data;
      this.Context = control.data.medaData;
      this.onOpenChange({});
  });
  }
  public addField(e?: MouseEvent, value?: any){
    if (e) {
      e.preventDefault();
    }
    let id = 0;
    if (this.Context.TemplateImages.length > 0) {
      id = this.Context.TemplateImages[this.Context.TemplateImages.length - 1].controlValue.id + 1;
    }
    const control = {
      expand:false,
      controlValue: value ? value : new TemplateImage(),
    };
    control.controlValue.id = id;
    const index = this.Context.TemplateImages.push(control);
    const newId = `${this.Context.TemplateImages[index - 1].controlValue.id}`;

    this.ValidateForm.addControl(
      `${this.pack.id}_${newId}_template_image_target`,
      new FormControl(null, Validators.required)
    );
    this.Context.TemplateImages = [...this.Context.TemplateImages];
  }

  public removeField(value: TemplateImageControl, e: MouseEvent): void {
    e.preventDefault();
    if (this.Context.TemplateImages.length > 0) {
      this.removeFieldControl(value);
      this.Context.TemplateImages =[...this.Context.TemplateImages]
    }
  }
  private removeFieldControl(value: TemplateImageControl){
    const index = this.Context.TemplateImages.indexOf(value);
    this.Context.TemplateImages.splice(index, 1);
    this.ValidateForm.removeControl(`${this.pack.id}_${value.controlValue.id}_template_image_target`);
  }
  public addChildrenField(valueTemplate:TemplateImageControl, e?: MouseEvent, value?: any){
    if (e) {
        e.preventDefault();
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
      valueTemplate.controlValue.listOfChildrenData.push(control);
      valueTemplate.controlValue.listOfChildrenData = [...valueTemplate.controlValue.listOfChildrenData];
      this.Context.TemplateImages=[...this.Context.TemplateImages];
     
  }
  public onExpandChange(e:any, value: TemplateImageControl){

  }

  public removeChildrenField(valueTemplate:TemplateImageControl, value: ChildrenData, e: MouseEvent):void{
    e.preventDefault();
    if (valueTemplate.controlValue.listOfChildrenData.length > 0) {
        const index = valueTemplate.controlValue.listOfChildrenData.indexOf(value);
        valueTemplate.controlValue.listOfChildrenData.splice(index, 1);
        valueTemplate.controlValue.listOfChildrenData =[...valueTemplate.controlValue.listOfChildrenData]
        this.Context.TemplateImages=[...this.Context.TemplateImages];
    }
  }
  public onOpenChange(e:any){
     let newFileCompileList = this.generateService.GetfileCompileList( this.ValidateForm);
     this.fileCompileList = newFileCompileList;
    this.fileCompileList=[...this.fileCompileList];
    console.log(this.fileCompileList);
  }

  public onPreview(){
    const yamlData = this.generateTemplateService.GenerateTemplateYaml(this.pack,this.ValidateForm, this.Context);
     
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