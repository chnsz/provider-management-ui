import {DeleteOutlined} from '@ant-design/icons';
import {Button, Input, notification, Select, Space, Table} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import React, {useEffect, useState} from 'react';

interface DataType {
    key: string;
    providerType: string;
    providerName: string;
}

const options = [
    {
        value: 'DataSource',
        label: 'DataSource',
    },
    {
        value: 'Resource',
        label: 'Resource',
    },
];

type RelationProviderProps = {
    providerList: Relation.ProviderRelation[];
    onChange: (data: Relation.ProviderRelation[]) => any;
};

const RelationProvider: React.FC<RelationProviderProps> = ({providerList, onChange}) => {
    const [notificationApi, contextHolder] = notification.useNotification();

    const [data, setData] = useState<DataType[]>([]);
    const [providerType, setProviderType] = useState<string>(options[0].value);
    const [providerName, setProviderName] = useState<string>('');

    const onDelete = (row: DataType) => {
        return () => {
            const arr = providerList
                .filter(t => t.providerName !== row.providerName && t.providerType !== row.providerType)
            onChange(arr);
        };
    };

    const onAdd = () => {
        const arr = providerList
            .filter((t) => t.providerName === providerName && t.providerType === providerType)
        if (arr.length > 0) {
            notificationApi['error']({
                message: '操作失败',
                description: '重复，已存在相同类型和名称的资源',
            });
            return;
        }

        const pr: Relation.ProviderRelation = {
            id: (providerList || []).length + 1,
            dataType: 'provider_planning',
            providerType: providerType,
            providerName: providerName,
        }
        onChange([...providerList, pr]);
        setProviderName('');
    };

    const columns: ColumnsType<DataType> = [
        {
            title: '类型',
            dataIndex: 'providerType',
            key: 'providerType',
            align: 'center',
            width: 120,
        },
        {
            title: '名称',
            dataIndex: 'providerName',
            ellipsis: true,
            key: 'providerName',
        },
        {
            key: 'action',
            width: 50,
            align: 'center',
            render: (v, row) => {
                return (
                    <Space size="middle">
                        <a onClick={onDelete(row)}>
                            <DeleteOutlined/>
                        </a>
                    </Space>
                );
            },
        },
    ];

    useEffect(() => {
        const arr = providerList.map((t) => {
            return {
                key: '' + t.id,
                providerType: t.providerType,
                providerName: t.providerName,
            };
        });
        setData(arr);
    }, [providerList]);

    return (
        <>
            {contextHolder}
            <Table columns={columns} dataSource={data} pagination={false} scroll={{y: 400}}/>
            <div style={{padding: '15px'}}>
                <Space.Compact style={{width: '100%'}}>
                    <Select
                        defaultValue="DataSource"
                        options={options}
                        value={providerType}
                        onChange={(v) => setProviderType(v)}
                    />
                    <Input
                        placeholder={'请输入 provider 名称'}
                        value={providerName}
                        onChange={(e) => {
                            setProviderName(e.currentTarget.value);
                        }}
                    />
                    <Button type="primary" onClick={onAdd}>
                        新增
                    </Button>
                </Space.Compact>
            </div>
        </>
    );
};

export default RelationProvider;
