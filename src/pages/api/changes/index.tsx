import ApiChangeView from '@/pages/api/changes/components/change-view';
import Overview from '@/pages/api/changes/components/overview';
import {getApiChanges, getMenu} from '@/services/api';
import {useEmotionCss} from '@ant-design/use-emotion-css';
import type {MenuProps} from 'antd';
import {Col, Menu, Row, theme} from 'antd';
import type {ItemType} from 'antd/es/menu/hooks/useItems';
import type {SelectInfo} from 'rc-menu/es/interface';
import {useEffect, useState} from 'react';
// @ts-ignore
import {Scrollbars} from 'react-custom-scrollbars';

const getDefaultOpenKeys = (): string[] => {
    let defaultOpenKeys: string[] = [];
    let hash = decodeURI(window.location.hash);
    if (hash.split('/').length >= 5) {
        hash = hash.substring(1);
        const arr = hash.split('/');
        // '/2023-02-24/IoT物联网/IoTDA/AMQP队列管理/删除AMQP队列_DELETE_DeleteQueue.html', '/2023-02-24/IoT物联网/IoTDA/AMQP队列管理', '/2023-02-24/IoT物联网/IoTDA', '/2023-02-24'
        defaultOpenKeys = [
            hash,
            `/${arr[1]}/${arr[2]}/${arr[3]}/${arr[4]}`,
            `/${arr[1]}/${arr[2]}/${arr[3]}`,
            `/${arr[1]}`,
        ];
    }
    return defaultOpenKeys;
};

export default () => {
    const {
        token: {colorBgContainer},
    } = theme.useToken();

    const [content, setContent] = useState<string>('');
    const [openKeys, setOpenKeys] = useState<string[]>(getDefaultOpenKeys());
    const [showOverview, setShowOverview] = useState<boolean>(true);
    const [menuItem, setMenuItem] = useState<ItemType[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

    const [productClass, setProductClass] = useState<string>('');
    const [serviceName, setServiceName] = useState<string>('');
    const [apiGroup, setApiGroup] = useState<string>('');
    const [apiName, setApiName] = useState<string>('');
    const [apiNameEn, setApiNameEn] = useState<string>('');

    const showContent = async (key: string) => {
        const data = await getApiChanges(key);
        setContent(
            data
                .replace('normal;font-size: 16px;', 'normal;font-size: 14px;')
                .replace('<div class="content">', '<div class="diff-content">'),
        );

        let arr = key.split('/');
        setProductClass(arr[2]);
        setServiceName(arr[3]);
        setApiGroup(arr[4]);
        setApiName(arr[5]);
        arr = arr[5].replace('.html', '').split('_');
        setApiNameEn(arr[arr.length - 1]);
    };

    const onSelect = (cfg: SelectInfo) => {
        setSelectedKeys([cfg.key]);
        if (cfg.key === 'overview') {
            setShowOverview(true);
            return;
        }
        setShowOverview(false);
        showContent(cfg.key);
        window.location.hash = `${cfg.key}`;
    };

    useEffect(() => {
        getMenu('menu-changes.json').then((data: ItemType[]) => {
            data.sort(
                (a: ItemType, b: ItemType) => 0 - a!.key!.toString().localeCompare(b!.key!.toString()),
            );
            data.unshift({
                key: 'overview',
                label: '汇总记录',
            });

            if (data && data.length > 0) {
                if (openKeys.length === 0) {
                    setOpenKeys([data[0]!.key!.toString()]);
                }
                setMenuItem(data);
            }
        });

        let hash = decodeURI(window.location.hash);
        if (hash.length < 2 || hash.split('/').length < 5) {
            return;
        }
        hash = hash.substring(1);
        setSelectedKeys([hash]);
        showContent(hash);
        setShowOverview(false);
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
        return {height: 'calc(100vh - 153px)', marginTop: '24px', background: '#f5f5f5'};
    });

    const menuClassName = useEmotionCss(() => {
        return {height: 'calc(100% - 75px)', background: '#fff'};
    });

    const contentClassName = useEmotionCss(() => {
        return {height: 'calc(100% - 125px)', background: '#fff'};
    });

    return (
        <Row className={containerClassName}>
            <Col span={5} style={{paddingRight: '24px'}}>
                <div style={{padding: '12px 0', background: colorBgContainer}}>
                    <h3 style={{marginLeft: '24px'}}>变更记录</h3>
                </div>
                <div className={menuClassName}>
                    <Scrollbars>
                        <Menu
                            mode="inline"
                            openKeys={openKeys}
                            selectedKeys={selectedKeys}
                            style={{borderRight: 0}}
                            items={menuItem}
                            onSelect={onSelect}
                            onOpenChange={onOpenChange}
                        />
                    </Scrollbars>
                </div>
            </Col>
            <Col span={19} style={{background: colorBgContainer, padding: '24px'}}>
                {showOverview ? (
                    <Overview/>
                ) : (
                    <div className={contentClassName}>
                        <ApiChangeView
                            id={0}
                            productClass={productClass}
                            serviceName={serviceName}
                            apiGroup={apiGroup}
                            apiName={apiName}
                            uri={''}
                            content={content}
                            apiNameEn={apiNameEn}
                        />
                    </div>
                )}
            </Col>
        </Row>
    );
};
