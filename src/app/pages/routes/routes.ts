import { Routes } from "@angular/router";
import { LayoutComponent } from "../layout/layout.component";
import { LoginComponent } from "../login/components/login.component";
import { PackageConfigDetailComponent } from "../package-config/components/config-detail/config-detail.component";
import { PackageConfiglistComponent } from "../package-config/list/package-config-list.component";
import { BuildlistComponent } from "../pipeline/list/build-list.component";

export  const routes: Routes = [
    { path: '', component:LayoutComponent,
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
    { path: 'login', component: LoginComponent },
  // {
  //   path:"**",
  //   component:PageNotFoundComponent
  // }
  
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