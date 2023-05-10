import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BackendService } from 'src/app/pages/services/backend.service';
import { ApiResult, ApiResultType, Member, MemberRole, Option } from 'src/app/shared/common.type';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-package-config-detail.component',
  templateUrl: './config-detail.component.html',
  styleUrls: ['./config-detail.component.less'],
})
export class PackageConfigDetailComponent implements OnInit {
  validateForm!: FormGroup;
  loading:boolean =false;
  private packageConfigId:string ='';
  constructor( 
    private backendService: BackendService,
    private fb: FormBuilder,
    private activeRouter: ActivatedRoute,
    private notification: NzNotificationService) {

    }
  ngOnInit(): void {
    this.packageConfigId = this.activeRouter.snapshot.paramMap.get('configId')??'';
    const group = {
        name: ['',Validators.required],
        prefix: ['',Validators.required],
        stage: ['',Validators.required],
        date: [null,Validators.required],
        version: [null,Validators.required],
      };
      this.validateForm = this.fb.group(group);
  }

  public handleClick(e: string):void{
    console.log(e);
  }

  public submitForm(){

  }
}