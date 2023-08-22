import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
let { log, info, warn, error } = console;
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AccountService } from 'src/app/helpers/account.service';
import { UserService } from 'src/app/helpers/user.service';
import { ApiResult, ApiResultType } from 'src/app/shared/common.type';
import { addBodyStyle, removeBodyStyle } from 'src/app/shared/help';
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
export class LoginComponent implements OnInit,OnDestroy {

  public loading:boolean=false;
  private returnUrl:string ='';
  private isLogin:boolean = false;
  public validateForm!: FormGroup;
  public passwordVisible:Boolean = false;
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
    // 初始化
    async ngOnInit(): Promise<void> {
      this.clear();
      this.returnUrl = this.router.snapshot.queryParams['returnUrl'] || 'app/list';
      this.validateForm = this.login.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required]],
      });
    }
    ngOnDestroy(): void {
      removeBodyStyle();
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
      this.notification.warning('提示',`${this.parseError(err)}，登录失败，请检查账号和密码是否正确！`);
     })
  }
  private parseError(err:any):string{
      try {
        var obj = JSON.parse(err);
        if(obj?.error_description){
           return obj.error_description;
        }
      } catch (error) {
        
      }
      return '';
  }

  private clear():void{
    addBodyStyle();
    this.accountService.clear();
    this.userService.clear();
  }
}
