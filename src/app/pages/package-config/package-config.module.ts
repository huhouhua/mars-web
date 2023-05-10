import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { PackageConfigDetailComponent } from "./components/config-detail/config-detail.component";
import { CreatePackageConfigComponent } from "./components/create-package-config/create-package-config.component";
import { UpdatePackageConfigComponent } from "./components/update-package-config/update-package-config.component";
import { PackageConfiglistComponent } from "./list/package-config-list.component";

@NgModule({
    declarations:[
        PackageConfiglistComponent,
        CreatePackageConfigComponent,
        UpdatePackageConfigComponent,
        PackageConfigDetailComponent,
    ],
    imports:[
       CommonModule,
       SharedModule,
       FormsModule,
    ],
    exports:[
        
   ]
   
   })
   
   export class PackageConfigModule{
   
   }