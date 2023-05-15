import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzFormModule } from 'ng-zorro-antd/form';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';

import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { IconsProviderModule } from '../icons-provider.module';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationServiceModule } from 'ng-zorro-antd/notification';

import { NzNotificationModule } from 'ng-zorro-antd/notification';

import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTransferModule } from 'ng-zorro-antd/transfer';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzAnchorModule } from 'ng-zorro-antd/anchor';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzMentionModule } from 'ng-zorro-antd/mention';
import { NzResultModule } from 'ng-zorro-antd/result';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NzResultModule,
    NzSpinModule,
    NzSliderModule,
    NzCardModule,
    NzSelectModule,
    NzInputModule,
    NzInputNumberModule,
    NzDividerModule,
    NzBreadCrumbModule,
    NzModalModule,
    NzNotificationModule,
    NzNotificationServiceModule,
    NzDatePickerModule,
    NzStepsModule,
    NzPageHeaderModule,
    NzDropDownModule,
    NzTagModule,
    NzPaginationModule,
    NzTransferModule,
    NzTabsModule,
    NzDrawerModule,
    NzDescriptionsModule,
    NzLayoutModule,
    NzAnchorModule,
    NzSegmentedModule,
    NzButtonModule,
    NzGridModule,
    NzAvatarModule,
    NzPopoverModule,
    NzMessageModule,
    NzPopconfirmModule,
    NzTableModule,
    NzFormModule,
    NzListModule,
    NzSkeletonModule,
    IconsProviderModule,
    NzMentionModule,
    NzTimelineModule
  ],
  declarations: [
    PageNotFoundComponent,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    NzDatePickerModule,
    NzSpinModule,
    NzSliderModule,
    NzCardModule,
    NzSelectModule,
    NzInputModule,
    NzInputNumberModule,
    NzDividerModule,
    NzBreadCrumbModule,
    NzStepsModule,
    NzPageHeaderModule,
    NzDropDownModule,
    NzTagModule,
    NzPaginationModule,
    NzTransferModule,
    NzTabsModule,
    NzDrawerModule,
    NzDescriptionsModule,
    NzLayoutModule,
    NzAnchorModule,
    NzSegmentedModule,
    NzButtonModule,
    NzGridModule,
    NzAvatarModule,
    NzPopoverModule,
    NzMessageModule,
    NzPopconfirmModule,
    NzTableModule,
    NzListModule,
    NzSkeletonModule,
    NzMentionModule,
    NzModalModule,
    NzNotificationModule,
    NzNotificationServiceModule,
    NzResultModule,
    NzFormModule,
    IconsProviderModule,
    NzTimelineModule,
    PageNotFoundComponent
  ],
  providers: [],
})
export class SharedModule {}
