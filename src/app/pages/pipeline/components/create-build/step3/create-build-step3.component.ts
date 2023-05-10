import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BackendService } from 'src/app/pages/services/backend.service';
import { ApiResult, ApiResultType, Option } from 'src/app/shared/common.type';
import { stepBuildContext } from '../create-build.component';

@Component({
  selector: 'app-create-build-step3',
  templateUrl: './create-build-step3.component.html',
  styleUrls: ['./create-build-step3.component.less'],
})
export class CreateBuildStep3Component implements OnInit {
  public loading = false;
  public initDatabase:boolean =false;
  public description:string ='';
  public initdep:boolean =false;
  @Input() public stepContext: stepBuildContext ={
    step:0,
    item:{},
    // productList:[],
    // isinitProductlist: false,
    // builderId:1
};


@Output() onStep: EventEmitter<stepBuildContext> = new EventEmitter<stepBuildContext>();

public changeTypelist:any[] =[
  {
      name:"PACKAGED_FLOW",
      description:'根据已经合并至develop分支代码定时或者手动出直接产出安装包、升级包并发版本。'
  },
  {
      name:"INTEGRATED_FLOW",
      description:'模拟流水线集成服务目标分支为develop的push事件，集成平台自动集成产品并打包，产出安装包、升级包并发版本。'
  },
  {
      name:"WHOLE_FLOW",
      description:'模拟流水线常规服务目标位置为develop的push事件，经历完整的CI/CD流程、产出安装包、升级包并发版本。'
  },
  {
      name:"FIX_FLOW",
      description:' 模拟流水线常规目标位置为master的push事件，经历不完整的CI/CD流程、直达预生产和生产环境，产出安装包、升级包并发版本。'
  },
  {
    name:"REBASE",
    description:'重新生成基础镜像。'
},
{
  name:"DEPLOY_FLOW",
  description:'工具流水线：部署指定环境'
},
{
  name:"BUILD_FLOW",
  description:'工具流水线：构建镜像阶段'
},
{
  name:"UNIT_TEST_FLOW",
  description:'工具流水线：单元测试'
},
{
  name:"API_TEST_FLOW",
  description:'工具流水线：接口测试'
},
{
  name:"SONAR_TEST_FLOW",
  description:'工具流水线：测试sonar'
},
{
  name:"QUOTA_TEST_FLOW",
  description:'工具流水线：测试配额'
}
];
public servicelist:any[]=[
  {
    name:'mdc',
  },
  {
    name:'ccs',
  },
  {
    name:'dcs-auto',
  },
  {
    name:'dcs-go',
  },
  {
    name:'appserver',
  },
  {
    name:'ruleengine',
  },
  {
    name:'frontend',
  },
  {
    name:'uicbbbackend',
  },
  {
    name:'cbb',
  },
  {
    name:'hardware',
  },
  {
    name:'demeter',
  },
  {
    name:'cornucopia',
  },
]
public k8slist:any[]=[
  {
    name:'alpha',
  },
  {
    name:'staging',
  },
  {
    name:'preprod',
  }
]
public validateForm!: FormGroup;
constructor(
  private backendService: BackendService,
  private notification: NzNotificationService,
  private router: Router,
  private modal: NzModalRef,
  private fb: FormBuilder){}
ngOnInit(): void {
   console.log(this.stepContext);
  const group = {
    changeType: ['',Validators.required],
    service: [''],
    k8sName:['',Validators.required],
    nameSpace:['',Validators.required],
    branch: ['',Validators.required],
    };
    
    this.validateForm = this.fb.group(group);
    this.validateForm.patchValue(this.stepContext.item);
    const changetype = this.changeTypelist.find(q=>q.name == this.stepContext.item.changeType);
    if(changetype!=null){
      this.description =changetype.description;
    }
     
}
public pre(){
  Object.assign(this.stepContext.item, this.validateForm.value);
  --this.stepContext.step;

  this.onStep.emit(this.stepContext)
}
public create(){
   Object.assign(this.stepContext.item, this.validateForm.value);
  let data:any={}
  Object.assign(data,this.stepContext.item);
   this.loading = true;
      this.backendService.createBuild<ApiResult>(data).subscribe(res => {
          this.loading = false;
         if (res.status === ApiResultType.Success) {
          this.notification.success('提示',"创建成功");
          this.modal.triggerOk();
         }
   },err=>{
      this.loading = false;
      
   });
}
public onSelect(name:string){
  const changetype = this.changeTypelist.find(q=>q.name == name);
  if(changetype!=null){
    this.description =changetype.description;
  }
}
}
