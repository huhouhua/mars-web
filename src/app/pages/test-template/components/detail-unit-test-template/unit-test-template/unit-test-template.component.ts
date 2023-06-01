import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { BackendService } from 'src/app/pages/services/backend.service';
import { ApiResult, ApiResultType, Member, MemberRole, Option } from 'src/app/shared/common.type';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MetaData, NgEventBus } from 'ng-event-bus';

@Component({
  selector: 'app-unit-test-template',
  templateUrl: './unit-test-template.component.html',
  styleUrls: ['./unit-test-template.component.less'],
})

export class UnitTestTemplateComponent implements OnInit {
  @Input() TemplateId: string = '';
  @Input() public validateForm!: FormGroup;
    

    constructor( 
        private backendService: BackendService,
        private fb: FormBuilder,
        private eventBus: NgEventBus,
        private notification: NzNotificationService) {
    
        }
    ngOnInit(): void {

   
    }
    formatterPercent = (value: number): string => `${value} %`;


    
  }



  export class Coverage{
    constructor(max:number,min:number,type:number){
      this.max = max;
      this.min = min;
      this.type = type;
    }
    type:number;
    max:number;
    min:number;
  }