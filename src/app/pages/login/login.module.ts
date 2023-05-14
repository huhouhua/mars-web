import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CodemirrorModule } from "@ctrl/ngx-codemirror";
import { ErrorCollectComponent } from "src/app/shared/components/error-collect/error-collect.component";
import { FooterToolbarComponent } from "src/app/shared/components/footer-toolbar/footer-toolbar.component";
import { SharedModule } from "src/app/shared/shared.module";
import { LoginComponent } from "./components/login.component";

@NgModule({
    declarations: [
        LoginComponent
    ],
    exports: [], 
    entryComponents: [],
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        CodemirrorModule
    ]
})
   
   export class LoginModule{
   
   }