import { Menu } from '@delon/theme';

// 全局的左侧导航菜单
export class AppMenus {
    // new
    static Menus: Menu[] = [
        {
            text: "",
            i18n: "SystemManager",
            acl: "Pages.System",
            icon: { type: "icon", value: "home" },
            children: [
                {
                    text: "角色管理",
                    i18n: "Roles",
                    acl: "Pages.Roles",
                    icon: { type: "icon", value: "safety" },
                    link: "/app/roles",

                },
                {
                    text: "用户管理",
                    i18n: "Users",
                    acl: "Pages.Users",
                    icon: { type: "icon", value: "user" },
                    link: "/app/users",
                },
                {
                    text: "组织管理",
                    i18n: "OrganizationManager",
                    acl: "Pages.System.Organization",
                    icon: { type: "icon", value: "user" },
                    link: "/app/organization",
                },
                {
                    text: "帐套管理",
                    i18n: "ZtCode",
                    acl: "Pages.System.ZtCode",
                    icon: { type: "icon", value: "user" },
                    link: "/app/ztCode",
                },
            ]
        },
        {
            text: "化验基础数据管理",
            i18n: "",
            acl: "Pages.Assay",
            icon: { type: "icon", value: "home" },
            children: [
                {
                    text: "元素管理",
                    i18n: "ElementManager",
                    acl: "Pages.Assay.Element",
                    icon: { type: "icon", value: "info-circle" },
                    link: "/app/element",
                },
                {
                    text: "样本管理",
                    i18n: "SpecimenManager",
                    acl: "Pages.Assay.Specimen",
                    icon: { type: "icon", value: "info-circle" },
                    link: "/app/specimen",
                },
                {
                    text: "单位管理",
                    i18n: "UnitManager",
                    acl: "Pages.Assay.Unit",
                    icon: { type: "icon", value: "info-circle" },
                    link: "/app/unit",
                },
                {
                    text: "化验模板管理",
                    i18n: "TemplateManager",
                    acl: "Pages.Assay.Template",
                    icon: { type: "icon", value: "info-circle" },
                    link: "/app/template",
                },
                {
                    text: "令牌管理",
                    i18n: "TokenManager",
                    acl: "Pages.Assay.Token",
                    icon: { type: "icon", value: "info-circle" },
                    link: "/app/token",
                },
                {
                    text: "用户模板",
                    i18n: "UserTplManager",
                    acl: "Pages.Assay.UserTpl",
                    icon: { type: "icon", value: "info-circle" },
                    link: "/app/userTpl",
                },
                {
                    text: "操作员管理",
                    i18n: "",
                    acl: "Pages.Assay.Oper",
                    icon: { type: "icon", value: "info-circle" },
                    link: "/app/assayUser",
                },
            ]
        },
        {
            text: "化验录入",
            i18n: "",
            acl: "Pages.AssayInput",
            icon: { type: "icon", value: "home" },
            children: [
                {
                    text: "数据录入",
                    i18n: "",
                    acl: "Pages.AssayInput.DataInput",
                    icon: { type: "icon", value: "info-circle" },
                    link: "/app/dataInput",
                },
                {
                    text: "签到录入",
                    i18n: "",
                    acl: "Pages.Assay.SearchInput",
                    icon: { type: "icon", value: "info-circle" },
                    link: "/app/signDataInput",
                },
            ]
        },
        {
            text: "数据查询",
            i18n: "",
            acl: "Pages.AssaySearch",
            icon: { type: "icon", value: "home" },
            children: [
                {
                    text: "数据查询",
                    i18n: "",
                    acl: "Pages.AssaySearch.SimpleSearch",
                    icon: { type: "icon", value: "info-circle" },
                    link: "/app/dataSearch",
                },
            ]
        }
    ];
}