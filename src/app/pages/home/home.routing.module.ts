import {  ApplicationModule, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppDetailComponent } from '../application/components/app-detail/app-detail.component';
import { CreateTemplateConfig } from '../application/components/create-template-config/create-template-config.component';
import { TemplateConfigComponent } from '../application/components/template-config/template-config.component';
import { ApplistComponent } from '../application/list/app-list.component';
import { LoginComponent } from '../login/components/login.component';
import { LoginModule } from '../login/login.module';
import { PackageConfigDetailComponent } from '../package-config/components/config-detail/config-detail.component';
import { PackageConfiglistComponent } from '../package-config/list/package-config-list.component';
import { PackageConfigModule } from '../package-config/package-config.module';
import { BuildlistComponent } from '../pipeline/list/build-list.component';
import { PipelineModule } from '../pipeline/pipeline.module';
import { VersionListComponent } from '../product/components/version-list/version-list.component';
import { ProductListComponent } from '../product/product-list/product-list.component';
import { ProductModule } from '../product/product.module';
import { CreateAppComponent } from '../work/create/create.component';
import { WorkModule } from '../work/work.module';
import { HomeComponent } from './components/home.component';

const routes: Routes = [
  { path: '', redirectTo: 'app-tool/build-list', pathMatch: 'full' },
  // { path: 'app-create', component: CreateAppComponent },
  // { 
  //   path: 'app-list',
  //   children:[
  //     { path: '', redirectTo: 'list', pathMatch: 'full' },
  //     { 
  //       path: 'list', 
  //       component: ApplistComponent, 
  //       data: { title: '应用列表' },
  //     },
  //     {     
  //       path:"detail/template/config/:templateId",
  //       component:TemplateConfigComponent,
  //       data: { title: '模板配置' },
  //    },
  //    {     
  //     path:"detail/template/config/:templateId/service",
  //     component:CreateTemplateConfig,
  //     data: { title: '模板配置' },
  //  },

  //    {     
  //     path:"detail/:applicationId",
  //     component:AppDetailComponent,
  //     data: { title: '应用详情' },
  //  }
  //   ]
  // },
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
  // { 
  //   path: 'app-product-list', 
  //   children:[
  //     { path: '', redirectTo: 'list', pathMatch: 'full' },
  //     { 
  //       path: 'list', 
  //       component: ProductListComponent,  
  //       data: { title: '产品列表' },
  //     },

  //     {     
  //       path:"detail/:productId/version/list",
  //       component:VersionListComponent,
  //       data: { title: '产品版本列表' },
  //    }
  //   ]
  //  },
];
@NgModule({
  
  imports: [
    RouterModule.forRoot(routes),
    ApplicationModule,
    PipelineModule,
    PackageConfigModule,
    WorkModule,
    ProductModule,
    ],
  exports: [RouterModule],
  bootstrap:[
    HomeComponent
  ]
})
export class HomeRoutingModule { }
// login.component.html