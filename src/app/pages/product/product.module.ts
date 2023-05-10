import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedModule } from "src/app/shared/shared.module";

import { ProductListComponent } from "./product-list/product-list.component";
import { CreateProductComponent } from "./components/create-product/create-product.component";
import { RouterModule, Routes } from "@angular/router";
import { ProductInfoComponent } from "./components/product-info/product-info.component";
import { VersionListComponent } from "./components/version-list/version-list.component";
import { CreateProductVersionComponent } from "./components/create-version/create-version.component";

const routes: Routes = [
   
];
  
@NgModule({
 declarations:[
    CreateProductComponent,
   ProductListComponent,
   ProductInfoComponent,
   VersionListComponent,
   CreateProductVersionComponent,
 ],
 imports:[
    RouterModule.forRoot(routes),
    CommonModule,
    SharedModule,
    FormsModule
 ]

})

export class ProductModule{

}