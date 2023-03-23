import { getApiChangeSum } from '@/services/api/api';
import { Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

const ApiChangeList: React.FC = () => {
    interface ApiChange {
        key: React.Key;
        lastVersionDate: string;
        affectStatus: string;
        apiGroup: string;
        apiName: string;
        uri: string;
        method: string;
        providers: string;
    }

    const columns: ColumnsType<ApiChange> = [
        {
            title: '日期',
            dataIndex: 'lastVersionDate',
            key: 'lastVersionDate',
            width: 120,
            render: () => {
                const dateTime = moment().format('YYYY-MM-DD');
                return dateTime;
            },
        },
        {
            title: '状态',
            dataIndex: 'affectStatus',
            key: 'affectStatus',
            render: (val) => {
                switch (val) {
                    case 'need_analysis':
                        return <Tag color="orange">待分析</Tag>;
                    case 'processing':
                        return <Tag color="cyan">处理中</Tag>;
                    case 'close':
                        return <Tag>已关闭</Tag>;
                }
                return <Tag>{val}</Tag>;
            },
        },
        {
            title: 'API分组',
            dataIndex: 'apiGroup',
            key: 'apiGroup',
        },
        {
            title: 'API名称',
            dataIndex: 'apiName',
            key: 'apiName',
            render: (APIName) => <a href="#">{APIName}</a>,
        },
        {
            title: 'URI',
            dataIndex: 'uri',
            key: 'uri',
            render: (v, row) => {
                return (
                    <>
                        <Tag>{row.method}</Tag> {row.uri}
                    </>
                );
            },
        },
        {
            title: '资源信息',
            dataIndex: 'providers',
            key: 'providers',
            // render: (providers) => (
            //         <a href="#">{providers}</a>
            // ),
            render: (providers) => {
                return <a href="#">{JSON.parse(providers)}</a>;
            },
        },
    ];

    const [data, setData] = useState<ApiChange[]>([]);
    const [apiId, setApiId] = useState<number>(0);

    useEffect(() => {
        getApiChangeSum({}, apiId).then((rsp) => {
            const arary = rsp.items.map((t: Api.ApiChange) => {
                return {
                    key: t.id,
                    apiGroup: t.apiGroup,
                    apiName: t.apiName,
                    uri: t.uri,
                    lastVersionDate: t.lastVersionDate,
                    affectStatus: t.affectStatus,
                    method: t.method,
                    providers: t.providers,
                };
            });
            setData(arary);
            setApiId(apiId);
        });
    }, [apiId]);

    return (
        <>
            <div>
                <Table columns={columns} dataSource={data} pagination={false} />
            </div>
        </>
    );
};
export default ApiChangeList;
