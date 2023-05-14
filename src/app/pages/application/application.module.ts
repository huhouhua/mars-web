import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedModule } from "src/app/shared/shared.module";
import { ApplistComponent } from "./list/app-list.component";
import { RouterModule, Routes } from "@angular/router";
import { TemplateListComponent } from "./components/template-list/template-list.component";
import { AppDetailComponent } from "./components/app-detail/app-detail.component";
import { CreateTemplateComponent } from "./components/create-template/create-template.component";
import { TemplateConfigComponent } from "./components/template-config/template-config.component";
import { PrviewConfigComponent } from "./components/prview-config/prview-config.component";
import { CreateTemplateConfig } from "./components/create-template-config/create-template-config.component";
import { TemplateConfigList } from "./components/template-config-list/template-config-list.component";
import { ConfigAdvancedEditComponent } from "./components/config-advanced-edit/config-advanced-edit.component";
import { CreateBuildPackageComponent } from "./components/create-build-package/create-build-package.component";



@NgModule({
 declarations:[
  ApplistComponent,
  TemplateListComponent,
  AppDetailComponent,
  CreateTemplateComponent,
  TemplateConfigComponent,
  PrviewConfigComponent,
  CreateTemplateConfig,
  TemplateConfigList,
  ConfigAdvancedEditComponent,
  CreateBuildPackageComponent,
 ],
 imports:[
    CommonModule,
    SharedModule,
    FormsModule
 ],
 exports:[
]

})

export class ApplicationModule{

}