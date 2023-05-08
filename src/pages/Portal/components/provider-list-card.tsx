import ProviderApiList from '@/pages/Portal/components/provider-api-list';
import {CheckCircleOutlined, InfoCircleOutlined, MinusCircleOutlined} from '@ant-design/icons';
import {Modal, Table, Tabs, TabsProps} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import React, {useEffect, useState} from 'react';
import '../portal.less';
import {getProviderList} from "@/services/provider/api";
// @ts-ignore
import {Scrollbars} from 'react-custom-scrollbars';

const getFeatureState = (supportState: string, record: Provider.Provider) => {
    if(record.type === 'DataSource'){
        return <span><MinusCircleOutlined style={{color: 'rgba(0, 0, 0, 0.43)'}}/></span>
    }

    switch (supportState) {
        case '1':
            return <span><CheckCircleOutlined style={{color: '#5ec829'}}/> 支持</span>
        case '0':
            return <span><CheckCircleOutlined style={{color: '#faad14'}}/> 不支持</span>
    }

    return <span><InfoCircleOutlined  style={{color: '#fa8c16'}}/> 未知</span>
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
            width: '14%',
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
            title: '法电',
            dataIndex: 'orangeCloud',
            width: '6%',
            align: 'center',
        },
        {
            title: 'G42',
            dataIndex: 'g42Cloud',
            width: '6%',
            align: 'center',
        },
        {
            title: '企业项目',
            dataIndex: 'epsSupport',
            align: 'center',
            width: '8%',
            render: getFeatureState,
        },
        {
            title: '标签',
            dataIndex: 'tagSupport',
            align: 'center',
            width: '8%',
            render: getFeatureState,
        },
        {
            title: '包周期',
            dataIndex: 'prePaidSupport',
            align: 'center',
            width: '8%',
            render: getFeatureState,
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
            width: '14%',
        },
        {
            title: '名称',
            dataIndex: 'name',
            render: (name) => <a href="#">{name}</a>,
        },
        {
            title: '企业项目',
            dataIndex: 'epsSupport',
            align: 'center',
            width: '8%',
            render: getFeatureState,
        },
        {
            title: '标签',
            dataIndex: 'tagSupport',
            align: 'center',
            width: '8%',
            render: getFeatureState,
        },
        {
            title: '包周期',
            dataIndex: 'prePaidSupport',
            align: 'center',
            width: '8%',
            render: getFeatureState,
        },
    ];

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: <>华为云 ({data.length})</>,
            children: <div style={{height: '380px'}}>
                <Scrollbars>
                    <Table size={'small'}
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
                    <Table size={'small'}
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
                    <Table size={'small'}
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
