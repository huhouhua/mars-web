/*
 * @Author: RYH
 * @Date: 2021-10-08 10:13:55
 * @LastEditors: RYH
 * @LastEditTime: 2021-11-26 15:53:29
 */
import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import * as YAML from 'js-yaml';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-template-config-advanced-edit',
  templateUrl: './config-advanced-edit.component.html',
  styleUrls: ['./config-advanced-edit.component.less'],
})
export class ConfigAdvancedEditComponent implements OnInit {
  @Input() record: any;
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

  @ViewChild('editor')
    private editorContainer!: ElementRef;
  constructor(private modal: NzDrawerRef, private msgSrv: NzMessageService) {}

  ngOnInit() {
    console.log(this.record);
    this.yamlContent = YAML.dump(this.record.yaml, {
      lineWidth: 5000,
    });
    this.metaContent =this.record.metadata;
  }

  save() {
    let isError = false;
    let metadataObj = {};
    let yamlDoc = {};
    try {
      metadataObj = JSON.parse(this.metaContent);
      console.log(metadataObj);
    } catch (e:any) {
      isError = true;
      this.msgSrv.error(`metadata格式错误！${e.message}`);
      console.log(e);
    }
    try {
      yamlDoc = YAML.loadAll(this.yamlContent);
      console.log(yamlDoc);
    } catch (e:any) {
      isError = true;
      this.msgSrv.error(`yaml格式错误！${e.message}`);
      console.log(e);
    }

    if (!isError) {
      try {
        this.msgSrv.success('修改成功', { nzDuration: 3000 });
        this.modal.close({ yaml: yamlDoc, metadata: metadataObj });
      } catch (e) {
        this.msgSrv.error('元数据配置解析错误，请检查！');
        console.log(e);
      }
    }
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
