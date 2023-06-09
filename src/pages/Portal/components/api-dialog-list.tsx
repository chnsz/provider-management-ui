import ApiChangeList from '@/pages/api/components/api-change-list';
import { openApiExplorer } from '@/pages/Portal';
import { getApiDetailList, updatePublishStatus, updateUseStatus } from '@/services/api/api';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Modal, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import '../../api/api.less';

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

type queryParams = {
    productName?: string;
    apiGroup?: string;
    apiName?: string;
    uri?: string;
    useRemark?: string;
    publishStatus?: string;
    id?: number[];
};

const ApiDialogList: React.FC<queryParams> = (queryParams) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [data, setData] = useState<Detail[]>([]);
    const [selectedRow, setSelectedRow] = useState<Detail[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(20);
    const [pageNum, setPageNum] = useState<number>(1);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [id, setId] = useState<number>(0);

    const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: Detail[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
        setSelectedRow(selectedRows);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const loadData = (params: Api.queryListParams, pageSize: number, pageNum: number) => {
        getApiDetailList(queryParams, pageSize, pageNum).then((d) => {
            const arr = d.items.map((d: Api.Detail) => {
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
            setTotal(d.total);
        });
    };
    useEffect(() => {
        loadData(queryParams, pageSize, pageNum);
    }, [queryParams, pageSize, pageNum]);

    const handleRowClick = (record: Detail) => {
        setId(record.id);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const useStatusItems = [
        { label: '已使用', key: 'used' },
        { label: '待分析', key: 'need_analysis' },
        { label: '不合适', key: 'ignore' },
        { label: '缺少API', key: 'missing_api' },
        { label: '未分析', key: 'planning' },
    ];

    const publishStatusItems = [
        { label: '开放中', key: 'online' },
        { label: '已下线', key: 'offline' },
        { label: '线下API', key: 'unpublished' },
    ];

    const handleUseStatusChange = (status: string) => {
        selectedRow.forEach((row) => {
            updateUseStatus(row.id, status).then(() => {
                loadData(queryParams, pageSize, pageNum);
            });
        });
        setSelectedRowKeys([]);
    };

    const handlePublishStatusChange = (status: string) => {
        selectedRow.forEach((row) => {
            updatePublishStatus(row.id, status).then(() => {
                loadData(queryParams, pageSize, pageNum);
            });
        });
        setSelectedRowKeys([]);
    };

    const getCreatePlan = () => {
        return (
            <>
                <Dropdown.Button
                    className={'search-update'}
                    size={'small'}
                    type={'primary'}
                    icon={<DownOutlined />}
                    menu={{
                        items: useStatusItems.map((item) => ({
                            ...item,
                            onClick: () => handleUseStatusChange(item.key),
                        })),
                    }}
                >
                    更改状态
                </Dropdown.Button>
                <Dropdown.Button
                    size={'small'}
                    type={'primary'}
                    icon={<DownOutlined />}
                    menu={{
                        items: publishStatusItems.map((item) => ({
                            ...item,
                            onClick: () => handlePublishStatusChange(item.key),
                        })),
                    }}
                >
                    发布状态
                </Dropdown.Button>
            </>
        );
    };

    const columns: ColumnsType<Detail> = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            render: (v, r, i) => (pageNum - 1) * pageSize + i + 1,
        },
        {
            title: '服务',
            dataIndex: 'productName',
            key: 'productName',
            width: 95,
            ellipsis: true,
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
            width: 300,
            ellipsis: true,
            render: (v, record)=> v + ' / ' + record.apiNameEn,
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
        /*{
                title: '资源个数',
                dataIndex: 'providerList',
                key: 'providerList',
                width: 100,
                align: 'center',
                render: (providerList) => {
                    return <a href="#">{(providerList || []).length}</a>;
                },
            },*/
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
                return (
                    <>
                        <a type="button" onClick={() => handleRowClick(row)}>
                            变更历史&ensp;&ensp;
                        </a>
                        {openApiExplorer(row.productName, row.apiNameEn, row.uri)}
                    </>
                );
            },
        },
    ];

    return (
        <>
            <div className={'search-plan'}>{getCreatePlan()}</div>
            <div>
                <Table
                    className={'api-table'}
                    rowSelection={rowSelection}
                    size={'middle'}
                    columns={columns}
                    dataSource={data}
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
            <Modal
                title="变更历史"
                open={isModalOpen}
                transitionName={''}
                footer={null}
                onCancel={handleCancel}
                width={1650}
            >
                <ApiChangeList id={id} />
            </Modal>
        </>
    );
};
export default ApiDialogList;
