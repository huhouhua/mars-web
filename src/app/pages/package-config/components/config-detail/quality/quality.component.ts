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
import { CompileControl, CoverageTemplate, GenerateTestContext } from '../shared/options';
import { MetaData, NgEventBus } from 'ng-event-bus';
import { EventBus } from '../shared/event-bus';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { GenerateService } from '../shared/generate.service';
import { FormService } from '../shared/form.service';
import { GenerateTemplateService } from '../shared/generate-template.service';
import { Coverage } from 'src/app/pages/test-template/components/detail-unit-test-template/unit-test-template/unit-test-template.component';

@Component({
  selector: 'app-package-config-quality',
  templateUrl: './quality.component.html',
  styleUrls: ['./quality.component.less'],
})
export class PackageConfigQualityComponent implements OnInit {
    @Input() validateForm!: FormGroup;
    @Input() loading: boolean = false;
    templates:any[] =[];
    disabled:boolean =true;
    public Context:GenerateTestContext = new GenerateTestContext();
    Coverages:CoverageTemplate[] =[];
    types:Option[]= [{
        value:1,
        name:'Java',
      },
      {
        value:2,
        name:'Golang',
      },
      {
        value:4,
        name:'Vue',
      },
    ];

    constructor(
        private fb: FormBuilder,
        private drawerService: NzDrawerService,
        private backendService: BackendService,
        private notification: NzNotificationService,
        private router: Router,
        private eventBus: NgEventBus,
        private changeDetector: ChangeDetectorRef,
        private generateService:GenerateService,
        private formService:FormService,
        private generateTemplateService:GenerateTemplateService,
      ) {}
    ngOnInit(): void {
        this.eventBus.on(EventBus.compileView).subscribe(async (control: MetaData) =>  {
            this.disabled =false;
            // this.Context = control.data;
            //  await this.onTemplateTypeChange(this.Context.UnitTestTemplate.type);

            await this.onTemplateTypeChange(control.data.UnitTestTemplate.type,control.data);

         });
    }
     public async onTemplateTypeChange(type:number,context?:GenerateTestContext):Promise<void>{
        this.loading = true;
        await this.backendService.getTestTemplateList<ApiResult>({
            type:type,
            category:2
        }).toPromise().then(res=>{
          if (res.code === ApiResultType.Success) {
            this.templates = res.data.testTemplateViewModels;
            let typeOption = this.types.find(q=>q.value == type);
            if(context){
              this.Context = context;
         }
            if(typeOption){
              this.Context.UnitTestTemplate.name = typeOption.name;
            }
          }
          this.loading = false;

          this.Coverages=[];
          this.onTemplateChange(this.Context.UnitTestTemplate.id);
        }).catch(res=>{
          this.loading = false;
        })
     }

     public onTemplateChange(id:string){
       if(id==null){
            this.Coverages=[];
            this.Context.UnitTestTemplate.coverages=[];
            return;
       }
            const template = this.templates.find(q=>q.id == id);
        if(template == undefined){
            return;
        }
             this.Coverages=[...template.unitTestTemplate.coverages];
             this.Context.UnitTestTemplate.coverages = this.Coverages;
     }

}