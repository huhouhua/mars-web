import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
import { EventBus } from '../shared/event-bus';
import { ArchOptions, ChildrenData, GenerateTemplateContext, PackageOptions, PackingControl, TemplateFileControl } from '../shared/options';
import { GenerateTemplateService } from '../shared/generate-template.service';
import { cloneDeep, forEach, uniq, uniqBy } from 'lodash-es';
import { FormService } from '../shared/form.service';
import { GenerateService } from '../shared/generate.service';
@Component({
  selector: 'app-package-config-packing',
  templateUrl: './packing.component.html',
  styleUrls: ['./packing.component.less'],
})
export class PackagePackingComponent implements OnInit {
  @Input() validateForm!: FormGroup;
  @Input() loading: boolean = false;
  public listOfControl: PackingControl[] = [];
  public archOptions:string[] =ArchOptions;
  public packageOptions:string[] = PackageOptions;
  constructor(
    private fb: FormBuilder,
    private modal: NzModalService,
    private backendService: BackendService,
    private notification: NzNotificationService,
    private generateTemplateService:GenerateTemplateService,
    private generateService:GenerateService,
    private formService:FormService,
    private router: Router,
    private eventBus: NgEventBus,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.eventBus.on(EventBus.setPackingForm).subscribe((control: MetaData) => {
      let id = this.addField(undefined,control.data);
      this.setValue(id);
 });
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
      `${newId}_packing_os`,
      new FormControl(null, Validators.required)
    );
    this.validateForm.addControl(
      `${newId}_packing_arch`,
      new FormControl("arm64", Validators.required)
    );
    this.validateForm.addControl(
      `${newId}_packing_type`,
      new FormControl("install", Validators.required)
    );
    this.validateForm.addControl(
      `${newId}_packing_template`,
      new FormControl(null, Validators.required)
    );
    this.validateForm.addControl(
      `${newId}_packing_template_medaData`,
      new FormControl(new GenerateTemplateContext() )
    );
    this.listOfControl = [...this.listOfControl];
      return Number(newId);
  }
  
  private setValue(id:number){
    const  control = this.listOfControl.find(q=>q.controlValue.id == id);
    if(!control){
      return;
    }
    this.validateForm.get(`${id}_packing_os`)?.setValue(control?.controlValue.os);
    this.validateForm.get(`${id}_packing_arch`)?.setValue(control?.controlValue.arch);
    this.validateForm.get(`${id}_packing_type`)?.setValue(control?.controlValue.type);
    this.validateForm.get(`${id}_packing_template`)?.setValue(control?.controlValue.template);
    this.validateForm.get(`${id}_packing_template_medaData`)?.setValue(control?.controlValue.medaData);
    // newValue.medaData.TemplateImages.forEach(element=>{
    //   this.eventBus.cast(EventBus.setPackingImageForm, {
    //     pack:control.controlValue,
    //     templateImage:element
    //   });
    // });
    // newValue.medaData.TemplateCharts.forEach(element=>{
    //   this.eventBus.cast(EventBus.setPackingChartsForm, {
    //     pack:control.controlValue,
    //     templateChart:element
    //   });
    // });
  }
  
  public removeField(value: PackingControl, e: MouseEvent): void {
    e.preventDefault();
    if (this.listOfControl.length > 0) {
      console.log(this.listOfControl);
      this.removeFieldControl(value);
      this.listOfControl =[...this.listOfControl]
    }
  }
  private removeFieldControl(value: PackingControl){
    const index = this.listOfControl.indexOf(value);
    this.listOfControl.splice(index, 1);
    this.validateForm.removeControl(`${value.controlValue.id}_packing_os`);
    this.validateForm.removeControl(`${value.controlValue.id}_packing_arch`);
    this.validateForm.removeControl(`${value.controlValue.id}_packing_type`);
    this.validateForm.removeControl(`${value.controlValue.id}_packing_template`);
    this.validateForm.removeControl(`${value.controlValue.id}_packing_template_medaData`);
    this.formService.setRemoveOfFileConfig(value.controlValue,this.validateForm);
    // this.validateForm.removeControl(`${value.controlValue.id}_packing_template_chart_items`);
    // this.validateForm.removeControl(`${value.controlValue.id}_packing_template_file_items`);
    // this.validateForm.removeControl(`${value.controlValue.id}_packing_template_image_items`);
  }
  public viewClick(value: PackingControl, e: MouseEvent){
    const  pack = this.generateTemplateService.GetPackingOfValidateForm(value.controlValue.id,this.validateForm);
    
    // const compilelist =  this.generateService.GetfileCompileList(this.validateForm);
    // compilelist.forEach(compile=>{
    //   const imageTag =`.${compile.name}_image`;
    //   const chart= `.${compile.name}_chart`;
    //   pack.medaData.TemplateImages.forEach(image=>{
    //     const tag = image.controlValue.listOfChildrenData.findIndex(q=>q.name == imageTag);
    //       if(tag<0){
    //         let id = 0;
    //         if(image.controlValue.listOfChildrenData.length>0){
    //         id = this.listOfControl[this.listOfControl.length - 1].controlValue.id + 1;
    //         }
            
    //         image.controlValue.listOfChildrenData.push({
    //           name:imageTag,
    //           fillInName:'',
    //           id:id,
    //           type:1,
    //         });
    //       }
    //   })
      

    //   pack.medaData.TemplateCharts.forEach(chart=>{

    //   })
      

    // })
    // pack.medaData.TemplateImages
    this.eventBus.cast(EventBus.packageView, pack);
  }
}
