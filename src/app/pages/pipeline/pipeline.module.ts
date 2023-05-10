import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { BuildHistorylistComponent } from "./components/build-history-list/build-history-list.component";
import { BuildLogComponent } from "./components/build-log/build-log.component";
import { BuildComponent } from "./components/build/build.component";
import { CreateBuildComponent } from "./components/create-build/create-build.component";
import { CreateBuildStep1Component } from "./components/create-build/step1/create-build-step1.component";
import { CreateBuildStep2Component } from "./components/create-build/step2/create-build-step2.component";
import { CreateBuildStep3Component } from "./components/create-build/step3/create-build-step3.component";
import { BuildTemplatelistComponent } from "./components/list/build-template-list.component";
import { BuildlistComponent } from "./list/build-list.component";

@NgModule({
    declarations:[
        BuildlistComponent,
        CreateBuildComponent,
        CreateBuildStep1Component,
        CreateBuildStep2Component,
        CreateBuildStep3Component,
        BuildTemplatelistComponent,
        BuildHistorylistComponent,
        BuildComponent,
        BuildLogComponent
    ],
    imports:[
       CommonModule,
       SharedModule,
       FormsModule,
    ],
    exports:[
        
   ]
   
   })
   
   export class PipelineModule{
   
   }