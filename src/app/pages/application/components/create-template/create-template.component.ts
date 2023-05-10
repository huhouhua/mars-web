import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { BackendService } from 'src/app/pages/services/backend.service';
import { ApiResult, ApiResultType, Member, MemberRole, Option } from 'src/app/shared/common.type';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-create-template',
  templateUrl: './create-template.component.html',
  styleUrls: ['./create-template.component.less'],
})
export class CreateTemplateComponent implements OnInit {
  @Input() applicationId: string ='';

  validateForm!: FormGroup;
  loading:boolean =false;
  transferTitles: string[] = ['人员列表', '产品组成员'];
  typeOptions: Option[] = [
    { name: '结构化配置模版', value: 1 },
    { name: 'raw配置模版', value: 2 },
    { name: '微服务模板', value: 3 },
    { name: '测试部署模板', value: 4 },
  ];
  allMembers:Member[]=[]
  constructor( 
    private backendService: BackendService,
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private modal: NzModalRef) {

    }
  ngOnInit(): void {
    const group = {
      name: ['',Validators.required],
      type:[1,Validators.required],
      description: [''],
    };
    this.validateForm = this.fb.group(group);
  }
  
  get data():any{
      const d = this.validateForm.value;
      const type = this.typeOptions.find(
        (q) => q.value == this.validateForm.get('type')?.value
      );
      if (type != undefined) {
        d.type = type.value;
      }
      d.applicationId = this.applicationId;
      return d;
  }


  onCancel() {
    this.modal.triggerCancel();
  }
  submitForm() {
    console.log(this.data);

    this.loading = true;
    this.backendService.createTemplate<ApiResult>(this.data).subscribe(res=>{
      this.loading = false;
      if (res.status === ApiResultType.Success) {
        this.notification.success('提示',"创建成功");
        this.modal.triggerOk();
      }
    },err=>{
      this.loading = false;
    });
  }
}
