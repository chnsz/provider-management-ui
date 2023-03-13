import Footer from '@/components/Footer';
import type {MenuDataItem, ProLayoutProps, Settings} from '@ant-design/pro-layout';
import ProLayout from '@ant-design/pro-layout';
import {useIntl} from '@umijs/max';
import React from 'react';
import {Link} from 'umi';

export type BasicLayoutProps = {
    breadcrumbNameMap: Record<string, MenuDataItem>;
    route: ProLayoutProps['route'] & {
        authority: string[];
    };
    settings: Settings;
} & ProLayoutProps;

export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
    breadcrumbNameMap: Record<string, MenuDataItem>;
};

const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
    menuList.map((item) => {
        return {
            ...item,
            children: item.children ? menuDataRender(item.children) : undefined,
        };
    });

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
    const {
        children,
        location = {
            pathname: '/',
        },
    } = props;

    const {formatMessage} = useIntl();

    return (
        <ProLayout
            logo="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
            formatMessage={formatMessage}
            {...props}
            onMenuHeaderClick={() => history.push('/')}
            menuItemRender={(menuItemProps, defaultDom) => {
                if (
                    menuItemProps.isUrl ||
                    !menuItemProps.path ||
                    location.pathname === menuItemProps.path
                ) {
                    return defaultDom;
                }
                return <Link to={menuItemProps.path}>{defaultDom}</Link>;
            }}
            breadcrumbRender={(routers = []) => [
                {
                    path: '/',
                    breadcrumbName: formatMessage({id: 'menu.home'}),
                },
                ...routers,
            ]}
            itemRender={(route, params, routes, paths) => {
                const first = routes.indexOf(route) === 0;
                return first ? (
                    <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
                ) : (
                    <span>{route.breadcrumbName}</span>
                );
            }}
            footerRender={() => <Footer/>}
            menuDataRender={menuDataRender}
            // rightContentRender={() => <ApiDefinition />}
        >
            {children}
        </ProLayout>
    );
};

export default BasicLayout;
