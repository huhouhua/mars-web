import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { BackendService } from 'src/app/pages/services/backend.service';
import {
  ApiResult,
  ApiResultType,
  Member,
  MemberRole,
  Option,
} from 'src/app/shared/common.type';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UserService } from 'src/app/helpers/user.service';
import { MetaData, NgEventBus } from 'ng-event-bus';
import { EditTestTemplateComponent } from './edit-template/edit-template.component';

@Component({
  selector: 'app-test-template-detail',
  templateUrl: './detail-template.component.html',
  styleUrls: ['./detail-template.component.less'],
})

export class TestTemplateDetailComponent implements OnInit {
  @Input() TemplateId: string = '';
  @Input() TestTemplate: any = {};
  @Input() public loading: boolean = false;
  constructor(
    private eventBus: NgEventBus,
    private modalService: NzModalService,
    private userService: UserService) {}

    ngOnInit(): void {
        this.eventBus.on("edit-test-template").subscribe((control: MetaData) => {
          this.opneEditModal();
       });
      }
  /**
   * 用户 id 转换 用户名字
   * @param id
   * @returns str
   */
   public getNameFunc(id: number): string {
    return this.userService.getNameFunc(id);
  }
   private  opneEditModal(){
    this.modalService.create({
        nzTitle:'编辑',
        nzWidth:650,
        nzMask:false,
        nzComponentParams:{
            TestTemplate:this.TestTemplate,
        },
        nzContent:EditTestTemplateComponent,
        nzOnOk:(ret)=>{
           this.TestTemplate = ret.NewTestTemplate; 
        },
      });
   }
}
