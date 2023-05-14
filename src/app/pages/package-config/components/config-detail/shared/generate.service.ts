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

@Injectable({
  providedIn: `root`,
})
export class GenerateService {
    constructor(private generateTemplateService: GenerateTemplateService){
        
    }
  private template: any = {
   apiVersion:"2.0",
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
  
  public GenerateAllYaml(validateForm:FormGroup,projectList: any[] ):YamlAllData {
    let yaml = new YamlAllData();
    const  template =cloneDeep(this.template);
    this.setBaseInfo(validateForm,template);
    this.setCompile(validateForm,projectList,template);
    this.setPacking(validateForm,template);
    yaml.productYaml = YAML.dump(template, {
        lineWidth: 5000,
      });
    yaml.packageItems = this.templateItems;
    return yaml;
  }

  private setBaseInfo(validateForm:FormGroup,template:any):void{
   let name = validateForm.get('name')?.value;
   let prefix =  validateForm.get('prefix')?.value;
   let stage =  validateForm.get('stage')?.value;
   let date = validateForm.get('date')?.value;
   let version =  validateForm.get('version')?.value;
   template.product.name = name ==null ? '':name;
   template.product.prefix = prefix ==null ? '':prefix;
   template.product.stage = stage ==null ? '':stage;
   template.product.date = date ==null ? '':date;
    if(template.product.date!=''){
        template.product.date = getTime(template.product.date as Date);
    }
   template.product.version = version ==null ? '':version;
   }

   private setCompile(validateForm:FormGroup,projectList: any[],template:any):void{
       let compileList = this.GetfileCompileList(validateForm);
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
    public GetfileCompileList(validateForm: FormGroup): Compile[] {
        let fileCompileList: Compile[] = [];
        let controls = validateForm.controls;
      
        let compile = new Compile();
        let isNameExist: Boolean = false;
        let isBranchExist: Boolean = false;
        let isGitExist: Boolean = false;
        let isCompileFileContent: Boolean = false;
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
          if (isNameExist && isBranchExist && isGitExist && isCompileFileContent) {
            fileCompileList.push(compile);
            compile = new Compile();
            isNameExist = false;
            isBranchExist = false;
            isGitExist = false;
            isCompileFileContent = false;
          }
        }
        return fileCompileList;
      }
}