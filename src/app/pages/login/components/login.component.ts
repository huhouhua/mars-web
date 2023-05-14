import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
let { log, info, warn, error } = console;
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiResult, ApiResultType } from 'src/app/shared/common.type';
import { BackendService } from '../../services/backend.service';

interface loginModel{
  username: string;
  password: string;
}

@Component({
  selector: 'app-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  public loading:boolean=false;
  constructor(
    public login: FormBuilder,
    public backendService:BackendService,
    private notification: NzNotificationService,
    private router: Router,
    private message: NzMessageService
  ) {

  }
  JSON = JSON;
  public validateForm!: FormGroup;
  public passwordVisible:Boolean = false;
    // 初始化
    ngOnInit(): void {
      this.validateForm = this.login.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required]],
      });
    }
    
  // 提交表单
  onSubmit():void{
    this.loading = true;
    const userName = this.validateForm.get('username')?.value;
    const passowrd = this.validateForm.get('password')?.value;

    this.backendService.login<ApiResult>(userName,passowrd).subscribe(res=>{
      if (res.status === ApiResultType.Success) {
        this.router.navigateByUrl(`home`);
        return;
      }
      this.loading = false;
    },err=>{
      this.loading = false;
      this.notification.error('错误',`${err.error.message}，登录失败！`);
    });
  }
}
