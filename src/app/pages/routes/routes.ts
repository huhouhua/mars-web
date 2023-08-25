import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/helpers/auth.guard';
import { PageNotFoundComponent } from 'src/app/shared/components/page-not-found/page-not-found.component';
import { LayoutComponent } from '../layout/layout.component';
import { LoginComponent } from '../login/components/login.component';
import { PackageConfigDetailComponent } from '../package-config/components/config-detail/config-detail.component';
import { PackageConfiglistComponent } from '../package-config/list/package-config-list.component';
import { BuildlistComponent } from '../pipeline/list/build-list.component';
import { TestTemplateListComponent } from '../test-template/list/test-template-list.component';
import { UnitTestTemplateDetailComponent } from '../test-template/components/detail-unit-test-template/detail-unit-test-template.component';
import { ApplistComponent } from '../application/list/app-list.component';
import { AppDetailComponent } from '../application/components/app-detail/app-detail.component';
import { TemplateConfigComponent } from '../application/components/template/template-config/template-config.component';
import {  CreateServiceConfig } from '../application/components/template/service-config/create-service-config/create-service-config.component';
import { EnvironmentlistComponent } from '../environment/list/environment-list.component';
import { EditServiceConfig } from '../application/components/template/service-config/edit-service-config/edit-service-config.component';
import { InfrastructurelistComponent } from '../infrastructure/list/infrastructure-list.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'app/list',
        pathMatch: 'full',
      },
      {
        path: 'app/list',
        component: ApplistComponent,
        canActivate: [AuthGuard],
        data: {
          title: '应用列表',
        },
      },
      {
        path: 'app/detail/:applicationId',
        component: AppDetailComponent,
        data: { title: '应用详情' },
      },
      {
        path: 'app/detail/template/config/:templateId',
        component: TemplateConfigComponent,
        data: { title: '模板配置' },
      },
      {
        path:"app/detail/template/new/:templateId/service",
        component:CreateServiceConfig,
        data: { title: '模板服务配置' },
     },
     {
      path:"app/detail/template/edit/:templateId/service",
      component:EditServiceConfig,
      data: { title: '编辑模板服务配置' },
   },
    ],
  },
  {
    path: 'env',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: EnvironmentlistComponent,
        canActivate: [AuthGuard],
        data: {
          title: '环境列表',
        },
      }
    ],
  },
  {
    path: 'infra',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: InfrastructurelistComponent,
        canActivate: [AuthGuard],
        data: {
          title: '基础设施列表',
        },
      }
    ],
  },

  {
    path: 'build',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: BuildlistComponent,
        canActivate: [AuthGuard],
        data: {
          title: '构建器',
        },
      },
      {
        path: 'package-config-list',
        component: PackageConfiglistComponent,
        canActivate: [AuthGuard],
        data: { title: '包配置' },
      },
      {
        path: 'package-config-list/detail/config/:configId',
        component: PackageConfigDetailComponent,
        canActivate: [AuthGuard],
        data: { title: '包配置详情' },
      },
    ],
  },
  {
    path: 'test-template',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: TestTemplateListComponent,
        canActivate: [AuthGuard],
        data: {
          title: '模板库',
        },
      },
      {
        path: 'list/unit-test-detail/:templateId',
        component: UnitTestTemplateDetailComponent,
        canActivate: [AuthGuard],
        data: {
          title: '模板详情',
        },
      },
    ],
  },

  { path: 'login', component: LoginComponent },

  { path: '**', component: PageNotFoundComponent, canActivate: [AuthGuard] },

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
