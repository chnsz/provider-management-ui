import {Space, Table, Tag} from 'antd';
import type {ColumnsType} from 'antd/es/table';
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
            width: 150,
        },
        {
            title: 'API名称',
            dataIndex: 'apiName',
            width: 450,
            ellipsis: true,
            render: (v, record) => record.id === 0 ? '' : <>{v} / {record.apiNameEn}</>
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
            width: 120,
            align: 'center',
            render: (v, record) => {
                if (record.id <= 0) {
                    return <Tag color={'red'}>未采集</Tag>;
                }

                switch (v) {
                    case '':
                    case 'online':
                        return <Tag color='blue'>开放中</Tag>;
                    case 'offline':
                        return <Tag color='orange'>已下线</Tag>;
                    case 'unpublished':
                        return <Tag color='geekblue'>线下API</Tag>;
                    default:
                        return <Tag>{v}</Tag>;
                }
            }
        },
    ];
    if (data) {
        data.forEach((t, n) => {
            if (t.id === 0) {
                t.id = -1 - n
            }
        });
    }

    return (
        <>
            <div className={'summary-container'} style={{padding: '6px 0'}}>
                <div style={{height: '45vh'}}>
                    <Scrollbars>
                        <Table columns={columns}
                               dataSource={data}
                               pagination={false}
                               size={'small'}
                               rowKey={(record) => record.id}
                        />
                    </Scrollbars>
                </div>
                <div style={{marginTop: '15px'}}>
                    <Space size={30}>
                        <span><Tag color='blue'>开放中</Tag>已经发布的 API</span>
                        <span><Tag color='orange'>已下线</Tag>API 已下线</span>
                        <span><Tag color='geekblue'>线下API</Tag>线下的 API</span>
                        <span><Tag color={'red'}>未采集</Tag>没有匹配到采集的 API，或者匹配到多个</span>
                    </Space>
                </div>
            </div>
        </>
    );
};
export default ProviderApiList;
