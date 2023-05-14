import {  NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { ApplistComponent } from './pages/application/list/app-list.component';
import { CreateAppComponent } from './pages/work/create/create.component';
import { WorkModule } from './pages/work/work.module';
import { ProductModule } from './pages/product/product.module';
import { ApplicationModule } from './pages/application/application.module';
import { ProductListComponent } from './pages/product/product-list/product-list.component';
import { VersionListComponent } from './pages/product/components/version-list/version-list.component';
import { AppDetailComponent } from './pages/application/components/app-detail/app-detail.component';
import { TemplateConfigComponent } from './pages/application/components/template-config/template-config.component';
import { CreateTemplateConfig } from './pages/application/components/create-template-config/create-template-config.component';
import { PipelineModule } from './pages/pipeline/pipeline.module';
import { BuildlistComponent } from './pages/pipeline/list/build-list.component';
import { PackageConfigModule } from './pages/package-config/package-config.module';
import { PackageConfiglistComponent } from './pages/package-config/list/package-config-list.component';
import { PackageConfigDetailComponent } from './pages/package-config/components/config-detail/config-detail.component';
import { LoginModule } from './pages/login/login.module';
import { LoginComponent } from './pages/login/components/login.component';
import { HomeComponent } from './pages/home/components/home.component';
import { HomeRoutingModule } from './pages/home/home.routing.module';

const routes: Routes = [
     { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path:'home',
    component:HomeComponent
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    LoginModule],
  exports: [RouterModule],
})
export class AppRoutingModule { }
