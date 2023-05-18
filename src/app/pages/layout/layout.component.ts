import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/helpers/account.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less']
})
export class LayoutComponent  implements OnInit{
  isCollapsed = false;
  public userName:string | undefined;
  constructor(private accountService:AccountService){}
  ngOnInit(): void {
      this.userName = this.accountService.userName;
  }
  public onlogOut(){
    this.accountService.logout().subscribe(res=>{
    });
  }
}
