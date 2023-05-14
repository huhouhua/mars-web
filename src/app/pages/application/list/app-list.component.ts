import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { zip as _zip, Subscription } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BackendService } from '../../services/backend.service';
import { ApiResult, ApiResultType, Option } from 'src/app/shared/common.type';
// import { UserService } from '@user/user-service';

@Component({
  selector: 'app-app-list',
  templateUrl: './app-list.component.html',
  styleUrls: ['./app-list.component.less'],
})

export class ApplistComponent implements OnInit {
  public colorList = ['#f56a00', '#1890ff', '#7265e6', '#ffbf00', '#00a2ae', '#00a2ae'];
  public apps: any[] = [];
  public loading = true;
  public teams:any[]=[];
  public query:Query ={
    pageSize: 9999,
    appName: '',
    teamIds: [],
  };

  public inputValue: string = '@afc163';
  public suggestions = ['afc163', 'benjycui', 'yiminghe', 'RaoHai', '中文', 'にほんご'];

  public teamList:any[] =[
    {
       
        value:1,
        status: false,
        name:"中间件团队"
    },
    {
        value:2,
        status: false,
        name:"架构团队"
    },
    {
        value:3,
        status: false,
        name:"数据中团队"
    },
    {
        value:4,
        status: false,
        name:"DevOps团队"
    },
    {
        value:5,
        status: false,
        name:"大数据团队"
    },
  ];

  constructor(
    public msg: NzMessageService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private backendService: BackendService,
    private activatedRoute: ActivatedRoute,
  ) // private userService: UserService,
  {}

  async ngOnInit() {
    // if (this.userService.getCurrentUsers().size === 0) {
    //   await this.userService.loadUsers();
    // }
    this.getappList();
  }



  getappList() {
    this.loading = true;
    this.backendService.applicationList<ApiResult>(this.query).subscribe(res => {
      this.loading = false;
      if (res.status === ApiResultType.Success) {
        this.apps = res.data.applicationLists;
      }
    });
  }

  changeTeam(status: boolean, item: any) {
    console.log(item);
    this.selectedTeam(status, item);
    this.getappList();
  }
  getTeams(id:number):string {
    return this.teamList.find(q=>q.value == id).name;
  }
  selectedTeam(status: boolean, item:any) {
    if (status) {
      this.query.teamIds.unshift(item.value);
    } else {
      this.query.teamIds = this.query.teamIds.filter(t => t !== item.value);
    }
  }

  goApp(id:string) {
    this.router.navigateByUrl(`/app-list/detail/${id}`);
  }

  search() {
    this.getappList();
  }
}
class Query{
  pageSize:number =9999;
  appName:string = '';
  teamIds: number[] =[];
}