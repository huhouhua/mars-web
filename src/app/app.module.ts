import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import { CommonModule, registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NgEventBus } from 'ng-event-bus';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { AddHeaderInterceptor } from './shared/headerInterceptor';
import { SharedModule } from './shared/shared.module';
import { LoginComponent } from './pages/login/components/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { BuildlistComponent } from './pages/pipeline/list/build-list.component';
import { PackageConfiglistComponent } from './pages/package-config/list/package-config-list.component';
import { CreateBuildComponent } from './pages/pipeline/components/create-build/create-build.component';
import { CreateBuildStep1Component } from './pages/pipeline/components/create-build/step1/create-build-step1.component';
import { CreateBuildStep2Component } from './pages/pipeline/components/create-build/step2/create-build-step2.component';
import { BuildTemplatelistComponent } from './pages/pipeline/components/list/build-template-list.component';
import { BuildHistorylistComponent } from './pages/pipeline/components/build-history-list/build-history-list.component';
import { BuildComponent } from './pages/pipeline/components/build/build.component';
import { BuildLogComponent } from './pages/pipeline/components/build-log/build-log.component';
import { CreateBuildStep3Component } from './pages/pipeline/components/create-build/step3/create-build-step3.component';
import { CreatePackageConfigComponent } from './pages/package-config/components/create-package-config/create-package-config.component';
import { PackageConfigDetailComponent } from './pages/package-config/components/config-detail/config-detail.component';
import { ErrorCollectComponent } from './shared/components/error-collect/error-collect.component';
import { PackageConfigTemplateFileComponent } from './pages/package-config/components/config-detail/template/file-config/template-file.component';
import { PackageConfigTemplatePreviewComponent } from './pages/package-config/components/config-detail/template/preview/template-preview.component';
import { PackageConfigTemplateImageComponent } from './pages/package-config/components/config-detail/template/image-config/template-image.component';
import { PackageConfigTemplateChartsComponent } from './pages/package-config/components/config-detail/template/charts-config/template-charts.component';
import { PackagePreviewComponent } from './pages/package-config/components/config-detail/preview/package-preview.component';
import { UpdatePackageConfigComponent } from './pages/package-config/components/update-package-config/update-package-config.component';
import { PackageConfigCompileComponent } from './pages/package-config/components/config-detail/compile/compile.component';
import { PackagePackingComponent } from './pages/package-config/components/config-detail/packing/packing.component';
import { PackageConfigTemplateComponent } from './pages/package-config/components/config-detail/template/template.component';
import { FooterToolbarComponent } from './shared/components/footer-toolbar/footer-toolbar.component';
import { RouterModule } from '@angular/router';
import { routes } from './pages/routes/routes';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LayoutComponent,
    PackageConfiglistComponent,



    BuildlistComponent,
    CreateBuildComponent,
    CreateBuildStep1Component,
    CreateBuildStep2Component,
    CreateBuildStep3Component,
    BuildTemplatelistComponent,
    BuildHistorylistComponent,
    BuildComponent,
    BuildLogComponent,


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
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    CodemirrorModule,
    CommonModule,
    SharedModule,
  ],
  providers: [NgEventBus, { provide: NZ_I18N, useValue: zh_CN },{
    provide: HTTP_INTERCEPTORS,
    useClass: AddHeaderInterceptor,
    multi: true,
  }],
  bootstrap: [AppComponent]
  
})
export class AppModule { }
