import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BackendService } from 'src/app/pages/services/backend.service';
import {
  ApiResult,
  ApiResultType,
  Member,
  MemberRole,
  Option,
} from 'src/app/shared/common.type';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { MetaData, NgEventBus } from 'ng-event-bus';
import { EventBus } from '../shared/event-bus';
import { PackageConfigTemplatePreviewComponent } from './preview/template-preview.component';
import { GenerateTemplateContext, Packing } from '../shared/options';

@Component({
  selector: 'app-package-config-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.less'],
})
export class PackageConfigTemplateComponent implements OnInit {
  @Input() public validateForm!: FormGroup;
  public selectedIndex: number = 0;
  public disabled:boolean =true;
  loading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private modal: NzModalService,
    private backendService: BackendService,
    private notification: NzNotificationService,
    private router: Router,
    private eventBus: NgEventBus,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.eventBus.on(EventBus.packageView).subscribe((control: MetaData) => {
      this.disabled =false;
  });
  }
}
