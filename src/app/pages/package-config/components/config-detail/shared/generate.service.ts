import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/shared/common.type';
import { FormGroup } from '@angular/forms';
import { cloneDeep, uniq, uniqBy } from 'lodash-es';
import {
  Compile,
  GenerateContext,
  GenerateTemplateContext,
  Packing,
  PackingTemplate,
  TemplateCharts,
  TemplateChartsControl,
  TemplateFile,
  TemplateFileControl,
  TemplateImage,
  TemplateImageControl,
  YamlAllData,
} from './options';
import { GenerateTemplateService } from './generate-template.service';
import * as YAML from 'js-yaml';
import { getTime } from 'src/app/shared/util/convert';
import { FormService } from './form.service';

@Injectable({
  providedIn: `root`,
})
export class GenerateService {
    constructor(private generateTemplateService: GenerateTemplateService,
      private formService:FormService){
        
    }
  private template: any = {
   apiVersion:2.1,
   product:{
    name:'',
    version:{
        prefix:'',
        stage:'',
        date:'',
        version:'',
    },
   },
   compile:[],
   packing:[],
  };
  templateItems = new Map<string,string>();
  testTemplate:any={
     version: 'v1',
     test:[]
  }

  public GenerateAllYaml(validateForm:FormGroup,projectList: any[] ):YamlAllData {
    let yaml = new YamlAllData();
     const  template =cloneDeep(this.template);
     const  testTemplate =cloneDeep(this.testTemplate);

    this.setBaseInfo(validateForm,template);
    this.setCompile(validateForm,projectList,template,testTemplate);
    this.setPacking(validateForm,template);
    yaml.productYaml = YAML.dump(template, {
        lineWidth: 5000,
      });
    yaml.packageItems = this.templateItems;
    yaml.testTemplateYaml = YAML.dump(testTemplate,{
      lineWidth: 5000,
    });
    return yaml;
  }

  private setBaseInfo(validateForm:FormGroup,template:any):void{
   let name = validateForm.get('name')?.value;
   let prefix =  validateForm.get('prefix')?.value;
   let stage =  validateForm.get('stage')?.value;
   let date = validateForm.get('date')?.value;
   let version =  validateForm.get('version')?.value;
   template.product.name = name ==null ? '':name;
   template.product.version.prefix = prefix ==null ? '':prefix;
   template.product.version.stage = stage ==null ? '':stage;
   template.product.version.date = date ==null ? '':date;
    if(template.product.version.date!=''){
        template.product.version.date = getTime(template.product.version.date as Date);
    }
   template.product.version.version = version ==null ? '':version;
   }

   private setCompile(validateForm:FormGroup,projectList: any[],template:any,testTemplate:any):void{
       let compileList = this.formService.GetfileCompileList(validateForm);
       compileList.forEach(element => {
            let obj ={
                name:element.name == null ? '': element.name,
                branch:element.branch == null ? '': element.branch,
                buildfile:element.buildfile,
                git:'',
            }
             const project = projectList.find(q=>q.id == element.git);
                if(project){
                    obj.git=project.ssh_url_to_repo;
                }
                template.compile.push(obj);
                let test:any = {
                   name:obj.name,
                   type:element.testTemplate.UnitTestTemplate.name,
                   unit:[] =[]
                } 
                element.testTemplate.UnitTestTemplate.coverages.forEach(cvg=>{
                  let coverage = {
                     counter:cvg.typeName.toLocaleUpperCase(),
                     value:cvg.value.toLocaleUpperCase(),
                     minimum:cvg.min == 100 ? 1: `0.${cvg.min}`,
                     maximum:cvg.max == 100 ? 1: `0.${cvg.max}`,
                  }
                  test.unit.push(coverage)
                })
                testTemplate.test.push(test);
        });
    }
    private setPacking(validateForm:FormGroup,template:any):void{
        let packageList = this.GeneratePackageItems(validateForm);
        packageList.forEach(element => {
            let obj ={
                os:element.packing.os == null ? '' : element.packing.os,
                arch:element.packing.arch == null ? '':element.packing.arch,
                type:element.packing.type ==null ? '':element.packing.type,
                template:element.packing.template ==null ? '':element.packing.template,
            }
            template.packing.push(obj);
            if(element.packing.template!=null && element.packing.template !=''){
                this.templateItems.set(obj.template,element.yamlData);   
            }
        });
    }
    public GeneratePackageItems(validateForm:FormGroup):PackingTemplate[]{
        let packingTemplateList: PackingTemplate[] = [];
        let controls = validateForm.controls;
        let template = new PackingTemplate();
        let isOsExist: Boolean = false;
        let isBranchExist: Boolean = false;
        let isTypeExist: Boolean = false;
        let isTemplate: Boolean = false;
        let isTemplateContent: Boolean = false;
        for (const key in controls) {
          if (key.endsWith('_packing_os')) {
            isOsExist = true;
            template.packing.os = validateForm.get(key)?.value;
          }
          if (key.endsWith('_packing_arch')) {
            isBranchExist = true;
            template.packing.arch = validateForm.get(key)?.value;
          }
          if (key.endsWith('_packing_type')) {
            isTypeExist = true;
            template.packing.type = validateForm.get(key)?.value;
          }
          if (key.endsWith('_packing_template')) {
            isTemplate = true;
            template.packing.template = validateForm.get(key)?.value;
          }
          if (key.endsWith('_packing_template_medaData')) {
            isTemplateContent = true;
            template.packing.medaData = validateForm.get(key)?.value;
          }
          if (isOsExist && isBranchExist && isTypeExist && isTemplate && isTemplateContent) {
            template.packing.id =Number(key.replace('_packing_template_medaData',''));
            template.yamlData =this.generateTemplateService.GenerateTemplateYaml(template.packing,validateForm,template.packing.medaData);
            packingTemplateList.push(template);
            template = new PackingTemplate();
            isOsExist =false;
            isBranchExist = false;
            isTypeExist = false;
            isTemplate = false;
            isTemplateContent = false;
          }
        }
        return packingTemplateList;
    }

}