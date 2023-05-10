import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BackendService } from 'src/app/pages/services/backend.service';
import { ApiResult, ApiResultType, Option } from 'src/app/shared/common.type';
import { stepContext } from '../create.component';

@Component({
  selector: 'app-create-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.less'],
})
export class CreateStep2Component implements OnInit {
  @Input() public stepContext: stepContext ={
    step:0,
    item:{},
    productList:[],
    isinitProductlist: false,
    builderId:1,
};

 @Output() onStep: EventEmitter<stepContext> = new EventEmitter<stepContext>();
 public colorList = ['#f56a00', '#1890ff', '#7265e6', '#ffbf00', '#00a2ae', '#00a2ae'];
  public item: any ={};
  public listLoading:boolean =false;
  public validateForm!: FormGroup;
  public loading = false;
  public productOptions:any[] =[];

  constructor(
    private backendService: BackendService,
    private fb: FormBuilder){
    
  }
  ngOnInit(): void {
    const group = {
      productId: ['',Validators.required],
    };
    
    this.validateForm = this.fb.group(group);
    this.getProductList();
  }

  public getProductList(){
    this.loading = true;
    this.backendService.productAll<ApiResult>().subscribe(res => {
       this.loading = false;
      if (res.status === ApiResultType.Success) {
        this.productOptions = res.data.productList;
        this.productOptions.forEach(res=>{
          res.showName =  `${res.name}(${res.code})`;
        });
      }
      this.stepContext.isinitProductlist = false;
    },err=>{
      this.loading = false;
    });
  
  }

  public onSelect(id:string){
    console.log(this.stepContext);
    const opt =  this.stepContext.productList.find(q=>q.id == id);
    if(opt!=undefined){
      return;
    }
    this.listLoading = true;
     const prOpt = this.productOptions.find(q=>q.id == id);
    let newOpt ={};
    Object.assign(newOpt,prOpt);
    this.stepContext.productList.unshift(newOpt);
    this.stepContext.productList =[...this.stepContext.productList];
    this.listLoading = false;
  }
  public next() {
     Object.assign(this.item, this.validateForm.value);
     ++this.stepContext.step;

     this.onStep.emit(this.stepContext)
   
  }

  public pre(){
    --this.stepContext.step;
    this.onStep.emit(this.stepContext)
  }

  public remove(opt:any){
    let list =  this.stepContext.productList.filter(q=>q.id!=opt.id);
    this.stepContext.productList=[...list]
  }
  public submitForm(){

  }
}
