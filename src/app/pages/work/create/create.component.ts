import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Option } from 'src/app/shared/common.type';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.less'],
})
export class CreateAppComponent implements OnInit {
  public itemStep: stepContext = {
    step:0,
    item:{
      name:'',
      author:'',
      teamId: 1,
      description: ''
    },
    productList:[]=[],
    isinitProductlist: true,
    builderId :1,
  };
  constructor(private fb: FormBuilder){
    
  }
  ngOnInit(): void {

     
      console.log(this.itemStep);

    
  }

  step(step:stepContext){
    this.itemStep =step;
  }
}
export class stepContext{
  isinitProductlist:boolean =false;
  productList: any[] =[];
  builderId: number = 1;
  step : number =0;
  item: any;
}