import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { BackendService } from 'src/app/pages/services/backend.service';
import { ApiResult, ApiResultType, Member, MemberRole, Option } from 'src/app/shared/common.type';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-edit-test-template',
  templateUrl: './edit-template.component.html',
  styleUrls: ['./edit-template.component.less'],
})
export class EditTestTemplateComponent implements OnInit {

    @Input() TestTemplate:any ={};
    @Input()  public loading:boolean = false;
    NewTestTemplate:any={};
     validateForm!: FormGroup;
    private cacheData:any;

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
        private modal: NzModalRef,
        private notification: NzNotificationService,
    ){ }
    ngOnInit(): void {
        const group = {
            name: ['',Validators.required],
            type: [1,Validators.required],
            tag:  ['Product',Validators.required],
            description: [''],
          };
          this.validateForm = this.fb.group(group);
          this.validateForm.patchValue(this.TestTemplate);
    }

    get data():any{
        let item: any ={
          tags:[]=[this.validateForm.value.tag],
          category:2,
        };
        
        Object.assign(item, this.validateForm.value);
        return item;
     }
     onCancel() {
        this.modal.triggerCancel();
      }
     submitForm() {
        this.loading = true;
        this.backendService.updateTestTemplate<ApiResult>( this.TestTemplate.id, this.data).subscribe(res=>{
          this.loading = false;
          if (res.code === ApiResultType.Success) {
            this.NewTestTemplate = res.data.testTemplateViewModel;
            this.notification.success('提示',"编辑成功!");
            this.modal.triggerOk();
          }
        },err=>{
          this.loading = false;
        });
      }
}