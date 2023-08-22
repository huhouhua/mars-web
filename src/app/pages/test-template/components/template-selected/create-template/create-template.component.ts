import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { BackendService } from 'src/app/pages/services/backend.service';
import { ApiResult, ApiResultType, Member, MemberRole, Option } from 'src/app/shared/common.type';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { from } from 'rxjs';
import { assign } from 'lodash-es';

@Component({
  selector: 'app-test-template-create.component',
  templateUrl: './create-template.component.html',
  styleUrls: ['./create-template.component.less'],
})
export class CreateTestTemplateComponent implements OnInit {
  @Input() cacheData:any;
  validateForm!: FormGroup;
  loading:boolean =false;
  types:Option[]= [{
    value:1,
    name:'Java',
  },
  {
    value:2,
    name:'Golang',
  },
  {
    value:4,
    name:'Vue',
  },
];
tags:any[]=[
  {
   color:'#2db7f5',
   type:'Product',
  },
  {
    color:'#87d068',
    type:'Test',
   },
   {
    color:'#108ee9',
    type:'Develop',
   }
]
  constructor( 
    private backendService: BackendService,
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private modal: NzModalRef) {

    }
  ngOnInit(): void {
    const group = {
      name: ['',Validators.required],
      type: [1,Validators.required],
      tag:  ['Product',Validators.required],
      description: [''],
    };
    this.validateForm = this.fb.group(group);
    this.validateForm.patchValue(this.cacheData);
  }
  
  get data():any{
     let item: any ={
       tags:[]=[this.validateForm.value.tag],
       category:2
     };

     Object.assign(item, this.validateForm.value);
     return item;
  }


  onCancel() {
    this.modal.triggerCancel();
  }
  submitForm() {
    this.loading = true;
    this.backendService.createTestTemplate<ApiResult>(this.data).subscribe(res=>{
      this.loading = false;
      if (res.code === ApiResultType.Success) {
        this.notification.success('提示',"创建成功!");
        this.modal.triggerOk();
      }
    },err=>{
      this.loading = false;
    });
  }
}
