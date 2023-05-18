import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
let { log, info, warn, error } = console;
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AccountService } from 'src/app/helpers/account.service';
import { UserService } from 'src/app/helpers/user-service';
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
  private returnUrl:string ='';
  private isLogin:boolean = false;
  constructor(
    public login: FormBuilder,
    public backendService:BackendService,
    private notification: NzNotificationService,
    private route: Router,
    private router:ActivatedRoute,
    private message: NzMessageService,
    private userService: UserService,
    private accountService:AccountService,
  ) {
  }
  public validateForm!: FormGroup;
  public passwordVisible:Boolean = false;
    // 初始化
    async ngOnInit(): Promise<void> {
      this.accountService.logout();
      this.userService.clear();
      this.returnUrl = this.router.snapshot.queryParams['returnUrl'] || 'build-list';
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
     this.accountService.login(userName,passowrd).subscribe(res=>{
           this.userService.loadUsers().then(res=>{
            
           });

          this.route.navigate([this.returnUrl]);
          this.loading = false;
          return;
     },err=>{
      this.loading = false;
      this.notification.error('错误',`${err.error.message}，登录失败！`);
     })
  }
}
