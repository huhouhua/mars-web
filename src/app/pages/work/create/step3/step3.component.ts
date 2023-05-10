import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BackendService } from 'src/app/pages/services/backend.service';
import { ApiResult, ApiResultType, Option } from 'src/app/shared/common.type';
import { stepContext } from '../create.component';


@Component({
    selector: 'app-create-step3',
    templateUrl: './step3.component.html',
    styleUrls: ['./step3.component.less'],
  })
export class CreateStep3Component implements OnInit {
    @Input() public stepContext: stepContext ={
      step:0,
      item:{},
      productList:[],
      isinitProductlist: false,
      builderId:1
  };
  public buildList:Option[] =[
    {
        value:1,
        name:"新包构建器"
    },
    {
        value:2,
        name:"老包构建器"
    },
  ];

   @Output() onStep: EventEmitter<stepContext> = new EventEmitter<stepContext>();

   public validateForm!: FormGroup;
   public loading = false;


   constructor(
    private backendService: BackendService,
    private notification: NzNotificationService,
    private router: Router,
    private fb: FormBuilder){}


    ngOnInit(): void {
        const group = {
            builderId: [this.stepContext.builderId,Validators.required],
          };
           this.validateForm = this.fb.group(group);
    }

    public pre(){
        --this.stepContext.step;
        this.onStep.emit(this.stepContext)
      }

    public create(){
        let data:any={}
        Object.assign(data,this.stepContext.item);
         data.productIds = this.stepContext.productList.map(q=>q.id);
         data.builderId = this.stepContext.builderId;
         
         this.loading = true;
            this.backendService.createApplication<ApiResult>(data).subscribe(res => {
                this.loading = false;
               if (res.status === ApiResultType.Success) {
                this.notification.success('提示',"创建成功");

                this.router.navigateByUrl(`/app-list/detail/${res.appid}`);
               }
         },err=>{
            this.loading = false;
         });
    }
}