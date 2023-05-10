import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { BackendService } from 'src/app/pages/services/backend.service';
import { ApiResult, ApiResultType, Member, MemberRole, Option } from 'src/app/shared/common.type';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-build-create',
  templateUrl: './create-build.component.html',
  styleUrls: ['./create-build.component.less'],
})
export class CreateBuildComponent implements OnInit {
  public itemStep: stepBuildContext = {
    step:0,
    item:{
      productId:0,
      name:'',
      jobName:'',
      platformUrl: 0,
      changeType: 'PACKAGED_FLOW',
      service:'',
      k8sName:'alpha',
      nameSpace:'',
      branch:'develop',
      packageType:0,
      fromVersion:'',
      toVersion:'',
    },
    // productList:[]=[],
    // isinitProductlist: true,
    // builderId :1,
  };


    // validateForm!: FormGroup;
    // platformOptions: Option[] = [
    //   { name: '产品级', value: 1 },
    //   { name: '组件级', value: 2 },
    //   { name: '外部依赖', value: 3 },
    // ];
    // loading:boolean =false;
    // constructor( 
    //     private backendService: BackendService,
    //     private fb: FormBuilder,
    //     private notification: NzNotificationService,
    //     private modal: NzModalRef) {
    
    //     }
    //     const group = {
    //       name: ['',Validators.required],
    //       code:['',Validators.required],
    //       productType: [1,Validators.required],
    //       description: [''],
    //     };
    //     this.validateForm = this.fb.group(group);
    ngOnInit(): void {

    }
    step(step:stepBuildContext){
      this.itemStep =step;
    }
}
export class stepBuildContext{
  // isinitProductlist:boolean =false;
  // productList: any[] =[];
  // builderId: number = 1;
  step : number =0;
  item: any;

}