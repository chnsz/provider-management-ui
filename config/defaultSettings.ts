import { ProLayoutProps } from '@ant-design/pro-components';

/**
 * @name
 */
const Settings: ProLayoutProps & {
    pwa?: boolean;
    logo?: string;
} = {
    navTheme: 'light',
    title: 'Provider Management System',
    // 拂晓蓝
    colorPrimary: '#1890ff', // #1668dc
    layout: 'mix',
    contentWidth: 'Fluid',
    fixedHeader: true,
    fixSiderbar: true,
    splitMenus: true,
    colorWeak: false,
    pwa: true,
    logo: '/images/logo.svg',
    iconfontUrl: '',
    token: {
        // 参见ts声明，demo 见文档，通过token 修改样式
        //https://procomponents.ant.design/components/layout#%E9%80%9A%E8%BF%87-token-%E4%BF%AE%E6%94%B9%E6%A0%B7%E5%BC%8F
        header: {
            heightLayoutHeader: 55,
            colorBgHeader: '#292f33',
            colorHeaderTitle: '#fff',
            colorTextMenu: '#fff',
            colorTextMenuSecondary: '#fff',
            colorTextMenuSelected: '#fff !important',
            colorBgMenuItemSelected: '#1890ff', // '#22272b',
            colorBgMenuItemHover: '#1890ff',
            colorTextMenuActive: '#fff',
            colorTextRightActionsItem: '#fff',
        },

        colorTextAppListIconHover: '#fff',
        colorTextAppListIcon: '#dfdfdf',

        sider: {
            colorMenuBackground: '#fff',
            colorMenuItemDivider: '#dfdfdf',
            colorBgMenuItemHover: '#f6f6f6',
            colorTextMenu: '#595959',
            colorTextMenuSelected: '#242424',
            colorTextMenuActive: '#242424',
            colorBgMenuItemCollapsedHover: '#242424',
        },
        pageContainer: {
            paddingInlinePageContainerContent: 20,
            paddingBlockPageContainerContent: 0,
        },
    },
};

export default Settings;
