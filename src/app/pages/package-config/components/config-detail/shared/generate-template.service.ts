import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/shared/common.type';
import { FormGroup } from '@angular/forms';
import { cloneDeep, uniq, uniqBy } from 'lodash-es';
import {
  Compile,
  GenerateTemplateContext,
  Packing,
  TemplateCharts,
  TemplateChartsControl,
  TemplateFile,
  TemplateFileControl,
  TemplateImage,
  TemplateImageControl,
} from './options';
import * as YAML from 'js-yaml';
import { FormService } from './form.service';

@Injectable({
  providedIn: `root`,
})
export class GenerateTemplateService {
  private packageTemplate: any = {
   version:"v1",
   spec:{
      os:'',
      arch:'',
      fullName:'',
      path:'',
   },
   directory:{
      ruijie:{}
   },
   files:{
      http:[]
   },
   images:[],
   charts:[]
  };
  constructor(private http: HttpClient,
    private formService:FormService) {}

  public GenerateTemplateYaml(pack:Packing, validateForm:FormGroup, context:GenerateTemplateContext):string {
   const  packageTemplate =cloneDeep(this.packageTemplate);
   let compileList = this.formService.GetfileCompileList(validateForm);
   let files = this.getTemplateFileList(pack, validateForm, context.TemplateFiles);    
   let images = this.getTemplateImageList(pack,validateForm, context.TemplateImages);
  
   let charts = this.getTemplateChartList(pack,validateForm,  context.TemplateCharts);
    this.setBaseInfo(packageTemplate, pack);
    this.setFile(packageTemplate, files);
    this.setImage(packageTemplate,compileList, images);
    this.setCharts(packageTemplate, compileList, charts);
    return YAML.dump(packageTemplate, {
      lineWidth: 5000,
    });
  }
  private setBaseInfo(template:any, packing:Packing):void{
   template.spec.os = packing.os  == null ? '':packing.os,
   template.spec.arch =packing.arch == null ? '':packing.arch,
   template.spec.fullName=`${packing.os}-${packing.arch}-${packing.type}.tar.gz`;
   template.spec.path =`${packing.type}/${packing.os}-${packing.arch}/backup`
  }
  private setFile(template:any,templateFiles:TemplateFile[]):void{
   templateFiles.forEach(element => {
       let obj:any= {
         files:[]=[],
         target:element.target == null ? '':element.target,
         before:element.before == null ? '':element.before,
         after:element.after == null ? '':element.after,
       }
       element.listOfChildrenData.forEach(file=>{ 
              let fileObj:any ={
               name:file.fillInName,
              };
              if(file.type == 1 && file.name!=''){
                  fileObj.name = `{{ .${file.name} }}`;
                  const search  = fileObj.name.search('-');
                  if(search>=0){
                     fileObj.name = `{{ index .${file.name} }}`
                  } 
              }
              if(fileObj.name!=''){
             obj.files.push(fileObj);
              }
       });
       template.files.http.push(obj);
   });
  }
  private setImage(template:any, compiles:Compile[],templateImages:TemplateImage[]):void{
   templateImages.forEach(element => {
       let obj:any= {
         source:[]=[],
         target:element.target == null ? '':element.target,
       }
       this.appendDefaultImage(obj.source,compiles);
       element.listOfChildrenData.forEach(file=>{
             let name = file.fillInName;
              if(file.type == 1&&file.name!=''){
                  name = `{{ .${file.name} }}`;
                  const search  = name.search('-');
                  if(search>=0){
                     name = `{{ index .${file.name} }}`
                  }
              }
              if(name!=''){
                //判断是否有image的配置
                const index  = obj.source.findIndex((q:string)=>q == file.name);
                if(index<0){
                   obj.source.push(name);
                }
             }
       });
       template.images.push(obj);
   });
  }
  private setCharts(template:any,compiles:Compile[], templateCharts:TemplateCharts[]):void{
   templateCharts.forEach(element => {
       let obj:any= {
         source:[]=[],
         target:element.target == null ? '':element.target,
       }
       this.appendDefaultChart(obj.source,compiles);
       element.listOfChildrenData.forEach(file=>{
         let name = file.fillInName;
              if(file.type == 1 && file.name!=''){
                  name = `{{ .${file.name} }}`;
                  const search  = name.search('-');
                  if(search>=0){
                     name = `{{ index .${file.name} }}`
                  }
              }
              if(name!=''){
                  //判断是否有chart的配置
                const index  = obj.source.findIndex((q:string)=>q == file.name);
                  if(index<0){
                     obj.source.push(name);
                  }
               }
       });
       template.charts.push(obj);
   });
  }
  private getTemplateFileList(
    pack:Packing,
    validateForm: FormGroup,
    templateFiles: TemplateFileControl[]
  ): TemplateFile[] {
    let files = this.getfileList(pack,validateForm);
    files.forEach((element) => {
      let control = templateFiles.find((q) => q.controlValue.id == element.id);
      if (control != undefined) {
        element.listOfChildrenData = control.controlValue.listOfChildrenData;
      }
    });
    return files;
  }

  private getfileList(  pack:Packing,validateForm: FormGroup): TemplateFile[] {
    let controls = validateForm.controls;
    let file = new TemplateFile();
    let isBeforeExist: Boolean = false;
    let isAfterExist: Boolean = false;
    let isTargetExist: Boolean = false;
    let files: TemplateFile[] = [];
    for (const key in controls) {
      if (key.startsWith(`${pack.id}_`) && key.endsWith('template_file_before')) {
        isBeforeExist = true;
        file.before = validateForm.get(key)?.value;
      }
      if (key.startsWith(`${pack.id}_`) && key.endsWith('_template_file_after')) {
        isAfterExist = true;
        file.after = validateForm.get(key)?.value;
      }
      if (key.startsWith(`${pack.id}_`) && key.endsWith('_template_file_target')) {
        isTargetExist = true;
        file.target = validateForm.get(key)?.value;
      }
      if (isBeforeExist && isAfterExist && isTargetExist) {
        file.id = Number(key.split('_')[1]);
        files.push(file);
        file = new TemplateFile();
        isBeforeExist = false;
        isAfterExist = false;
        isTargetExist = false;
      }
    }
    return files;
  }

  private getTemplateImageList(
    pack:Packing,
    validateForm: FormGroup,
    templateImages: TemplateImageControl[]
  ): TemplateImage[] {
    let images = this.getImageList(pack,validateForm);
    images.forEach((element) => {
      let control = templateImages.find((q) => q.controlValue.id == element.id);
      if (control != undefined) {
        element.listOfChildrenData = control.controlValue.listOfChildrenData;
      }
    });
    return images;
  }

  private getImageList( pack:Packing,validateForm: FormGroup): TemplateImage[] {
    let controls = validateForm.controls;
    let image = new TemplateImage();
    let isTargetExist: Boolean = false;
    let images: TemplateImage[] = [];
    for (const key in controls) {
      if (key.startsWith(`${pack.id}_`) && key.endsWith('_template_image_target')) {
        isTargetExist = true;
        image.target = validateForm.get(key)?.value;
      }
      if (isTargetExist) {
        image.id = Number(key.split('_')[1]);
        images.push(image);
        image = new TemplateImage();
        isTargetExist = false;
      }
    }
    return images;
  }
  private getTemplateChartList(
    pack:Packing,
   validateForm: FormGroup,
   templateCharts: TemplateChartsControl[]
 ): TemplateCharts[] {
   let charts = this.getChartList(pack,validateForm);
   charts.forEach((element) => {
     let control = templateCharts.find((q) => q.controlValue.id == element.id);
     if (control != undefined) {
       element.listOfChildrenData = control.controlValue.listOfChildrenData;
     }
   });
   return charts;
 }

 private getChartList( pack:Packing,validateForm: FormGroup): TemplateCharts[] {
   let controls = validateForm.controls;
   let chart = new TemplateCharts();
   let isTargetExist: Boolean = false;
   let charts: TemplateCharts[] = [];
   for (const key in controls) {
     if (key.startsWith(`${pack.id}_`) && key.endsWith('_template_charts_target')) {
       isTargetExist = true;
       chart.target = validateForm.get(key)?.value;
     }
     if (isTargetExist) {
      chart.id = Number(key.split('_')[1]);
      charts.push(chart);
      chart = new TemplateCharts();
      isTargetExist = false;
     }
   }
   return charts;
 }

 private appendDefaultImage(sources:string[],compiles:Compile[] ) :void{
  const images = compiles.map(q=>{
   const search  = q.name.search('-');
   if(search>=0){
     return `{{ index .${q.name}_image }}`
   }
     return `{{ ${q.name}_image }}`
  });
  sources.push(...images);
}
private appendDefaultChart(sources:string[],compiles:Compile[]):void{
 const charts = compiles.map(q=>{
   const search  = q.name.search('-');
   if(search>=0){
     return `{{ index .${q.name}_chart }}`
   }
     return `{{ ${q.name}_chart }}`
});
sources.push(...charts);
}

  public GetPackingOfValidateForm(prefix:number, validateForm: FormGroup):Packing{
     let pack =new Packing();
     pack.template = validateForm.get(`${prefix}_packing_template`)?.value;
     pack.arch = validateForm.get(`${prefix}_packing_arch`)?.value;
     pack.os = validateForm.get(`${prefix}_packing_os`)?.value;
     pack.type = validateForm.get(`${prefix}_packing_type`)?.value;
     pack.medaData = validateForm.get(`${prefix}_packing_template_medaData`)?.value;
     pack.id = prefix;
     return pack;
  }
}