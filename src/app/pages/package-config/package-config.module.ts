import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CodemirrorModule } from "@ctrl/ngx-codemirror";
import { ErrorCollectComponent } from "src/app/shared/components/error-collect/error-collect.component";
import { FooterToolbarComponent } from "src/app/shared/components/footer-toolbar/footer-toolbar.component";
import { SharedModule } from "src/app/shared/shared.module";
import { PackageConfigCompileComponent } from "./components/config-detail/compile/compile.component";
import { PackageConfigDetailComponent } from "./components/config-detail/config-detail.component";
import { PackagePackingComponent } from "./components/config-detail/packing/packing.component";
import { PackagePreviewComponent } from "./components/config-detail/preview/package-preview.component";
import { PackageConfigTemplateChartsComponent } from "./components/config-detail/template/charts-config/template-charts.component";
import { PackageConfigTemplateFileComponent } from "./components/config-detail/template/file-config/template-file.component";
import { PackageConfigTemplateImageComponent } from "./components/config-detail/template/image-config/template-image.component";
import { PackageConfigTemplatePreviewComponent } from "./components/config-detail/template/preview/template-preview.component";
import { PackageConfigTemplateComponent } from "./components/config-detail/template/template.component";
import { CreatePackageConfigComponent } from "./components/create-package-config/create-package-config.component";
import { UpdatePackageConfigComponent } from "./components/update-package-config/update-package-config.component";
import { PackageConfiglistComponent } from "./list/package-config-list.component";

@NgModule({
    declarations: [
        PackageConfiglistComponent,
        CreatePackageConfigComponent,
        UpdatePackageConfigComponent,
        PackageConfigDetailComponent,
        PackageConfigCompileComponent,
        PackagePackingComponent,
        PackageConfigTemplateComponent,
        FooterToolbarComponent,
        ErrorCollectComponent,
        PackageConfigTemplateFileComponent,
        PackageConfigTemplatePreviewComponent,
        PackageConfigTemplateImageComponent,
        PackageConfigTemplateChartsComponent,
        PackagePreviewComponent
    ],
    exports: [], entryComponents: [],
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        CodemirrorModule
    ]
})
   
   export class PackageConfigModule{
   
   }