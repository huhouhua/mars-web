import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { BackendService } from 'src/app/pages/services/backend.service';
import { ApiResult, ApiResultType, Member, MemberRole, Option } from 'src/app/shared/common.type';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ActivatedRoute, Router } from '@angular/router';
import { NgEventBus } from 'ng-event-bus';
import { Coverage } from './unit-test-template/unit-test-template.component';


@Component({
  selector: 'app-unit-test-template-detail',
  templateUrl: './detail-unit-test-template.component.html',
  styleUrls: ['./detail-unit-test-template.component.less'],
})
export class UnitTestTemplateDetailComponent implements OnInit {
    public loading:boolean = false;
    public templateId: string ='';
    public testTemplate: any={};
    public unitTestTemplate: any={};
    public validateForm!: FormGroup;
    constructor(  
        private activeRouter: ActivatedRoute, 
        private eventBus: NgEventBus,
        private notification: NzNotificationService,
        private fb: FormBuilder,
        private router: Router,
        private backendService: BackendService) {
        }
    ngOnInit(): void {
      this.initForm();
        this.templateId = this.activeRouter.snapshot.paramMap.get('templateId')??'';
        this.getTestTemplate(); 
    }
    private getTestTemplate():void{
        this.loading = true;
        this.backendService.getTestTemplate<ApiResult>(this.templateId).subscribe(
          (res) => {
            if (res.code === ApiResultType.Success) {
              this.testTemplate = res.data.testTemplateViewModel;
              this.unitTestTemplate = res.data.unitTestTemplateViewModel;
              this.setForm(this.unitTestTemplate);
            }
            this.loading = false;
          },
          (err) => {
            this.loading = false;
          }
        );
      }

private initForm(){
    const group = {
        class_min: [0,Validators.required],
        class_max: [0,Validators.required],
        method_min: [0,Validators.required],
        method_max: [0,Validators.required],
        line_min: [0,Validators.required],
        line_max: [0,Validators.required],
        instruction_min: [0,Validators.required],
        instruction_max: [0,Validators.required],
        branch_min: [0,Validators.required],
        branch_max: [0,Validators.required],
      };
      this.validateForm = this.fb.group(group);
}
private setForm(unitTestTemplate:any){
       const  classData = unitTestTemplate.coverages.find((q:any)=>q.type == 4)
       const branchData = unitTestTemplate.coverages.find((q:any)=>q.type == 3)
       const lineData = unitTestTemplate.coverages.find((q:any)=>q.type == 2)
       const methodData =unitTestTemplate.coverages.find((q:any)=>q.type == 1)
       const instructionData = unitTestTemplate.coverages.find((q:any)=>q.type == 0)
       this.validateForm.get('class_min')?.setValue(classData.min);
       this.validateForm.get('class_max')?.setValue(classData.max);

       this.validateForm.get('method_min')?.setValue(methodData.min);
       this.validateForm.get('method_max')?.setValue(methodData.max);

       this.validateForm.get('line_min')?.setValue(lineData.min);
       this.validateForm.get('line_max')?.setValue(lineData.max);

       this.validateForm.get('instruction_min')?.setValue(instructionData.min);
       this.validateForm.get('instruction_max')?.setValue(instructionData.max);

       this.validateForm.get('branch_min')?.setValue(branchData.min);
       this.validateForm.get('branch_max')?.setValue(branchData.max);
}
public onEditClick(){
    this.eventBus.cast('edit-test-template');
}
get data():any{
    let coverages:Coverage[]=[
      new Coverage(
      this.validateForm.get('class_max')?.value,
      this.validateForm.get('class_min')?.value,
      4
    ),
    new Coverage(
      this.validateForm.get('method_max')?.value,
      this.validateForm.get('method_min')?.value,
      1
    ),
    new Coverage(
      this.validateForm.get('line_max')?.value,
      this.validateForm.get('line_min')?.value,
      2
    ),
    new Coverage(
      this.validateForm.get('instruction_max')?.value,
      this.validateForm.get('instruction_min')?.value,
      0
    ),
    new Coverage(
      this.validateForm.get('branch_max')?.value,
      this.validateForm.get('branch_min')?.value,
      3
    )];
    return {
      Coverages:coverages
    };
 }
submitForm() {
    this.loading = true;
    this.backendService.updateUnitTestTemplate<ApiResult>(this.templateId, this.data).subscribe(res=>{
      this.loading = false;
      if (res.code === ApiResultType.Success) {
        this.notification.success('提示',"保存成功!");
        this.router.navigateByUrl('/test-template/list');
      }
    },err=>{
      this.loading = false;
    });
  }
}