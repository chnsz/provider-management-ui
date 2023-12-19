
import CustomBreadcrumb from '@/components/Breadcrumb';
import { deleteAutoGenerateData, getAutoGenerateList } from '@/services/auto-generate/api';
import { Button, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import DeleteBtn from "@/components/delete";
import './auto-generate-list.less';

// ID、服务名称、类型、资源名称、API数量、最后修改、修改日期、创建人、创建日期、操作（编辑、删除）
type AutoGenerateList = {
    id: number;
    serviceName: string;
    providerType: string;
    providerName: string;
    apiCount: number;
    lastUpdateBy: string;
    updated: string;
    createdBy: string;
    created: string;
};

const AutoGenerateList: React.FC = () => {
    const [data, setData] = useState<AutoGenerateList[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const [pageNum, setPageNum] = useState<number>(1);

    const loadData = (pageSize: number, pageNum: number) => {
        getAutoGenerateList(pageSize, pageNum).then((d) => {
            const listData = d.items.map(item => {
                return {
                    id: item.id,
                    serviceName: item.productName || '--',
                    providerType: item.providerType,
                    providerName: item.providerName,
                    apiCount: item.apiCount,
                    lastUpdateBy: item.lastUpdateBy || '--',
                    updated: item.updated,
                    createdBy: item.createdBy || '--',
                    created: item.created
                }
            });
            setData(listData);
            setTotal(d?.total || 0);
        });
    }

    useEffect(() => {
        loadData(pageSize, pageNum);
    }, [pageSize, pageNum]);

    const columns: ColumnsType<AutoGenerateList> = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
            width: 60,
            align: 'center',
        },
        {
            title: '服务名称',
            dataIndex: 'serviceName',
            key: 'serviceName',
            width: 110,
            align: 'center',
        },
        {
            title: '类型',
            dataIndex: 'providerType',
            key: 'providerType',
            align: 'center',
            width: 110,
        },
        {
            title: '资源名称',
            dataIndex: 'providerName',
            key: 'providerName',
            ellipsis: true,
            width: 110,
        },
        {
            title: 'API数量',
            dataIndex: 'apiCount',
            key: 'apiCount',
            width: 100,
        },
        {
            title: '最后修改',
            dataIndex: 'lastUpdateBy',
            key: 'lastUpdateBy',
            ellipsis: true,
            width: '6%',
        },
        {
            title: '修改日期',
            dataIndex: 'updated',
            key: 'updated',
            width: '15%',
        },
        {
            title: '创建人',
            dataIndex: 'createdBy',
            key: 'createdBy',
            align: 'center',
            width: 150,
        },
        {
            title: '创建日期',
            dataIndex: 'created',
            key: 'created',
            ellipsis: true,
            width: 150,
        },
        {
            title: '操作',
            dataIndex: 'operate',
            key: 'operate',
            align: 'center',
            width: 150,
            render: (v, record) => {
                const href = `/auto-generate-provider#/id/${record.id}`;
                return (
                    <Space>
                        <a href={href}>
                            编辑
                        </a>
                        <DeleteBtn text={'删除'}
                            title={'删除确认'}
                            link
                            content={<div>确定要删除吗？删除后不可恢复</div>}
                            onOk={() => onDeleteData(record)}
                        />
                    </Space>
                );
            },
        },
    ];

    const onDeleteData = (record: AutoGenerateList) => {
        if (!record.id) {
            return;
        }
        deleteAutoGenerateData(record.id).then(() => loadData(pageSize, pageNum));

    }

    return <>
        <CustomBreadcrumb items={[{ title: '首页' }, { title: '自动生成' }]} />
        <div className={'auto-generate-list'}>
            <Button type="primary" size='middle' onClick={() => window.open(`/auto-generate-provider`, '_self')}>新建</Button>
            <Table
                style={{ marginTop: '20px' }}
                columns={columns}
                dataSource={data}
                size={'middle'}
                rowKey={(record) => record.id}
                pagination={{
                    defaultCurrent: 1,
                    total: total,
                    size: 'default',
                    pageSize: pageSize,
                    current: pageNum,
                    showTotal: (total) => `总条数: ${total}`,
                    onShowSizeChange: (current, size) => {
                        setPageSize(size);
                    },
                    onChange: (page, size) => {
                        setPageSize(size);
                        setPageNum(page);
                    },
                }}
            />

        </div>


    </>
}
export default AutoGenerateList;
