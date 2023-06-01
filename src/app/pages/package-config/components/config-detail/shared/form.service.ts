import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/shared/common.type';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { cloneDeep, uniq, uniqBy } from 'lodash-es';
import {
    ChildrenData,
  Compile,
  ComplieProject,
  GenerateTemplateContext,
  GenerateTestContext,
  Packing,
  TemplateCharts,
  TemplateChartsControl,
  TemplateFile,
  TemplateFileControl,
  TemplateImage,
  TemplateImageControl,
} from './options';
import * as YAML from 'js-yaml';
import { NgEventBus } from 'ng-event-bus';
import { EventBus } from './event-bus';

@Injectable({
  providedIn: `root`,
})
export class FormService {
    
    constructor(private eventBus: NgEventBus){}
    public SetFromValue(complieProjects:ComplieProject[], yamlData:string, validateForm: FormGroup):void{
           if(yamlData == ''){
              return;
           }
          let yamlAllData = JSON.parse(yamlData);
          let productYaml =YAML.load(yamlAllData.productYaml)as any;
          let packageYamls =YAML.load(yamlAllData.packageYaml) as any[];
          // console.log(productYaml);
          // console.log(packageYamls);
          this.setValueOfProduct(productYaml.product,validateForm);
          this.setValueOfCompile(productYaml.compile,complieProjects);
          const compiles =  this.GetfileCompileList(validateForm);

          this.setValueOfPacking(productYaml.packing,packageYamls,validateForm,compiles);
    }

    private setValueOfProduct(productYaml:any, validateForm: FormGroup):void{
        const date = productYaml.version.date;
        let dateValue = `${date.substr(0,4)}-${date.substr(4,2)}-${date.substr(6,2)}`
        // validateForm.get('date')?.setValue('');
        validateForm.get('date')?.setValue(new Date(dateValue));
        validateForm.get('name')?.setValue(productYaml.name);
        validateForm.get('prefix')?.setValue(productYaml.version.prefix);
        validateForm.get('stage')?.setValue(productYaml.version.stage);
        validateForm.get('version')?.setValue(productYaml.version.version);
    }
    private setValueOfCompile(compile:any[],complieProjects:ComplieProject[]):void{
        compile.forEach(element => {
             let project = complieProjects.find(q=>q.sshUrlRepo == element.git);
             const ctx = new GenerateTestContext();
             ctx.UnitTestTemplate.id = project?.unitTestTemplate.id;
             ctx.UnitTestTemplate.type = project?.unitTestTemplate.type;
             element.testTemplate = ctx;
            this.eventBus.cast(EventBus.setCompileForm,{
             projectId:project == null? '':project.gitLabProjectId,
             unitTestTemplate:project?.unitTestTemplate,
             compile:element
           });
           this.eventBus.cast(EventBus.compileView,element.testTemplate)
          
        });
    }
    private setValueOfPacking(packing:any[],packageYamls:any[],validateForm: FormGroup,compiles:Compile[]):void{
        packing.forEach((element:any,index:number) => {
          let template = packageYamls.find(q=>q.key == element.template);
          let yamlData = YAML.load(template.value) as any;
          console.log(yamlData);
          let templateCtx = new GenerateTemplateContext();
          yamlData.files.http.forEach((elementfile_http:any,index:number)=>{
            let control = new TemplateFileControl();
            control.controlValue.after = elementfile_http.after;
            control.controlValue.before = elementfile_http.before;
            control.controlValue.target = elementfile_http.target;
            control.controlValue.id = index;
             
            elementfile_http.files.forEach((elementfile:any,indexFile:number)=>{
               
                let children = new ChildrenData();
                children.id = indexFile;
                
                if(elementfile.name.search('-')>=0 && elementfile.name.startsWith('{{ index .')){
                    children.type = 1;
                    children.name = elementfile.name.split('.')[1].split(' ')[0];
                }else if(elementfile.name.endsWith(" }}") && elementfile.name.startsWith('{{ ')){
                    children.type = 1;
                    children.name = elementfile.name.split(' ')[1].substr(1)
                }else {
                    children.type = 0;
                    children.fillInName = elementfile.name;
                }
                control.controlValue.listOfChildrenData.push(children);
            })
            templateCtx.TemplateFiles.push(control);
          })

          yamlData.images.forEach((element:any,indexImage:number)=>{
            let control = new TemplateImageControl();
            control.controlValue.target = element.target;
            control.controlValue.id = indexImage;
            
            //清除默认的images
            element.source = this.clearDefaultImage(element.source,compiles);

            element.source.forEach((source:any,sourceIndex:number)=>{
                let children = new ChildrenData();
                children.id = sourceIndex;
                if(source.search('-')>=0 && source.startsWith('{{ index .')){
                      children.type = 1;
                    children.name = source.split('.')[1].split(' ')[0];
                }else if(source.endsWith(" }}") && source.startsWith('{{ ')){
                  children.type = 1;
                    children.name = source.split(' ')[1].substr(1)
                }else{
                  children.type = 0;
                  children.fillInName =source;
                }
                control.controlValue.listOfChildrenData.push(children);
            })
            templateCtx.TemplateImages.push(control);
          })

          yamlData.charts.forEach((element:any,indexChart:number)=>{
            let control = new TemplateChartsControl();
            control.controlValue.id = indexChart;
            control.controlValue.target = element.target;

             //清除默认的Charts
             element.source = this.clearDefaultCharts(element.source,compiles);

            element.source.forEach((source:any,sourceIndex:number)=>{
                let children = new ChildrenData();
                children.id = sourceIndex;
                if(source.search('-')>=0 && source.startsWith('{{ index .')){
                  children.type = 1;
                    children.name = source.split('.')[1].split(' ')[0];
                }else if(source.endsWith(" }}") && source.startsWith('{{ ')){
                  children.type = 1;
                    children.name = source.split(' ')[1].substr(1)
                }else{
                  children.type = 0;
                  children.fillInName =source;
                }
                control.controlValue.listOfChildrenData.push(children);
            })
            templateCtx.TemplateCharts.push(control);
          })
          element.medaData =  templateCtx;
          element.id = index;
          this.eventBus.cast(EventBus.setPackingForm,element);
          this.setValueOfFileConfig(element,validateForm)
         });
    }

    private setValueOfFileConfig(pack:Packing,validateForm: FormGroup):void{
      pack.medaData.TemplateFiles.forEach((element,index)=>{
       validateForm.addControl(
        `${pack.id}_${index}_template_file_target`,
        new FormControl(element.controlValue.target, Validators.required)
      );
      validateForm.addControl(
        `${pack.id}_${index}_template_file_before`,
        new FormControl(element.controlValue.before)
      );
      validateForm.addControl(
        `${pack.id}_${index}_template_file_after`,
        new FormControl(element.controlValue.after)
      );
      })
      
      pack.medaData.TemplateImages.forEach((element,index)=>{
        validateForm.addControl(
          `${pack.id}_${index}_template_image_target`,
          new FormControl(element.controlValue.target, Validators.required)
        );
       })

       pack.medaData.TemplateCharts.forEach((element,index)=>{
        validateForm.addControl(
         `${pack.id}_${index}_template_charts_target`,
         new FormControl(element.controlValue.target, Validators.required)
       );
       })
    }
    public setRemoveOfFileConfig(pack:Packing,validateForm: FormGroup):void{
     if(pack.medaData==undefined){
         return;
     }
      pack.medaData.TemplateFiles.forEach((element,index)=>{
       validateForm.removeControl(`${pack.id}_${index}_template_file_target`);
       validateForm.removeControl(`${pack.id}_${index}_template_file_before`);
       validateForm.removeControl(`${pack.id}_${index}_template_file_after`);
      })
      pack.medaData.TemplateImages.forEach((element,index)=>{
        validateForm.removeControl(`${pack.id}_${index}_template_image_target`);
       })

       pack.medaData.TemplateCharts.forEach((element,index)=>{
        validateForm.removeControl(`${pack.id}_${index}_template_charts_target`);
       })
    }

  private clearDefaultImage(sources:string[],compiles:Compile[]):string[]{
    compiles.forEach(q=>{
      const search  = q.name.search('-');
      let tag ='';
      if(search>=0){
        tag = `{{ index .${q.name}_image }}`
      }
        tag =`{{ .${q.name}_image }}`
        sources = sources.filter(item => item != tag)
     });

        return sources;
  }

  private clearDefaultCharts(sources:string[],compiles:Compile[]):string[]{
    compiles.forEach(q=>{
      const search  = q.name.search('-');
      let tag ='';
      if(search>=0){
        tag = `{{ index .${q.name}_chart }}`
      }
        tag =`{{ .${q.name}_chart }}`
        sources = sources.filter(item => item != tag)
     });
   return sources;
  }

  private distinct(a:string[],b:string[]):string[]{
    let arr = a.concat(b);
    return arr.filter((item, index)=> {
        return arr.indexOf(item) === index
    })
  }

    public GetfileCompileList(validateForm: FormGroup): Compile[] {
      let fileCompileList: Compile[] = [];
      let controls = validateForm.controls;
    
      let compile = new Compile();
      let isNameExist: Boolean = false;
      let isBranchExist: Boolean = false;
      let isGitExist: Boolean = false;
      let isCompileFileContent: Boolean = false;
      let isTestTemplateMedata:boolean = false;
      for (const key in controls) {
        if (key.endsWith('_compile_name')) {
          isNameExist = true;
          compile.name = validateForm.get(key)?.value;
        }
        if (key.endsWith('_compile_branch')) {
          isBranchExist = true;
          compile.branch = validateForm.get(key)?.value;
        }
        if (key.endsWith('_compile_git')) {
          isGitExist = true;
          compile.git = validateForm.get(key)?.value;
        }
        if (key.endsWith('_compile_file_content')) {
          isCompileFileContent = true;
          compile.buildfileContent = validateForm.get(key)?.value;
        }
        if (key.endsWith('_compile_test_template_medata')) {
          isTestTemplateMedata = true;
          compile.testTemplate = validateForm.get(key)?.value;
        }

        if (isNameExist && isBranchExist && isGitExist && isCompileFileContent && isTestTemplateMedata) {
          fileCompileList.push(compile);
          compile = new Compile();
          isNameExist = false;
          isBranchExist = false;
          isGitExist = false;
          isCompileFileContent = false;
          isTestTemplateMedata = false;
        }
      }
      return fileCompileList;
    }
}