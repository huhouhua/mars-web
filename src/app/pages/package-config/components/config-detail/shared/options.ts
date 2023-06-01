 
 import { FormGroup } from "@angular/forms";
import { type } from "os";
import { Coverage } from "src/app/pages/test-template/components/detail-unit-test-template/unit-test-template/unit-test-template.component";
import { Option } from "src/app/shared/common.type";

export const OsOptions:string[] =[
  "CentOS",
  "Kylin",
  "openEuler"
]
 export const ArchOptions:string[] =[
    "arm64",
    "amd64"
  ]
  export const PackageOptions:string[] =[
    "install",
    "upgrade",
    "patch"
  ]
  export const TypeOptions:Option[] =[
    {
        name:'自定义',
        value:0,
    },
    {
        name:'builderFile',
        value:1,
    }
  ];

  export class GenerateContext{
    name:string ='';
    prefix:string ='';
    stage:string='';
    date:string='';
    version: string='';
  }

  export class GenerateTemplateContext{
    constructor(){
      this.TemplateCharts =[];
      this.TemplateFiles=[];
      this.TemplateImages=[];
    }
    TemplateFiles:TemplateFileControl[]=[];
    TemplateImages:TemplateImageControl[]=[];
    TemplateCharts:TemplateChartsControl[]=[];
 }
 export class GenerateTestContext{
  constructor(){
      
  }
  id:number = 0;
  UnitTestTemplate:UnitTestTemplate = new UnitTestTemplate();
 }

 export class UnitTestTemplate{
      type:number = 1;
      name:string ='';
      id:string ='';
      coverages:CoverageTemplate[] =[];
 }
export class CoverageTemplate extends Coverage{
  typeDescription:string= '';
  typeName:string ='';
  value: string ='';
}
  export class CompileControl {
    id: number = 0;
    brancheLoading: boolean = false;
    controlValue: Compile = new Compile();
    branches: any[] = [];
  }
  export class Compile {
    name: string = '';
    git: string = '';
    branch: string = '';
    buildfileContent:any[]=[];
    testTemplate:GenerateTestContext = new GenerateTestContext();
    buildfile: string = 'Buildfile.yml';
  }


  export class PackingControl {
    controlValue: Packing = new Packing();
  }
  export class Packing {
    id: number = 0;
    os: string = '';
    arch: string = '';
    type: string = '';
    template: string='';
    medaData:GenerateTemplateContext = new GenerateTemplateContext();
  }
  

  export class TemplateChartsControl {
    expand:boolean =false;
    controlValue: TemplateCharts = new TemplateCharts();
  }
  export class TemplateCharts {
   id: number = 0;
   target: string = '';
   before: string = '';
   after: string = '';
   listOfChildrenData:ChildrenData[] =[];
  }

  export class TemplateImageControl {
    expand:boolean =false;
    controlValue: TemplateImage = new TemplateImage();
  }
  export class TemplateImage {
   id: number = 0;
   target: string = '';
   before: string = '';
   after: string = '';
   listOfChildrenData:ChildrenData[] =[];
  }

  export class TemplateFileControl {
    expand:boolean =false;
    controlValue: TemplateFile = new TemplateFile();
  }
  export class TemplateFile {
   id: number = 0;
   target: string = '';
   before: string = '';
   after: string = '';
   listOfChildrenData:ChildrenData[] =[];
  }


  export class ChildrenData{
       id:number=0;
      name: string = '';
      fillInName:string='';
      type:number=0;
  }
  export class PackingTemplate{
    packing:Packing =new Packing();
    yamlData: string ='';
  }
  export class YamlAllData{
    productYaml: string ='';
    packageItems = new Map<string,string>();
    testTemplateYaml:string ='';
  }
  export class ComplieProject{
     gitLabProjectId:number =0;
     sshUrlRepo:string ='';
     unitTestTemplate:any={
       id:0,
       type:0
     }
  }