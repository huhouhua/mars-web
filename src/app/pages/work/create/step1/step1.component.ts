import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Option } from 'src/app/shared/common.type';
import { stepContext } from '../create.component';

@Component({
  selector: 'app-create-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.less'],
})
export class CreateStep1Component implements OnInit {
 @Input() public stepContext: stepContext ={
        step:0,
        item:{},
        productList:[],
        isinitProductlist: false,
        builderId:1,
 };
 @Output() onStep: EventEmitter<stepContext> = new EventEmitter<stepContext>();

  public validateForm!: FormGroup;
  public teamList:Option[] =[
    {
        value:1,
        name:"中间件团队"
    },
    {
        value:2,
        name:"架构团队"
    },
    {
        value:3,
        name:"数据中团队"
    },
    {
        value:4,
        name:"DevOps团队"
    },
    {
        value:5,
        name:"大数据团队"
    },
  ];
  constructor(private fb: FormBuilder){
    
  }
  ngOnInit(): void {
     console.log(this.stepContext);
    const group = {
        name: ['',Validators.required],
        author: ['', Validators.required],
        teamId: [1],
        description: [''],
      };
      
      this.validateForm = this.fb.group(group);
      this.validateForm.patchValue(this.stepContext.item);
  }

  public next() {
    let item: any ={};

    Object.assign(item, this.validateForm.value);
     ++this.stepContext.step;
     this.stepContext.item = item;
     this.onStep.emit(this.stepContext);
  }

  public submitForm(){

  }
}
