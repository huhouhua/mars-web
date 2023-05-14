import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
import { CompileControl } from '../shared/options';
import { MetaData, NgEventBus } from 'ng-event-bus';
import { EventBus } from '../shared/event-bus';

@Component({
  selector: 'app-package-config-compile',
  templateUrl: './compile.component.html',
  styleUrls: ['./compile.component.less'],
})
export class PackageConfigCompileComponent implements OnInit {
  @Input() validateForm!: FormGroup;
  @Input() loading: boolean = false;
  listOfControl: CompileControl[] = [];
  @Input() ProjectList: any[] = [];
  public loadingWithProjectList: boolean = false;
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
    this.eventBus.on(EventBus.setCompileForm).subscribe((control: MetaData) => {
         let id = this.addField(undefined,control.data.compile);
         this.setValue(id,control.data.projectId);
    });
  }
  public addField(e?: MouseEvent, value?: any):number {
    if (e) {
      e.preventDefault();
    }
    let id = 0;
    if (this.listOfControl.length > 0) {
      id = this.listOfControl[this.listOfControl.length - 1].id + 1;
    }
    const control = {
      id,
      brancheLoading: false,
      controlValue: value ? value : {},
      branches: [] =[],
    };
    const index = this.listOfControl.push(control);
    const newId = `${this.listOfControl[index - 1].id}`;

    this.validateForm.addControl(
      `${newId}_compile_name`,
      new FormControl(null, Validators.required)
    );
    this.validateForm.addControl(
      `${newId}_compile_git`,
      new FormControl(null, Validators.required)
    );
    this.validateForm.addControl(
      `${newId}_compile_branch`,
      new FormControl(null, Validators.required)
    );
    this.validateForm.addControl(
      `${newId}_compile_file_content`,
      new FormControl([])
    );
    this.listOfControl = [...this.listOfControl];
    return Number(newId);
  }

  
  private setValue(id:number,projectId:number){
    const  control = this.listOfControl.find(q=>q.id == id);
    if(!control){
      return;
    }
    this.validateForm.get(`${id}_compile_name`)?.setValue(control?.controlValue.name);
    this.validateForm.get(`${id}_compile_branch`)?.setValue(control?.controlValue.branch);
     this.validateForm.get(`${id}_compile_git`)?.setValue(projectId);
    this.onProjectChange(projectId.toString(),control);
    this.onBranchChange(control?.controlValue.branch,control);
  }

  public removeField(value: CompileControl, e: MouseEvent): void {
    e.preventDefault();
    if (this.listOfControl.length > 0) {
      console.log(this.listOfControl);
      this.removeFieldControl(value);
      this.listOfControl =[...this.listOfControl]
    }
  }
  private removeFieldControl(value: CompileControl){
    const index = this.listOfControl.indexOf(value);
    this.listOfControl.splice(index, 1);
    this.validateForm.removeControl(`${value.id}_compile_name`);
    this.validateForm.removeControl(`${value.id}_compile_git`);
    this.validateForm.removeControl(`${value.id}_compile_branch`);
  }
  public onBranchChange(value: string, control: CompileControl){
    if(value==''){
      return;
    }
    const projectId =  this.validateForm.get(`${control.id}_compile_git`)?.value;
    control.brancheLoading = true;
    this.backendService.getProjecBuildFileFromGitlab<ApiResult>(projectId,value).subscribe(
      (res) => {
        if (res.status === ApiResultType.Success) {
          this.validateForm.get(`${control.id}_compile_file_content`)?.setValue(res.data.buildList);
        }
        control.brancheLoading = false;
      },
      (err) => {
        control.brancheLoading = false;
      }
    );
  }
  public onProjectChange(value:string, control: CompileControl) {
    if(value==''){
      return;
    }
    control.brancheLoading = true;
    this.backendService.getBranchListFromGitlab<ApiResult>(value, '').subscribe(
      (res) => {
        if (res.status === ApiResultType.Success) {
          control.branches = res.data;
        }
        control.brancheLoading = false;
      },
      (err) => {
        control.brancheLoading = false;
      }
    );
}
}