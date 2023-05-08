import ApiChangeList from '@/pages/api/components/api-change-list';
import { getApiDetailList } from '@/services/api/api';
import { Button, Modal, Select, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';

const SearchResult: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState<Detail[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(20);
    const [pageNum, setPageNum] = useState<number>(1);

    useEffect(() => {
        getApiDetailList({}, pageSize, pageNum).then((rsp) => {
            const arr = rsp.items.map((d: Api.Detail) => {
                return {
                    key: '' + d.id,
                    id: d.id,
                    productName: d.productName,
                    apiGroup: d.apiGroup,
                    apiName: d.apiName,
                    useRemark: d.useRemark,
                    publishStatus: d.publishStatus,
                    method: d.method,
                    uri: d.uri,
                    providerList: d.providerList,
                    apiNameEn: d.apiNameEn,
                };
            });
            setData(arr);
            setTotal(rsp.total);
        });
    }, [pageSize, pageNum]);

    const getCreatePlan = () => {
        return (
            <>
                <Button type="default">创建规划</Button>
                <Select
                    className={'search-update'}
                    defaultValue="更改状态"
                    dropdownMatchSelectWidth={false}
                    options={[
                        {
                            value: '已使用',
                            label: '已使用',
                        },
                        {
                            value: '待分析',
                            label: '待分析',
                        },
                        {
                            value: '不适合',
                            label: '不适合',
                        },
                        {
                            value: '缺少API',
                            label: '缺少API',
                        },
                        {
                            value: '未分析',
                            label: '未分析',
                        },
                    ]}
                />
                <Select
                    className={'search-update'}
                    defaultValue="发布状态"
                    dropdownMatchSelectWidth={false}
                    options={[
                        {
                            value: '开发中',
                            label: '开发中',
                        },
                        {
                            value: '已下线',
                            label: '已下线',
                        },
                        {
                            value: '线下API',
                            label: '线下API',
                        },
                    ]}
                />
            </>
        );
    };

    interface Detail {
        key: React.Key;
        id: number;
        productName: string;
        apiGroup: string;
        apiName: string;
        useRemark: string;
        method: string;
        providerList: any;
        uri: string;
        apiNameEn: string;
        publishStatus: string;
    }

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const columns: ColumnsType<Detail> = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: '服务',
            dataIndex: 'productName',
            key: 'productName',
            width: 95,
        },
        {
            title: 'API分组',
            dataIndex: 'apiGroup',
            key: 'apiGroup',
            width: 150,
            ellipsis: true,
        },
        {
            title: 'API名称',
            dataIndex: 'apiName',
            key: 'apiName',
            width: 180,
            render: (APIName) => <a href="#">{APIName}</a>,
        },
        {
            title: '覆盖状态',
            dataIndex: 'useRemark',
            key: 'useRemark',
            width: 100,
            render: (val) => {
                switch (val) {
                    case 'used':
                        return <Tag color="blue">已使用</Tag>;
                    case 'need_analysis':
                        return <Tag color="orange">待分析</Tag>;
                    case 'planning':
                        return <Tag color="cyan">规划中</Tag>;
                    case 'missing_api':
                        return <Tag color="red">缺少API</Tag>;
                    case 'ignore':
                        return <Tag>不适合</Tag>;
                }
                return <Tag>{val}</Tag>;
            },
        },
        {
            title: '资源个数',
            dataIndex: 'providerList',
            key: 'providerList',
            width: 100,
            align: 'center',
            render: (providerList) => {
                if (!providerList === null) {
                    return <a href="#">{(providerList || []).length}</a>;
                } else {
                    return <a href="#">0</a>;
                }
            },
        },
        {
            title: 'URI',
            dataIndex: 'uri',
            key: 'uri',
            ellipsis: true,
            render: (v, row) => {
                return (
                    <>
                        <Tag>{row.method}</Tag> {row.uri}
                    </>
                );
            },
        },
        {
            title: '发布状态',
            dataIndex: 'publishStatus',
            key: 'publishStatus',
            width: 100,
            render: (val) => {
                switch (val) {
                    case 'online':
                        return <Tag color="blue">开放中</Tag>;
                    case 'offline':
                        return <Tag color="orange">已下线</Tag>;
                    case 'unpublished':
                        return <Tag color="geekblue">线下API</Tag>;
                }
                return <Tag>{val}</Tag>;
            },
        },
        {
            title: '操作',
            dataIndex: 'operate',
            key: 'operate',
            width: 200,
            render: (v, row) => {
                const title = '（点击跳转 API Explorer）';
                const href = `https://apiexplorer.developer.huaweicloud.com/apiexplorer/doc?product=${row.productName}&api=${row.apiNameEn}`;
                return (
                    <div>
                        <a type="button" onClick={showModal}>
                            变更历史&ensp;&ensp;
                        </a>
                        <a title={title} href={href} target={'_blank'} rel="noreferrer">
                            API Explorer
                        </a>
                    </div>
                );
            },
        },
    ];

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    return (
        <div className={'api-card'}>
            <div className={'search-header'}>查询结果</div>
            <div className={'search-plan'}>{getCreatePlan()}</div>
            <div>
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={data}
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
            <Modal
                title="变更历史"
                open={isModalOpen}
                footer={null}
                onCancel={handleCancel}
                width={1600}
            >
                <ApiChangeList />
            </Modal>
        </div>
    );
};
export default SearchResult;
