import ProviderApiList from '@/pages/Portal/components/provider-api-list';
import {CheckCircleOutlined, InfoCircleOutlined, MinusCircleOutlined} from '@ant-design/icons';
import {Modal, Switch, Table, Tabs, TabsProps} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import React, {useEffect, useState} from 'react';
import '../portal.less';
import {
    changeEpsSupport,
    changePrePaidSupport,
    changeTagSupport,
    changeUtFlag,
    getProviderList
} from "@/services/provider/api";
// @ts-ignore
import {Scrollbars} from 'react-custom-scrollbars';
import Provider from "@/pages/Provider";

const getFeatureState = (supportState: string, record: Provider.Provider) => {
    if (record.type === 'DataSource') {
        return <span><MinusCircleOutlined style={{color: 'rgba(0, 0, 0, 0.43)'}}/></span>
    }

    switch (supportState) {
        case 'true':
            return <span><CheckCircleOutlined style={{color: '#5ec829'}}/> 支持</span>
        case 'false':
            return <span><CheckCircleOutlined style={{color: '#faad14'}}/> 不支持</span>
    }

    return <span><InfoCircleOutlined style={{color: '#fa8c16'}} title={'未知'}/></span>
}

const ProviderListCard: React.FC<{ productName: string }> = ({productName}) => {
    const [data, setData] = useState<Provider.Provider[]>([]);
    const [g42Data, setG42Data] = useState<Provider.Provider[]>([]);
    const [flexibleEngineData, setFlexibleEngineData] = useState<Provider.Provider[]>([]);
    const [apiList, setApiList] = useState<Api.Detail[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showApiList = (record: Provider.Provider) => {
        return () => {
            setApiList(record.apiList);
            setIsModalOpen(true);
        }
    };

    useEffect(() => {
        getProviderList({cloudName: 'HuaweiCloud', productName: productName}, 100, 1)
            .then((rsp) => {
                setData(rsp.items);
            });

        getProviderList({cloudName: 'G42Cloud', productName: productName}, 100, 1)
            .then((rsp) => {
                setG42Data(rsp.items);
            });
        getProviderList({cloudName: 'FlexibleEngineCloud', productName: productName}, 100, 1)
            .then((rsp) => {
                setFlexibleEngineData(rsp.items);
            });
    }, [productName]);

    const onChange = (type: string, record: Provider.Provider) => {
        return (checked: boolean) => {
            switch (type) {
                case 'prePaidSupport':
                    changePrePaidSupport(record.id, checked ? 'true' : 'false');
                    return;
                case 'epsSupport':
                    changeEpsSupport(record.id, checked ? 'true' : 'false');
                    return;
                case 'tagSupport':
                    changeTagSupport(record.id, checked ? 'true' : 'false');
                    return;
                case 'utFlag':
                    changeUtFlag(record.id, checked ? 'full_coverage' : '-');
                    return;
            }
        };
    };

    const commonFeatureRender = (featType: string) => {
        return (text: string, record: Provider.Provider) => {
            if (record.type === 'DataSource') {
                return <span><MinusCircleOutlined style={{color: 'rgba(0, 0, 0, 0.43)'}}/></span>
            }
            return <Switch defaultChecked={text === 'true'} onChange={onChange(featType, record)}/>;
        }
    }

    const huaweiCloudColumns: ColumnsType<Provider.Provider> = [
        {
            title: '序号',
            dataIndex: 'serialNo',
            align: 'center',
            width: 80,
            render: (v, r, i) => i + 1,
        },
        {
            title: '资源类型',
            dataIndex: 'type',
            width: '8%',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            ellipsis: true,
            width: '16%',
        },
        {
            title: '名称',
            dataIndex: 'name',
            render: (name) => <a href="#">{name}</a>,
        },
        {
            title: '调用 API 个数',
            dataIndex: 'apiList',
            width: '10%',
            align: 'center',
            render: (val, record) => (
                <a type="button" onClick={showApiList(record)}>
                    {(val || []).length}
                </a>
            ),
        },
        {
            title: 'UT 覆盖率（%）',
            width: '120px',
            align: 'center',
            dataIndex: 'utCoverage',
            render: (text, record) => {
                return (
                    <>
                        <Switch style={{width: '60px'}}
                                defaultChecked={record.utFlag === 'full_coverage'}
                                checkedChildren={text}
                                unCheckedChildren={text}
                                onChange={onChange('utFlag', record)}
                        />
                    </>
                );
            },
        },
        {
            title: '包周期',
            width: '7%',
            align: 'center',
            dataIndex: 'prePaidSupport',
            render: commonFeatureRender('prePaidSupport'),
        },
        {
            title: '标签',
            width: '7%',
            align: 'center',
            dataIndex: 'tagSupport',
            render: commonFeatureRender('tagSupport'),
        },
        {
            title: '企业项目',
            width: '7%',
            align: 'center',
            dataIndex: 'epsSupport',
            render: commonFeatureRender('epsSupport'),
        },
    ];

    const partnerColumns: ColumnsType<Provider.Provider> = [
        {
            title: '序号',
            dataIndex: 'serialNo',
            align: 'center',
            width: 80,
            render: (v, r, i) => i + 1,
        },
        {
            title: '资源类型',
            dataIndex: 'type',
            width: '8%',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            ellipsis: true,
            width: '16%',
        },
        {
            title: '名称',
            dataIndex: 'name',
            render: (name) => <a href="#">{name}</a>,
        },
        {
            title: '包周期',
            width: '7%',
            align: 'center',
            dataIndex: 'prePaidSupport',
            render: commonFeatureRender('prePaidSupport'),
        },
        {
            title: '标签',
            width: '7%',
            align: 'center',
            dataIndex: 'tagSupport',
            render: commonFeatureRender('tagSupport'),
        },
        {
            title: '企业项目',
            width: '7%',
            align: 'center',
            dataIndex: 'epsSupport',
            render: commonFeatureRender('epsSupport'),
        },
    ];

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: <>华为云 ({data.length})</>,
            children: <div style={{height: '380px'}}>
                <Scrollbars>
                    <Table size={'middle'}
                           columns={huaweiCloudColumns}
                           dataSource={data}
                           pagination={false}
                           rowKey={(record) => record.id}
                    />
                </Scrollbars>
            </div>,
        },
        {
            key: '2',
            label: <>法电 ({flexibleEngineData.length})</>,
            children: <div style={{height: '380px'}}>
                <Scrollbars>
                    <Table size={'middle'}
                           columns={partnerColumns}
                           dataSource={flexibleEngineData}
                           pagination={false}
                           rowKey={(record) => record.id}
                    />
                </Scrollbars>
            </div>,
        },
        {
            key: '3',
            label: <>G42 ({g42Data.length})</>,
            children: <div style={{height: '380px'}}>
                <Scrollbars>
                    <Table size={'middle'}
                           columns={partnerColumns}
                           dataSource={g42Data}
                           pagination={false}
                           rowKey={(record) => record.id}
                    />
                </Scrollbars>
            </div>,
        },
    ];

    return (
        <>
            <div className={'portal-card'}>
                <div className={'header'}>Provider 列表</div>
                <div className={'container'}>
                    <Tabs defaultActiveKey="1" items={items}/>
                </div>
            </div>
            <Modal
                title="引用API个数"
                transitionName={''}
                destroyOnClose
                open={isModalOpen}
                footer={null}
                onCancel={() => setIsModalOpen(false)}
                width={1400}
            >
                <ProviderApiList data={apiList}/>
            </Modal>
        </>
    );
};
export default ProviderListCard;
