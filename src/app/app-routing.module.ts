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

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'app-tool/package-config-list' },
  { path: 'app-create', component: CreateAppComponent },
  { 
    path: 'app-list',
    children:[
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { 
        path: 'list', 
        component: ApplistComponent, 
        data: { title: '应用列表' },
      },
      {     
        path:"detail/template/config/:templateId",
        component:TemplateConfigComponent,
        data: { title: '模板配置' },
     },
     {     
      path:"detail/template/config/:templateId/service",
      component:CreateTemplateConfig,
      data: { title: '模板配置' },
   },

     {     
      path:"detail/:applicationId",
      component:AppDetailComponent,
      data: { title: '应用详情' },
   }
    ]
  },
  {
    path: 'app-tool', 
    children:[
       {
        path:'',redirectTo:'build-list',pathMatch:'full'
       },
       {
        path:'build-list',
        component:BuildlistComponent,
        data:{ 
          title:'构建器'
        },
       },
       {
         path:'package-config-list',
         component:PackageConfiglistComponent,
         data:{title:'包配置'},
       },
       {     
        path:"package-config-list/detail/config/:configId",
        component:PackageConfigDetailComponent,
        data: { title: '包配置详情' },
     },
    ]
  },
  { 
    path: 'app-product-list', 
    children:[
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { 
        path: 'list', 
        component: ProductListComponent,  
        data: { title: '产品列表' },
      },

      {     
        path:"detail/:productId/version/list",
        component:VersionListComponent,
        data: { title: '产品版本列表' },
     }
    ]
   },
];
AppDetailComponent
@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    ApplicationModule,
    PipelineModule,
    PackageConfigModule,
    WorkModule,
    ProductModule,
    ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
