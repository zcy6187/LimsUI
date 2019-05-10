import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '@app/app-routing.module';
import { LayoutModule } from '@layout/layout.module';
import { HomeComponent } from '@app/home/home.component';
import { SharedModule } from '@shared/shared.module';
import { HttpClientModule } from '@angular/common/http';

import { AboutComponent } from '@app/about/about.component';
import { TenantsComponent } from '@app/tenants/tenants.component';
import { UsersComponent } from '@app/users/users.component';
import { RolesComponent } from '@app/roles/roles.component';
import { CreateTenantComponent } from '@app/tenants/create-tenant/create-tenant.component';
import { EditTenantComponent } from '@app/tenants/edit-tenant/edit-tenant.component';
import { CreateRoleComponent } from '@app/roles/create-role/create-role.component';
import { EditRoleComponent } from '@app/roles/edit-role/edit-role.component';
import { CreateUserComponent } from '@app/users/create-user/create-user.component';
import { EditUserComponent } from '@app/users/edit-user/edit-user.component';
import { AdvertisingComponent } from './advertising/advertising.component';

import { ElementComponent } from '@app/assay/element/element.component';
import { CreateElementComponent } from './assay/element/create-element/create-element.component';
import { EditElementComponent } from './assay/element/edit-element/edit-element.component';

import { SpecimenComponent } from '@app/assay/specimen/specimen.component';
import { CreateSpecimenComponent } from '@app/assay/specimen/create-specimen/create-specimen.component';
import { EditSpecimenComponent } from '@app/assay/specimen/edit-specimen/edit-specimen.component';

import { UnitComponent } from '@app/assay/unit/unit.component';
import { CreateUnitComponent } from '@app/assay/unit/create-unit/create-unit.component';
import { EditUnitComponent } from '@app/assay/unit/edit-unit/edit-unit.component';
import { OrganizationComponent } from './system/organization/organization.component';
import { AddOrganizationComponent } from './system/organization/add-organization/add-organization.component';
import { TemplateComponent } from './assay/template/template.component';
import { AddTemplateComponent } from './assay/template/add-template/add-template.component';
import { EditTemplateComponent } from './assay/template/edit-template/edit-template.component';
import { AddTplSpecimenComponent } from './assay/template/add-tplSpecimen/add-tplSpecimen.component';
import { AddTplElementComponent } from './assay/template/add-tplElement/add-tplElement.component';
import { EditTplSpecimenComponent } from './assay/template/edit-tplSpecimen/edit-tplSpecimen.component';
import { EditTplElementComponent } from './assay/template/edit-tplElement/edit-tplElement.component';
import { TokenComponent } from './assay/token/token.component';
import { AddTokenComponent } from './assay/token/add-token/add-token.component';
import { EditTokenComponent } from './assay/token/edit-token/edit-token.component';
import { UserTplComponent } from './assay/user-tpl/user-tpl.component';
import { EditUserTplComponent } from './assay/user-tpl/edit-user-tpl/edit-user-tpl.component';
import { DataInputComponent } from './assay/data-input/data-input.component';
import { DataSearchComponent } from './assay/data-search/data-search.component';
import { HistoryInputComponent } from './assay/history-input/history-input.component';
import { ListComponent } from './assay/list/list.component';
import { OrderSpecimenComponent } from './assay/template/order-specimen/order-specimen.component';
import { OrderElementComponent } from './assay/template/order-element/order-element.component';
import { AssayUserComponent } from './assay/user/user.component';
import { CreateAssayUserComponent } from './assay/user/create-oper/create-oper.component';
import { EditAssayUserComponent } from './assay/user/edit-oper/edit-oper.component';
import { SignDataInputComponent } from './assay/sign-data-input/sign-data-input.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ZtcodeComponent } from './system/ztcode/ztcode.component';
import { MultiTableSearchComponent } from './assay/multi-table-search/multi-table-search.component';
import { ZtMultiTableSearchComponent } from './assay/zt-multi-table-search/zt-multi-table-search.component';
import { OperUserTplComponent } from './assay/user-tpl/oper-user-tpl/oper-user-tpl.component';
import { StatisticExcelerComponent } from './assay/statistic/statistic-exceler/statistic-exceler.component';
import { XySignDataInputComponent } from './assay/xy-sign-data-input/xy-sign-data-input.component';
import { UsrDataSearchComponent } from './assay/usr-data-search/usr-data-search.component';
import { ChartsComponent } from './assay/charts/charts.component';
import { CrossTemplateSearchComponent } from './assay/cross-template-search/cross-template-search.component';
import { EquationComponent } from './process/equation/equation.component';
import { FormulaEditComponent } from './process/equation/edit/formulaEdit.component';
import { ConstComponent } from './process/const/const.component';
// import { EquipmentComponent } from './process/equipment/equipment.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    LayoutModule,
    SharedModule,
  ],
  declarations: [
    HomeComponent,
    AboutComponent,
    TenantsComponent,
    UsersComponent,
    RolesComponent,
    CreateTenantComponent,
    EditTenantComponent,
    CreateRoleComponent,
    EditRoleComponent,
    CreateUserComponent,
    EditUserComponent,
    AdvertisingComponent,
    ElementComponent,
    CreateElementComponent,
    EditElementComponent,
    SpecimenComponent,
    CreateSpecimenComponent,
    EditSpecimenComponent,
    UnitComponent,
    EditUnitComponent,
    CreateUnitComponent,
    OrganizationComponent,
    AddOrganizationComponent,
    TemplateComponent,
    AddTemplateComponent,
    EditTemplateComponent,
    EditTplSpecimenComponent,
    AddTplSpecimenComponent,
    AddTplElementComponent,
    EditTplElementComponent,
    TokenComponent,
    AddTokenComponent,
    EditTokenComponent,
    UserTplComponent,
    EditUserTplComponent,
    DataInputComponent,
    DataSearchComponent,
    HistoryInputComponent,
    ListComponent,
    OrderSpecimenComponent,
    OrderElementComponent,
    AssayUserComponent,
    CreateAssayUserComponent,
    EditAssayUserComponent,
    SignDataInputComponent,
    WelcomeComponent,
    ZtcodeComponent,
    MultiTableSearchComponent,
    ZtMultiTableSearchComponent,
    OperUserTplComponent,
    StatisticExcelerComponent,
    XySignDataInputComponent,
    UsrDataSearchComponent,
    ChartsComponent,
    CrossTemplateSearchComponent,
    EquationComponent,
    FormulaEditComponent,
    ConstComponent,
    // EquipmentComponent,
  ],
  entryComponents: [
    CreateTenantComponent,
    EditTenantComponent,
    CreateRoleComponent,
    EditRoleComponent,
    CreateUserComponent,
    EditUserComponent,
    AdvertisingComponent,
    CreateElementComponent,
    EditElementComponent,
    CreateSpecimenComponent,
    EditSpecimenComponent,
    CreateUnitComponent,
    EditUnitComponent,
    AddOrganizationComponent,
    AddTemplateComponent,
    EditTemplateComponent,
    EditTplSpecimenComponent,
    AddTplSpecimenComponent,
    AddTplElementComponent,
    EditTplElementComponent,
    AddTokenComponent,
    EditTokenComponent,
    EditUserTplComponent,
    OrderSpecimenComponent,
    OrderElementComponent,
    CreateAssayUserComponent,
    EditAssayUserComponent,
    FormulaEditComponent,
  ],
})
export class AppModule { }
