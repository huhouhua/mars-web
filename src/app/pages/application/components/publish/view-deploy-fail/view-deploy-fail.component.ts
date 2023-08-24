import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnInit,
    ViewChild,
  } from '@angular/core';
  import { FormBuilder } from '@angular/forms';
  import { Router } from '@angular/router';
  import { NgEventBus } from 'ng-event-bus';
  import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
  import { NzNotificationService } from 'ng-zorro-antd/notification';
  import { BackendService } from 'src/app/pages/services/backend.service';
  import * as YAML from 'js-yaml';
  import { NzDrawerRef } from 'ng-zorro-antd/drawer';
  @Component({
    selector: 'app-view-deploy-fail',
    templateUrl: './view-deploy-fail.component.html',
    styleUrls: ['./view-deploy-fail.component.less'],
  })
  export class ViewAppDeployFailComponent implements OnInit {
    @Input() providerToYaml: string ='';
    @Input() err: string ='';
    public options = {
      lineNumbers: true,
      readOnly: true, // nocursor can not copy
      mode: 'yaml',
      autofocus: true,
      lineWiseCopyCut: true,
      theme: 'material',
      //cursorBlinkRate: 500 // hide cursor
    };
    constructor(
      private modal: NzDrawerRef,
    ) {}
  
    ngOnInit(): void {
        
    }


    cancel() {
      this.modal.close();
    }
    
  }
  