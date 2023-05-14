import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { NgEventBus } from "ng-event-bus";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { BackendService } from "src/app/pages/services/backend.service";
import * as YAML from 'js-yaml';
import { NzDrawerRef } from "ng-zorro-antd/drawer";
@Component({
    selector: 'app-package-config-template-preview',
    templateUrl: './template-preview.component.html',
    styleUrls: ['./template-preview.component.less'],
  })
  export class PackageConfigTemplatePreviewComponent implements OnInit {
    @Input() yamlData: string ='';
   public options = {
        lineNumbers: true,
        // readOnly: true, // nocursor can not copy
        mode: 'yaml',
        autofocus: true,
        lineWiseCopyCut: true,
        theme: 'material',
         //cursorBlinkRate: 500 // hide cursor
    };
   public code = "";

   public loading = false;
    @ViewChild('editor') private editorContainer: ElementRef | undefined;
    constructor(
      private fb: FormBuilder,
      private modal: NzDrawerRef,
      private backendService: BackendService,
      private notification: NzNotificationService,
      private router: Router,
      private eventBus: NgEventBus,
      private changeDetector: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
    }
    cancel() {
      this.modal.close();
    }
    scrollEditorToTop() {
      try {
        if(this.editorContainer){
        this.editorContainer.nativeElement.parentNode.parentNode.scrollTop= 0;
        }
      } catch (err) {
        console.log(err);
      }
  }
}