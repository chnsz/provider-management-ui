import { bindProviderPlanningProvider, unbindProviderPlanningProvider, } from '@/services/provider-planning/api';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Input, message, notification, Select, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';

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
    planningId: number;
    providerList: Relation.ProviderRelation[];
    onChange: (data: DataType[]) => any;
};

const RelationProvider: React.FC<RelationProviderProps> = ({
    planningId,
    providerList,
    onChange,
}) => {
    const [messageApi, contextHolder] = message.useMessage();

    const [data, setData] = useState<DataType[]>([]);
    const [providerType, setProviderType] = useState<string>(options[0].value);
    const [providerName, setProviderName] = useState<string>('');

    const onDelete = (row: DataType) => {
        return () => {
            unbindProviderPlanningProvider(planningId, row.providerType, row.providerName).then(() => {
                const arr = data.filter((t) => t.key !== row.key);
                setData(arr);
                onChange(arr);
            },
            );
        };
    };

    const onAdd = () => {
        if (
            data.filter((t) => t.providerName === providerName && t.providerType === providerType)
                .length > 0
        ) {
            messageApi.error('操作失败：已存在相同类型和名称的资源');
            return;
        }
        bindProviderPlanningProvider(planningId, providerType, providerName).then(() => {
            const arr = [...data];
            arr.push({
                key: providerType + '_' + providerName,
                providerType: providerType,
                providerName: providerName,
            });
            setData(arr);
            onChange(arr);
        });
        setProviderType(options[0].value);
        setProviderName('');
    };

    const columns: ColumnsType<DataType> = [
        {
            title: '类型',
            dataIndex: 'providerType',
            key: 'providerType',
            width: 120,
            align: 'center',
        },
        {
            title: '名称',
            dataIndex: 'providerName',
            key: 'providerName',
            ellipsis: true,
        },
        {
            key: 'action',
            width: 50,
            align: 'center',
            render: (v, row) => {
                return (
                    <Space size="middle">
                        <a onClick={onDelete(row)}>
                            <DeleteOutlined />
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
            <Table columns={columns} dataSource={data} pagination={false} scroll={{ y: 400 }} />
            <div style={{ padding: '15px' }}>
                <Space.Compact style={{ width: '100%' }}>
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
