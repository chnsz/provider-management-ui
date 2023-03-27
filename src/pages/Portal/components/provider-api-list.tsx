import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React from 'react';

interface ProApiInfoCar {
    key: string;
    serviceName: string;
    apiname: string;
    apimethod: string;
    apiurl: string;
    apistatus: string;
}

const ProviderApiList: React.FC = () => {
    const data: ProApiInfoCar[] = [
        {
            key: '1',
            serviceName: 'John Brown',
            apiname: 'huawei',
            apimethod: 'New York No. 1 Lake Park',
            apiurl: 'https://www.baidu.com/',
            apistatus: 'online',
        },
        {
            key: '1',
            serviceName: 'John Brown',
            apiname: 'huawei',
            apimethod: 'New York No. 1 Lake Park',
            apiurl: 'https://ant.design/components/modal-cn#modalmethod',
            apistatus: 'online',
        },
        {
            key: '1',
            serviceName: 'John Brown',
            apiname: 'huawei',
            apimethod: 'New York No. 1 Lake Park',
            apiurl: 'https://www.baidu.com/',
            apistatus: 'online',
        },
    ];

    const columns: ColumnsType<ProApiInfoCar> = [
        {
            title: '服务名称',
            dataIndex: 'serviceName',
            key: 'serviceName',
        },
        {
            title: 'API名称',
            dataIndex: 'apiname',
            key: 'apiname',
        },
        {
            title: '方法',
            dataIndex: 'apimethod',
            key: 'apimethod',
            render: (name) => <text>{name}</text>,
        },
        {
            title: 'URI',
            key: 'apiurl',
            dataIndex: 'apiurl',
            render: (apicount) => <text type="button">{apicount}</text>,
        },
        {
            title: 'API状态',
            key: 'apistatus',
            dataIndex: 'apistatus',
        },
    ];

    return (
        <>
            <div className={'summary-container'}>
                <Table columns={columns} dataSource={data} pagination={false} />
            </div>
        </>
    );
};
export default ProviderApiList;
