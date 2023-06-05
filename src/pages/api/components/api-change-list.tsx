import { getApiChangeHistory } from '@/services/api/api';
import { toShortDate } from '@/utils/common';
import { Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';

type changeId = {
    id: number;
};
const ApiChangeList: React.FC<changeId> = ({ id }) => {
    interface ApiChange {
        key: React.Key;
        id: number;
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
            render: toShortDate,
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
            render: (v, row) => {
                const title = '（点击跳转 API 变更详情）';
                const href = `/api/api-change#/id/${row.id}`;
                return (
                    <div>
                        <a title={title} href={href} target={'_blank'} rel="noreferrer">
                            {v}
                        </a>
                    </div>
                );
            },
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
            render: (v) => {
                if (v === 'null') {
                    return '';
                }
                const arr = JSON.parse(v);
                const nodes = (arr as string[]).map((node, index) => {
                    return <div key={index}>{node}</div>;
                });
                return <div>{nodes}</div>;
            },
        },
    ];

    const [data, setData] = useState<ApiChange[]>([]);
    useEffect(() => {
        getApiChangeHistory(id).then((rsp) => {
            const ary = rsp.items.map((t: Api.ChangeHistory) => {
                return {
                    key: t.id,
                    id: t.id,
                    apiGroup: t.apiGroup,
                    apiName: t.apiName,
                    uri: t.uri,
                    lastVersionDate: t.lastVersionDate,
                    affectStatus: t.affectStatus,
                    method: t.method,
                    providers: t.providers,
                };
            });
            setData(ary);
        });
    }, [id]);

    return (
        <>
            <div>
                <Table columns={columns} dataSource={data} pagination={false} />
            </div>
        </>
    );
};
export default ApiChangeList;
