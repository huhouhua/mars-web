import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BackendService } from 'src/app/pages/services/backend.service';
import { ApiResult, ApiResultType, Option } from 'src/app/shared/common.type';
import { stepBuildContext } from '../create-build.component';

@Component({
  selector: 'app-create-build-step2',
  templateUrl: './create-build-step2.component.html',
  styleUrls: ['./create-build-step2.component.less'],
})
export class CreateBuildStep2Component implements OnInit {
    public listLoading:boolean =false;
    @Input() public stepContext: stepBuildContext ={
        step:0,
        item:{},
        // productList:[],
        // isinitProductlist: false,
        // builderId:1,
    };
    public fromVersionlist:any[] =[]
    public toVersionList:any[] =[]

    public productList:Option[] =[
        {
            value:0,
            name:"乐享"
        },
        {
            value:1,
            name:"产品2"
        },
        {
            value:2,
            name:"产品3"
        },
        {
            value:3,
            name:"产品4"
        }
      ];

     @Output() onStep: EventEmitter<stepBuildContext> = new EventEmitter<stepBuildContext>();
     public validateForm!: FormGroup;
     constructor(private fb: FormBuilder, private backendService: BackendService){
       
     }
     ngOnInit(): void {
        console.log(this.stepContext);
       const group = {
          productId: [0,Validators.required],
          fromVersion: ['',Validators.required],
          toVersion:['',Validators.required],
          description: [''],
         };
         
         this.validateForm = this.fb.group(group);
         this.validateForm.patchValue(this.stepContext.item);
         this.getfromVersionList();
         this.gettoVersionList();
     }
   
     public getfromVersionList(){
        this.listLoading = true;
        this.backendService.fromVersionList<ApiResult>(this.stepContext.item.platformUrl,this.stepContext.item.jobName).subscribe(res => {
           this.listLoading = false;
           if (res.code === ApiResultType.Success) {
            this.fromVersionlist = res.data;
          }
        },err=>{
          this.listLoading = false;
        });
     }
     public gettoVersionList(){
        this.listLoading = true;
        this.backendService.toVersionList<ApiResult>(this.stepContext.item.platformUrl,this.stepContext.item.jobName).subscribe(res => {
           this.listLoading = false;
           if (res.code === ApiResultType.Success) {
            this.toVersionList = res.data;
          }
        },err=>{
          this.listLoading = false;
        });
     }
     public next() {
        Object.assign(this.stepContext.item, this.validateForm.value);
        ++this.stepContext.step;
   
        this.onStep.emit(this.stepContext)
      
     }
   
     public pre(){
       --this.stepContext.step;
       this.onStep.emit(this.stepContext)
     }
   
}