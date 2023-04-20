import ApiListDialog from '@/pages/ProviderPlanning/components/api-list-dialog';
import {DeleteOutlined} from '@ant-design/icons';
import {Space, Table} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import React from 'react';


type RelationApiProps = {
    productName: string;
    data: Api.Detail[];
    onChange: (data: Api.Detail[]) => any;
};

const RelationApi: React.FC<RelationApiProps> = ({productName, data, onChange}) => {

    const onDelete = (row: Api.Detail) => {
        return () => {
            const arr = data.filter(t => t.id !== row.id)
            onChange(arr);
        };
    };

    const onAdd = (idList: number[], rows: Api.Detail[]) => {
        onChange([...data, ...rows]);
    };

    const columns: ColumnsType<Api.Detail> = [
        {
            title: '服务',
            dataIndex: 'productName',
            key: 'productName',
            width: 90,
            align: 'center',
            ellipsis: true,
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
            render: (v, row) => {
                const title = row.apiName + '/' + row.apiNameEn + '（点击跳转 API Explorer）';
                const href = `https://apiexplorer.developer.huaweicloud.com/apiexplorer/doc?product=${row.productName}&api=${row.apiNameEn}`;
                return (
                    <a title={title} href={href} target={'_blank'} rel="noreferrer">
                        {row.apiName}/{row.apiNameEn}
                    </a>
                );
            },
        },
        {
            title: '方法/URI',
            dataIndex: 'method',
            key: 'method',
            width: 120,
            ellipsis: true,
            render: (v, row) => {
                return (
                    <span title={row.method + ' ' + row.uri}>
                        {row.method} {row.uri}
                    </span>
                );
            },
        },
        {
            key: 'action',
            width: 50,
            align: 'center',
            render: (v, row) => (
                <Space size="middle">
                    <a onClick={onDelete(row)}>
                        <DeleteOutlined/>
                    </a>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Table columns={columns}
                   dataSource={data}
                   pagination={false}
                   scroll={{y: 400}}
                   rowKey={(record) => record.id}
            />
            <div style={{padding: '12px', textAlign: 'center'}}>
                {/*<Button size={'small'} onClick={() => setIsDialogOpen(true)}>+ 新增绑定</Button>*/}
                <ApiListDialog
                    providerName={productName}
                    handle={(option: 'ok' | 'cancel', rows: Api.Detail[], idList: number[]) => {
                        if (option === 'ok') {
                            onAdd(idList, rows);
                        }
                    }}
                />
            </div>
        </>
    );
};

export default RelationApi;
