import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { HomeComponent } from '@app/home/home.component';
import { LayoutDefaultComponent } from '../layout/default/layout-default.component';

import { AboutComponent } from '@app/about/about.component';
import { TenantsComponent } from '@app/tenants/tenants.component';
import { RolesComponent } from '@app/roles/roles.component';
import { UsersComponent } from '@app/users/users.component';

import { ElementComponent } from '@app/assay/element/element.component';
import { SpecimenComponent } from '@app/assay/specimen/specimen.component';
import { UnitComponent } from '@app/assay/unit/unit.component';
import { OrganizationComponent } from '@app/system/organization/organization.component';
import { TemplateComponent } from '@app/assay/template/template.component';
import { TokenComponent } from './assay/token/token.component';
import { UserTplComponent } from './assay/user-tpl/user-tpl.component';
import { DataInputComponent } from './assay/data-input/data-input.component';
import { DataSearchComponent } from './assay/data-search/data-search.component';
import { ListComponent } from './assay/list/list.component';
import { AssayUserComponent } from './assay/user/user.component';
import { SignDataInputComponent } from './assay/sign-data-input/sign-data-input.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ZtcodeComponent } from './system/ztcode/ztcode.component';
import { MultiTableSearchComponent } from './assay/multi-table-search/multi-table-search.component';
import { ZtMultiTableSearchComponent } from './assay/zt-multi-table-search/zt-multi-table-search.component';
import { StatisticExcelerComponent } from './assay/statistic/statistic-exceler/statistic-exceler.component';
import { XySignDataInputComponent } from './assay/xy-sign-data-input/xy-sign-data-input.component';
import { UsrDataSearchComponent } from './assay/usr-data-search/usr-data-search.component';
import { CrossTemplateSearchComponent } from './assay/cross-template-search/cross-template-search.component';
import { EquationComponent } from './process/equation/equation.component';
import { ExceloperComponent } from './assay/detectcenter/exceloper/exceloper.component';
import { DuplicateeditorComponent } from './assay/detectcenter/duplicateeditor/duplicateeditor.component';
import { ModificationsearchComponent } from './assay/detectcenter/modificationsearch/modificationsearch.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutDefaultComponent,
    canActivate: [AppRouteGuard],
    children: [
      { path: '', redirectTo: 'welcome', pathMatch: 'full' },
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [AppRouteGuard],
      },
      {
        path: 'welcome',
        component: WelcomeComponent,
      },
      {
        path: 'tenants',
        component: TenantsComponent,
        canActivate: [AppRouteGuard],
      },
      {
        path: 'roles',
        component: RolesComponent,
        canActivate: [AppRouteGuard],
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [AppRouteGuard],
      },
      {
        path: 'about',
        component: AboutComponent,
        canActivate: [AppRouteGuard],
      },
      {
        path: 'element',
        component: ElementComponent,
        canActivate: [AppRouteGuard],
      },
      {
        path: 'specimen',
        component: SpecimenComponent,
        canActivate: [AppRouteGuard],
      },
      {
        path: 'unit',
        component: UnitComponent,
        canActivate: [AppRouteGuard],
      },
      {
        path: 'organization',
        component: OrganizationComponent,
        canActivate: [AppRouteGuard],
      },
      {
        path: 'template',
        component: TemplateComponent,
        canActivate: [AppRouteGuard],
      },
      {
        path: 'token',
        component: TokenComponent,
        canActivate: [AppRouteGuard],
      },
      {
        path: 'userTpl',
        component: UserTplComponent,
        canActivate: [AppRouteGuard],
      },
      {
        path: 'dataInput',
        component: DataInputComponent,
        canActivate: [AppRouteGuard],
      },
      {
        path: 'dataSearch',
        component: DataSearchComponent,
        canActivate: [AppRouteGuard],
      },
      {
        path: 'usrdataSearch',
        component: UsrDataSearchComponent,
        canActivate: [AppRouteGuard],
      },
      {
        path: 'list',
        component: ListComponent,
        canActivate: [AppRouteGuard],
      },
      {
        path: 'assayUser',
        component: AssayUserComponent,
        canActivate: [AppRouteGuard],
      },
      {
        path: 'signDataInput',
        component: SignDataInputComponent,
        canActivate: [AppRouteGuard],
      },
      {
        path: 'ztCode',
        component: ZtcodeComponent,
        canActivate: [AppRouteGuard],
      },
      {
        path: 'userMultiTable',
        component: MultiTableSearchComponent,
        canActivate: [AppRouteGuard],
      },
      {
        path: 'ztMultiTable',
        component: ZtMultiTableSearchComponent,
        canActivate: [AppRouteGuard],
      },
      {
        path: 'statisticCompany',
        component: StatisticExcelerComponent,
        canActivate: [AppRouteGuard],
      },
      {
        path: 'xySignDataInput',
        component: XySignDataInputComponent,
        canActivate: [AppRouteGuard],
      },
      {
        path: 'selfTplSearch',
        component: CrossTemplateSearchComponent,
        canActivate: [AppRouteGuard],
      },
      {
        path: 'formula',
        component: EquationComponent,
        canActivate: [AppRouteGuard],
      },
      {
        path: 'excelOper',
        component: ExceloperComponent,
        canActivate: [AppRouteGuard],
      },
      {
        path: 'duplicationSearch',
        component: DuplicateeditorComponent,
        canActivate: [AppRouteGuard],
      },
      {
        path: 'modificationSearch',
        component: ModificationsearchComponent,
        canActivate: [AppRouteGuard],
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
