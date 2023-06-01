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
import { YamlAllData } from '../shared/options';
@Component({
  selector: 'app-package-config-template-preview',
  templateUrl: './package-preview.component.html',
  styleUrls: ['./package-preview.component.less'],
})
export class PackagePreviewComponent implements OnInit {
  @Input() yamlAllData!: YamlAllData;
  public yamlDataItems: any[] = [];
  public testYaml:string ='';
  public codeItem: string = '';
  public options = {
    lineNumbers: true,
    // readOnly: true, // nocursor can not copy
    mode: 'yaml',
    autofocus: true,
    lineWiseCopyCut: true,
    theme: 'material',
    //cursorBlinkRate: 500 // hide cursor
  };


  public code = '';
  public name: string ='';
  public loading = false;
  private indexArray:number[] =[];
  @ViewChild('editor') private editorContainer: ElementRef | undefined;
  @ViewChild('editorItems') private editorContainerItems: ElementRef | undefined;
  @ViewChild('editortestTemplate') private editorContainerTestTemplate: ElementRef | undefined;

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
    for (let [key, value] of this.yamlAllData.packageItems.entries()) {
      this.yamlDataItems.push({
        name: key,
        value: value,
      });
    }
    
  }
  cancel() {
    this.modal.close();
  }

  public onTempChange(name:string) {
    const item = this.yamlDataItems.find(q=>q.name == name);
     this.codeItem =item.value;
  }

  public onSelectedIndexChange(index:number){
    const tabindex = this.indexArray.findIndex(q=>q == index);
    if(tabindex>=0){
       return;
    }
   this.indexArray.push(index);
    if(index==2){
        this.testYaml = this.yamlAllData.testTemplateYaml;
    }
  }
  scrollEditorToTop() {
    try {
      if (this.editorContainer) {
        this.editorContainer.nativeElement.parentNode.parentNode.scrollTop = 0;
      }
      if (this.editorContainerItems) {
        this.editorContainerItems.nativeElement.parentNode.parentNode.scrollTop = 0;
      }
      if (this.editorContainerTestTemplate) {
        this.editorContainerTestTemplate.nativeElement.parentNode.parentNode.scrollTop = 0;
      }
    } catch (err) {
      console.log(err);
    }
  }
}
