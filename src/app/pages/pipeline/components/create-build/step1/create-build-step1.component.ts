import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BackendService } from 'src/app/pages/services/backend.service';
import { ApiResult, ApiResultType, Option } from 'src/app/shared/common.type';
import { stepBuildContext } from '../create-build.component';

@Component({
  selector: 'app-create-build-step1',
  templateUrl: './create-build-step1.component.html',
  styleUrls: ['./create-build-step1.component.less'],
})
export class CreateBuildStep1Component implements OnInit {
    public listLoading:boolean =false;

 @Input() public stepContext: stepBuildContext ={
        step:0,
        item:{},
        // productList:[],
        // isinitProductlist: false,
        // builderId:1,
 };
 @Output() onStep: EventEmitter<stepBuildContext> = new EventEmitter<stepBuildContext>();

 public packageTypelist:Option[] =[
    {
        value:0,
        name:"安装包"
    },
    {
        value:1,
        name:"升级包"
    },
    {
        value:2,
        name:"补丁包"
    },
    {
        value:3,
        name:"外置"
    }
  ];
  public jobNameList:any[]=[
    
  ]
 public platformlist:any[]=[
    {
        value:0,
        showName:"http://172.17.162.205:30080(开发)",
        name:"http://172.17.162.205:30080"
    },
    {
        value:1,
        showName:"http://172.17.162.111:30080(预生产)",
        name:"http://172.17.162.111:30080",
    },
    {
        value:2,
        showName:"http://172.17.162.86:30080(生产)",
        name:"http://172.17.162.86:30080",
    },
    {
      value:3,
      showName:"http://172.17.189.241:30080",
      name:"http://172.17.189.241:30080",
  },
 ];
  public validateForm!: FormGroup;
  constructor(private fb: FormBuilder, private backendService: BackendService){
    
  }
  ngOnInit(): void {
     console.log(this.stepContext);
    const group = {
        name: ['',Validators.required],
        packageType: ['',Validators.required],
        platformUrl:['',Validators.required],
        jobName:['',Validators.required],
        description: [''],
      };
      
      this.validateForm = this.fb.group(group);
      this.validateForm.patchValue(this.stepContext.item);
      if(this.stepContext.item.platformUrl!=''){
        this.getjobList(this.stepContext.item.platformUrl);
      }
  }

  public getjobList( platformUrl:string){
    this.listLoading = true;
    this.backendService.jobList<ApiResult>(platformUrl).subscribe(res => {
       this.listLoading = false;
      if (res.code === ApiResultType.Success) {
        this.jobNameList = res.data.jobs;
      }
    },err=>{
      this.listLoading = false;
    });
  
  }

  public onSelect(name:string){
    this.getjobList(name);
}

  public next() {
    Object.assign(this.stepContext.item, this.validateForm.value);
     ++this.stepContext.step;
     this.onStep.emit(this.stepContext);
  }

}
