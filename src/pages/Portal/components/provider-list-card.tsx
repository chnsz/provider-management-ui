import ProviderApiList from '@/pages/Portal/components/provider-api-list';
import {CheckCircleOutlined} from '@ant-design/icons';
import {Modal, Table} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import React, {useEffect, useState} from 'react';
import '../portal.less';
import {getProviderList} from "@/services/provider/api";
// @ts-ignore
import {Scrollbars} from 'react-custom-scrollbars';


const getSupportState = (supportState: string) => {
    let color = '';
    let text = '';

    switch (supportState) {
        case '1':
            color = '#5ec829';
            text = '支持';
            break;

        default:
            color = '#faad14';
            text = '未上线';
    }
    return (
        <span><CheckCircleOutlined style={{color: color}}/> {text} </span>
    );
}

const ProviderListCard: React.FC<{ productName: string }> = ({productName}) => {
    const [data, setData] = useState<Provider.Provider[]>();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        getProviderList({cloudName: 'HuaweiCloud', productName: productName}, 100, 1)
            .then((rsp) => {
                setData(rsp.items);
            });
    }, [productName]);

    const columns: ColumnsType<Provider.Provider> = [
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
            width: '10%',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            width: '18%',
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
            render: (apiList) => (
                <a type="button" onClick={showModal}>
                    {(apiList || []).length}
                </a>
            ),
        },
        {
            title: '企业项目',
            dataIndex: 'epsSupport',
            align: 'center',
            width: '10%',
            render: getSupportState,
        },
        {
            title: '标签',
            dataIndex: 'tagSupport',
            align: 'center',
            width: '10%',
            render: getSupportState,
        },
        {
            title: '包周期',
            dataIndex: 'prePaidSupport',
            align: 'center',
            width: '10%',
            render: getSupportState,
        },
    ];

    return (
        <>
            <div className={'portal-card'}>
                <div className={'header'}>Provider 列表</div>
                <div className={'container'}>
                    <Scrollbars>
                        <Table size={'small'}
                               columns={columns}
                               dataSource={data}
                               pagination={false}
                               rowKey={(record) => record.id}
                        />
                    </Scrollbars>
                </div>
            </div>
            <Modal
                title="引用API个数"
                open={isModalOpen}
                footer={null}
                onCancel={handleCancel}
                width={1000}
            >
                <ProviderApiList/>
            </Modal>
        </>
    );
};
export default ProviderListCard;
