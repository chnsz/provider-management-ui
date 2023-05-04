import Category from '@/pages/Settings/components/category';
import Panel from '@/pages/Settings/components/panel';
import ServiceConfig from '@/pages/Settings/components/service-config';
import State from '@/pages/Settings/components/state';
import User from '@/pages/Settings/components/user';
import { Layout, Menu, theme } from 'antd';
import React, { useState } from 'react';

const { Sider } = Layout;

const { Item } = Menu;

type SettingsStateKeys = 'serviceConfig' | 'category' | 'user' | 'panel' | 'state';
type SettingsState = {
    mode: 'inline' | 'horizontal';
    selectKey: SettingsStateKeys;
};

const Serve: React.FC = () => {
    const menuMap: Record<string, React.ReactNode> = {
        serviceConfig: '服务配置',
        category: 'Category 与服务关系',
        user: '用户配置',
        panel: '看板配置',
        state: '状态映射',
    };

    const [initConfig, setInitConfig] = useState<SettingsState>({
        mode: 'inline',
        selectKey: 'serviceConfig',
    });

    const getMenu = () => {
        return Object.keys(menuMap).map((item) => <Item key={item}>{menuMap[item]}</Item>);
    };

    const renderChildren = () => {
        const { selectKey } = initConfig;
        switch (selectKey) {
            case 'serviceConfig':
                return <ServiceConfig />;
            case 'category':
                return <Category />;
            case 'user':
                return <User />;
            case 'panel':
                return <Panel />;
            case 'state':
                return <State />;
            default:
                return null;
        }
    };

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Layout>
            <Sider trigger={null} style={{ background: colorBgContainer }}>
                <Menu
                    mode={initConfig.mode}
                    selectedKeys={[initConfig.selectKey]}
                    onClick={({ key }) => {
                        setInitConfig({
                            ...initConfig,
                            selectKey: key as SettingsStateKeys,
                        });
                    }}
                >
                    {getMenu()}
                </Menu>
            </Sider>
            <Layout>
                <div>{renderChildren()}</div>
            </Layout>
        </Layout>
    );
};

export default Serve;
