import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { BackendService } from 'src/app/pages/services/backend.service';
import { ApiResult, ApiResultType, Member, MemberRole, Option } from 'src/app/shared/common.type';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CreateTestTemplateComponent } from './create-template/create-template.component';

@Component({
  selector: 'app-template-create',
  templateUrl: './template-selected.component.html',
  styleUrls: ['./template-selected.component.less'],
})
export class TestTemplateSelectedComponent implements OnInit {
  
    private cacheData:any;
    constructor( 
        private backendService: BackendService,
        private fb: FormBuilder,
        private notification: NzNotificationService,
        private modalService: NzModalService,
        private modal: NzModalRef) {
    
        }
    ngOnInit(): void {
      this.cacheData = {
        name: '',
        type: 1,
        tags: 'Product',
        description: '',
      };
    }

    unitTestClick(){
        this.modalService.create({
            nzTitle:'单元测试模板',
            nzWidth:650,
            nzMask:false,
            nzComponentParams:{
                    cacheData:this.cacheData,
            },
            nzContent:CreateTestTemplateComponent,
            nzOnOk:(ret)=>{
            this.modal.triggerOk();
            },
          });
    }
}