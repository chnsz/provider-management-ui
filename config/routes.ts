export default [
    {
        path: '/',
        redirect: '/huaweicloud',
    },
    {
        path: '/home',
        redirect: '/huaweicloud',
    },
    {
        path: '/huaweicloud',
        name: 'huaweicloud',
        component: './Portal/index',
    },
    {
        path: '/partner-cloud',
        name: 'partnerCloud',
        // component: './Partner/portal',
        component: './Partner/index',
    },
    {
        path: '/quality-portal',
        name: 'qualityPortal',
        component: './Provider/quality-portal',
    },
    {
        path: '/api-change-analysis',
        name: 'api-change-analysis',
        component: './ApiChange/index',
    },
    {
        path: '/tools',
        name: 'tools',
        // access: 'partnerRole',
        routes: [
            {
                path: '/tools/ut-code-conversion',
                name: 'convertProviderName',
                component: './Partner/convert-provider-name',
                // access: 'partnerRole',
            },
            {
                path: '/tools/pr-validator',
                name: 'pr-validator',
                component: './Partner/pr-validator',
                access: 'prValidatorRole',
            },
        ],
    },
    {
        path: '/settings',
        name: 'settings',
        component: './Settings/index',
        access: 'settingRole',
    },
    {
        path: '/auto-generate-provider-list',
        name: 'auto-generate-provider-list',
        component: './AutoGenerateList/index',
    },
    {
        path: '/account/settings',
        name: 'account.settings',
        hideInMenu: true,
        component: './User/user-setting',
    },
    {
        path: '/account/changePwd',
        name: 'account.changePwd',
        hideInMenu: true,
        component: './User/change-pwd',
    },
    //------------------------------------
    {
        path: '/provider-base',
        redirect: '/quality-portal',
    },
    {
        path: '/service',
        hideInMenu: true,
        name: 'portal',
        component: './Portal/service_portal',
    },
    {
        path: '/product-feature',
        name: 'product_feature',
        hideInMenu: true,
        component: './ProductFeature/index',
    },
    {
        path: '/provider-planning',
        name: 'provider_planning',
        hideInMenu: true,
        component: './ProviderPlanning/index',
    },
    {
        path: '/task',
        name: 'task',
        hideInMenu: true,
        component: './Task/index',
    },
    {
        path: '/notice',
        name: 'notice',
        hideInMenu: true,
        component: './Notice/index',
    },
    {
        path: '/auto-generate-provider',
        name: 'auto-generate-provider',
        hideInMenu: true,
        component: './AutoGenerate/index',
    },
    //-----------------------------------------------------------------
    {
        path: '/user',
        layout: false,
        routes: [
            {
                name: 'login',
                path: '/user/login',
                component: './User/Login',
            },
            {
                component: './404',
            },
        ],
    },
    {
        path: '/admin',
        name: 'admin',
        icon: 'crown',
        access: 'canAdmin',
        routes: [
            {
                path: '/admin/sub-page',
                name: 'sub-page',
                component: './Welcome',
            },
        ],
    },
    {
        component: './404',
    },
];
