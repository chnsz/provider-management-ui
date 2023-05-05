import SearchBox from '@/pages/api/definition/search-box';
import { getApiDefinition, getMenu } from '@/services/api';
import { ProDescriptions } from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { Col, Menu, MenuProps, Row, theme } from 'antd';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import { SelectInfo } from 'rc-menu/es/interface';
import { useEffect, useState } from 'react';
// @ts-ignore
import { Scrollbars } from 'react-custom-scrollbars';

let menu: any[] = [];
(async () => await getMenu('menu-api.json'))().then((d) => (menu = d));

export default () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const [showGuider, setShowGuider] = useState<boolean>(true);
    const [menuItem, setMenuItem] = useState<ItemType[]>([]);
    const [content, setContent] = useState<string>('');
    const [openKeys, setOpenKeys] = useState<string[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    let lastValue = '';

    const [productClass, setProductClass] = useState<string>('');
    const [serviceName, setServiceName] = useState<string>('');
    const [apiGroup, setApiGroup] = useState<string>('');
    const [apiName, setApiName] = useState<string>('');
    const [apiNameEn, setApiNameEn] = useState<string>('');

    const onSearch = function (value: string) {
        if (lastValue === value) {
            return;
        }

        lastValue = value;
        const filtered: ItemType[] = menu.filter((item) => item!.label === value);
        setMenuItem(filtered);
        if (window.location.hash.length === 0) {
            setOpenKeys([filtered[0]!.key!.toString()]);
        }
    };

    const showContent = async (key: string) => {
        const data = await getApiDefinition(key);
        setContent(data);
        let arr = key.split('/');
        setProductClass(arr[1]);
        setServiceName(arr[2]);
        setApiGroup(arr[3]);
        setApiName(arr[4]);

        arr = arr[4].replace('.yaml', '').split('_');
        setApiNameEn(arr[arr.length - 1]);
    };

    const onSelect = (cfg: SelectInfo) => {
        setShowGuider(false);
        setSelectedKeys([cfg.key]);
        showContent(cfg.key);
        window.location.hash = `${cfg.key}`;
    };

    useEffect(() => {
        let hash = decodeURI(window.location.hash);
        if (hash.length < 2 || hash.split('/').length < 5) {
            onSearch('ECS');
            return;
        }
        hash = hash.substring(1);
        setSelectedKeys([hash]);
        const arr = hash.split('/');
        // setOpenKeys(['/计算/ECS/云服务器操作管理/通过请求ID查询云服务器行为_GET_NovaShowServerAction.yaml', '/计算/ECS/云服务器操作管理', '/计算/ECS']);
        setOpenKeys([hash, `/${arr[1]}/${arr[2]}/${arr[3]}`, `/${arr[1]}/${arr[2]}`]);
        onSearch(arr[2]);
        setShowGuider(false);
        showContent(hash);
    }, []);

    const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
        const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);

        if (!menuItem.find((t) => t!.key === latestOpenKey)) {
            setOpenKeys(keys);
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    };

    const containerClassName = useEmotionCss(() => {
        return { height: 'calc(100vh - 149px)', marginTop: '24px', background: '#f5f5f5' };
    });

    const menuClassName = useEmotionCss(() => {
        return { height: 'calc(100% - 120px)', background: '#fff' };
    });

    return (
        <Row className={containerClassName}>
            <Col span={3} style={{ paddingRight: '24px' }}>
                <div style={{ padding: '12px 0' }}>
                    <h3 style={{ marginLeft: '12px' }}>搜索服务</h3>
                    <SearchBox onSelect={onSearch} />
                </div>
                <div className={menuClassName}>
                    <Scrollbars>
                        <Menu
                            mode="inline"
                            openKeys={openKeys}
                            selectedKeys={selectedKeys}
                            style={{ borderRight: 0 }}
                            items={menuItem}
                            onSelect={onSelect}
                            onOpenChange={onOpenChange}
                        />
                    </Scrollbars>
                </div>
            </Col>
            <Col span={21} style={{ background: colorBgContainer, padding: '24px' }}>
                {showGuider ? (
                    <div style={{ textAlign: 'center', marginTop: '48px' }}>
                        <h2>操作说明</h2>
                        <img src="/images/guider.png" width={'1108px'} />
                    </div>
                ) : (
                    <Scrollbars>
                        <ProDescriptions column={16} title="API 定义">
                            <ProDescriptions.Item span={1} label="分类" valueType="text">
                                {productClass}
                            </ProDescriptions.Item>
                            <ProDescriptions.Item span={1} label="服务" valueType="text">
                                {serviceName}
                            </ProDescriptions.Item>
                            <ProDescriptions.Item span={2} label="API 分组" valueType="text">
                                {apiGroup}
                            </ProDescriptions.Item>
                            <ProDescriptions.Item span={12} label="API 名称" valueType="text">
                                {apiName}
                            </ProDescriptions.Item>

                            <ProDescriptions.Item span={16} label="在线调试" valueType="text">
                                <a
                                    href={`https://console.huaweicloud.com/apiexplorer/#/openapi/${serviceName}/doc?api=${apiNameEn}`}
                                    target={'_blank'}
                                    rel={'noopener noreferrer'}
                                >
                                    API Explorer
                                </a>
                            </ProDescriptions.Item>

                            <ProDescriptions.Item
                                valueType="code"
                                copyable
                                span={16}
                                contentStyle={{ width: '100vh', fontSize: '16px' }}
                            >
                                {content}
                            </ProDescriptions.Item>
                        </ProDescriptions>
                    </Scrollbars>
                )}
            </Col>
        </Row>
    );
};
