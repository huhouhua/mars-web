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
  listOfMenu: readonly Menu[] = [];
  currentSelectedOfBreadcrumb: readonly Breadcrumb[] =[];
  constructor(private accountService:AccountService){}
  ngOnInit(): void {
      this.userName = this.accountService.userName;
      this.initListOfMenu();
  }
  public onlogOut(){
    this.accountService.logout();
  }

  private initListOfMenu(){
  
    const tool = {
      name: "工具箱",
      icon:"tool",
      isOpen: true,
      router:"",
      breadcrumb:[] =[],
      children:[
        {
          name: "构建器",
          icon:"",
          isOpen: true,
          router:"/build-list",
          children:[]=[],
          breadcrumb:[] =[],
        },
        {
          name: "包配置",
          icon:"",
          isOpen: true,
          router:"/package-config-list",
          children:[]=[],
          breadcrumb:[] =[],
        }
      ]
    };

    const arr = new Array<Menu>();
    arr.push(tool)
    
    const openMenu= arr.find(q=>q.isOpen);
      if(openMenu!=null){
          this.breadcrumbOfSelected(openMenu.children);
      }
     this.listOfMenu = arr;
  }

 public onRouter(menu:Menu){
    this.currentSelectedOfBreadcrumb = menu.breadcrumb.sort(q=>q.order);
  }
  
  private breadcrumbOfSelected(menuList:Menu[]){
    if(menuList == null){
      return;
    }
    const children = menuList.find(q=>q.isOpen);
    if(children!=null){
      this.currentSelectedOfBreadcrumb =children.breadcrumb.sort(q=>q.order);
    }
  }
  public onCollapsed(){
    this.isCollapsed = !this.isCollapsed;
  }
}
interface Menu{
  name: string
  icon: string
  isOpen: boolean
  router: string
  breadcrumb:Breadcrumb[]
  children:Menu[]
}
interface Breadcrumb{
   name:string
   order:number
   router: string
   icon: string
}