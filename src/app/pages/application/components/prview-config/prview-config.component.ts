import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-tpl-prview-config',
  templateUrl: './prview-config.component.html',
  styleUrls: ['./prview-config.component.less'],
})
export class PrviewConfigComponent implements OnInit {
  @Input() record: any = {};
  i: any;
  yamlContent = '';
  yamlEditorConfig = {
    lineNumbers: true,
    mode: { name: 'yaml' },
    theme: 'eclipse',
  };

  metaContent = '';
  metaEditorConfig = {
    lineNumbers: true,
    mode: { name: 'javascript', json: true },
    theme: 'eclipse',
  };
  constructor(
    private modal: NzDrawerRef,
     private msgSrv: NzMessageService) {}

  @ViewChild('editor')
  public editorContainer!: ElementRef;
  ngOnInit() {
    this.yamlContent = this.record.yamlData;
    this.metaContent = this.record.metaData;
  }
  scrollEditorToTop() {
    try {
      this.editorContainer.nativeElement.parentNode.parentNode.scrollTop = 0;
    } catch (err) {
      console.log(err);
    }
  }

  cancel() {
    this.modal.close();
  }

  close() {
    this.modal.close();
  }
}
