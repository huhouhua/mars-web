import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Option } from 'src/app/shared/common.type';
import { hadnlerUpdateTime } from 'src/app/shared/help';
// import { UserIdentityFromHospitalService } from '@user/user-hospital-identity-service';
// import { UserService } from '@user/user-service';


@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.less'],
})
export class ProductInfoComponent implements OnInit {
  @Input() product: any = {};
  @Output() onEditItem: EventEmitter<object> = new EventEmitter<object>();
  @Output() onDeleteItem: EventEmitter<object> = new EventEmitter<object>();
  typeOptions: Option[] = [
    { name: '产品级', value: 1 },
    { name: '组件级', value: 2 },
    { name: '外部依赖', value: 3 },
  ];
  constructor(){}

  ngOnInit() {}

  hadnlerProjectManager(): string {
    return "";
  }


  hadnlerProductType():string | undefined{
    return this.typeOptions.find(q=>q.value == this.product.productType)?.name;
  }

  public hadnlerProductStatus(): string {
    switch (this.product.productType) {
      case 1:
        return '#87d068';
      case 2:
        return '#108ee9';
      case 3:
        return '#ccc';
      default:
        return '';
    }
  }

  public deleteItem() {
    this.onDeleteItem.emit(this.product);
  }
  public editItem() {
    this.onEditItem.emit(this.product);
  }
}
