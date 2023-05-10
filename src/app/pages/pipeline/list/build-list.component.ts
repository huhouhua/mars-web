import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { zip as _zip, Subscription } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BackendService } from '../../services/backend.service';
import { ApiResult, ApiResultType, Option } from 'src/app/shared/common.type';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FormBuilder } from '@angular/forms';
import { CreateBuildComponent } from '../components/create-build/create-build.component';
// import { UserService } from '@user/user-service';

@Component({
  selector: 'app-build-list',
  templateUrl: './build-list.component.html',
  styleUrls: ['./build-list.component.less'],
})

export class BuildlistComponent implements OnInit {

  public loadData:boolean =false;
  public visible = false;
  public selectedIndex:number =0;
  public buildLogData: object={};
  public buildLogId:string ="";
    constructor(private fb: FormBuilder,
        private modal:NzModalService,
        private backendService: BackendService,
        private router: Router,
        private changeDetector: ChangeDetectorRef){
        
      }

    ngOnInit(): void {
        
    }
    selected(index:number){
      console.log(index);
      this.selectedIndex =index;
      this.loadData =true;
    }
    selectChange(data:any){
        console.log(data);
    }
    onBuildLogData(event:any) {
      console.log(event);
      this.buildLogData = event;
    }
  
    showBuildLog(data:any) {
      console.log(data);
      this.visible = true;
      this.buildLogId = data.id;
    }
}