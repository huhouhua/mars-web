import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedModule } from "src/app/shared/shared.module";
import { CreateAppComponent } from "./create/create.component";
import { CreateStep1Component } from "./create/step1/step1.component";
import { CreateStep2Component } from "./create/step2/step2.component";
import { CreateStep3Component } from "./create/step3/step3.component";
@NgModule({
 declarations:[
   CreateAppComponent,
   CreateStep1Component,
   CreateStep2Component,
   CreateStep3Component
 ],
 imports:[
    CommonModule,
    SharedModule,
    FormsModule
 ]

})

export class WorkModule{

}