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
    selector: 'app-view-deploy',
    templateUrl: './view-deploy.component.html',
    styleUrls: ['./view-deploy.component.less'],
  })
  export class ViewAppDeployComponent implements OnInit {
    @Input() release!: any;
    @Input() providerToYaml!: string;
    public providerYaml: string='';
    public notes:string ='';
    public valuesToYaml:string='';
    public options = {
      lineNumbers: true,
      readOnly: true, // nocursor can not copy
      mode: 'yaml',
      autofocus: true,
      lineWiseCopyCut: true,
      theme: 'material',
      //cursorBlinkRate: 500 // hide cursor
    };

    private indexArray:number[] =[];
    public loading = false;
    @ViewChild('editor') private editorContainer: ElementRef | undefined;
    @ViewChild('editorNotes') private editorContainerNotes: ElementRef | undefined;
    @ViewChild('editorConfig') private editorContainerConfig: ElementRef | undefined;
    @ViewChild('editorValues') private editorContainerValues: ElementRef | undefined;
    
    constructor(
      private fb: FormBuilder,
      private modal: NzDrawerRef,
      private backendService: BackendService,
      private notification: NzNotificationService,
      private router: Router,
      private eventBus: NgEventBus,
      private changeDetector: ChangeDetectorRef
    ) {
      this.providerYaml = this.providerToYaml;
    }
  
    ngOnInit(): void {
       
    }

    public onSelectedIndexChange(index:number){
        const tabindex = this.indexArray.findIndex(q=>q == index);
        if(tabindex>=0){
           return;
        }
        if(index==1){
          this.valuesToYaml = this.release.valuesToYaml;
      }
        if(index==2){
            this.providerYaml = this.providerToYaml;
        }
        if(index==3){
            this.notes = this.release.info.notes;
        }

       this.indexArray.push(index);
      }

    cancel() {
      this.modal.close();
    }
    
    scrollEditorToTop() {
      try {
        if (this.editorContainer) {
      
          this.editorContainer.nativeElement.parentNode.parentNode.scrollTop = 0;
        }
        // if (this.editorContainerNotes) {
        //     console.log(this.editorContainerNotes.nativeElement.parentNode);
        //     this.editorContainerNotes.nativeElement.parentNode.parentNode.scrollTop = 0;
        //   }
        //   if (this.editorContainerConfig) {
        //     this.editorContainerConfig.nativeElement.parentNode.parentNode.scrollTop = 0;
        //   }
      } catch (err) {
        console.log(err);
      }
    }
  }
  