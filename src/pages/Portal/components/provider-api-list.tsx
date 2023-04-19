import {Table, Tag} from 'antd';
import {ColumnsType} from 'antd/es/table';
import React from 'react';
// @ts-ignore
import {Scrollbars} from 'react-custom-scrollbars';

const ProviderApiList: React.FC<{ data: Api.Detail[] }> = ({data}) => {
    const columns: ColumnsType<Api.Detail> = [
        {
            title: '序号',
            dataIndex: 'sn',
            align: 'center',
            width: 80,
            render: (v, r, i) => i + 1,
        },
        {
            title: '服务名称',
            dataIndex: 'productName',
            width: 200,
        },
        {
            title: 'API名称',
            dataIndex: 'apiName',
            width: 450,
            ellipsis: true,
            render: (v, record) => <>{v} / {record.apiNameEn}</>
        },
        {
            title: 'URI',
            key: 'uri',
            ellipsis: true,
            render: (v, record) => <><Tag>{record.method}</Tag>{record.uri}</>
        },
        {
            title: '状态',
            dataIndex: 'publishStatus',
            width: 100,
            align: 'center',
            render: (v) => {
                switch (v) {
                    case 'online':
                        return <Tag color="blue">开放中</Tag>
                    case 'offline':
                        return <Tag color="orange">已下线</Tag>
                    case 'unpublished':
                        return <Tag color="geekblue">线下API</Tag>
                    default:
                        return <Tag>v</Tag>
                }
            }
        },
    ];
    data.forEach((t, n) => t.id = n);

    return (
        <>
            <div className={'summary-container'} style={{padding: '6px 0', height: '60vh'}}>
                <Scrollbars>
                    <Table columns={columns}
                        // dataSource={data.sort((a, b) => a.uri.localeCompare(b.uri))}
                           dataSource={data}
                           pagination={false}
                           size={'small'}
                           rowKey={(record) => record.id}
                    />
                </Scrollbars>
            </div>
        </>
    );
};
export default ProviderApiList;
