import ApiChangeList from '@/pages/api/components/api-change-list';
import ApiGroup from '@/pages/api/components/api-group';
import {
    getApiDetailList,
    getApiGroupList,
    updatePublishStatus,
    updateUseStatus,
} from '@/services/api/api';
import { getProductList } from '@/services/product/api';
import { DownOutlined } from '@ant-design/icons';
import { ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { QueryFilter } from '@ant-design/pro-form';
import { ProSchemaValueEnumObj } from '@ant-design/pro-utils/es/typing';
import { Button, Dropdown, Modal, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import '../api.less';

type ApiSearchListProp = {
    handle?: (option: 'ok' | 'cancel', rows: Detail[], idArr: number[]) => any;
    providerName?: string;
};

type FormProps = {
    productName: string;
    apiGroup: string;
    publishStatus: string;
    apiName: string;
    uri: string;
    useRemark: string;
};

const ApiList: React.FC<{ productName: string; onSearch: (val: FormProps) => any }> = (props) => {
    const [productNameMap, setProductNameMap] = useState<ProSchemaValueEnumObj>({});
    const [apiGroupMap, setApiGroupMap] = useState<ProSchemaValueEnumObj>({});

    useEffect(() => {
        getProductList().then((d) => {
            const map: ProSchemaValueEnumObj = {};
            d.items
                .map((p) => p.productName)
                .sort()
                .forEach((n) => (map[n] = n));
            setProductNameMap(map);
        });
    }, []);

    const onProductNameChange = (v: string) => {
        getApiGroupList(v).then((d) => {
            const map: ProSchemaValueEnumObj = {};
            d.map((t) => t.apiGroup)
                .sort()
                .forEach((n) => (map[n] = n));
            setApiGroupMap(map);
        });
    };

    return (
        <QueryFilter<FormProps>
            className={'api-card'}
            span={6}
            onFinish={async (values) => {
                props.onSearch(values);
            }}
        >
            <ProFormSelect
                name="productName"
                label="产品服务"
                showSearch
                initialValue={props.productName}
                rules={[{ required: true }]}
                fieldProps={{
                    allowClear: false,
                    onChange: onProductNameChange,
                }}
                valueEnum={productNameMap}
            />
            <ProFormSelect name="apiGroup" label="分组名称" showSearch valueEnum={apiGroupMap} />
            <ProFormText name="apiName" label="API 名称" />
            <ProFormText name="uri" label="URI" />
            <ProFormSelect
                name="publishStatus"
                label="发布状态"
                showSearch
                valueEnum={{
                    online: '开放中',
                    offline: '已下线',
                    unpublished: '线下API',
                }}
            />
            <ProFormSelect
                name="useRemark"
                label="覆盖分析"
                showSearch
                valueEnum={{
                    used: '已使用',
                    need_analysis: '待分析',
                    planning: '规划中',
                    ignore: '不适合',
                    missing_api: '缺少API',
                }}
            />
        </QueryFilter>
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

const ApiSearchList: React.FC<ApiSearchListProp> = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState<Detail[]>([]);
    const [selectedRow, setSelectedRow] = useState<Detail | null>(null);
    const [total, setTotal] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(20);
    const [pageNum, setPageNum] = useState<number>(1);
    const [queryParams, setQueryParams] = useState<Api.queryListParams>({});
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [id, setId] = useState<number>();
    const [productName, setProductName] = useState<string>('ECS');

    const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: Detail[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
        setSelectedRow(selectedRows.length > 0 ? selectedRows[0] : null);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    useEffect(() => {
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
            arr.forEach((a) => {
                const ab = a.productName;
                setProductName(ab);
            });
        });
    }, [queryParams, pageSize, pageNum]);

    const onSearch = (val: FormProps) => {
        setPageNum(1);
        setQueryParams({
            productName: val.productName || props.providerName,
            apiGroup: val.apiGroup,
            apiName: val.apiName,
            uri: val.uri,
            publishStatus: val.publishStatus,
            useRemark: val.useRemark,
        });
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
        if (selectedRow) {
            const newUseStatus = status;
            updateUseStatus(selectedRow.id, newUseStatus).then(() => {
                const newData = data.map((item) => {
                    if (item.id === selectedRow.id) {
                        return { ...item, useRemark: newUseStatus };
                    }
                    return item;
                });
                setData(newData);
            });
        }
    };

    const handlePublishStatusChange = (status: string) => {
        if (selectedRow) {
            const newPublishStatus = status;
            updatePublishStatus(selectedRow.id, newPublishStatus).then(() => {
                const newData = data.map((item) => {
                    if (item.id === selectedRow.id) {
                        return { ...item, publishStatus: newPublishStatus };
                    }
                    return item;
                });
                setData(newData);
            });
        }
    };

    const getCreatePlan = () => {
        return (
            <>
                <Button size={'small'} type={'primary'}>
                    创建规划
                </Button>
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

    const handleRowClick = (record: Detail) => {
        setId(record.id);
        setIsModalOpen(true);
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
            width: 180,
            ellipsis: true,
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
                        <a type="button" onClick={() => handleRowClick(row)}>
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

    return (
        <>
            <ApiList productName={props.providerName || ''} onSearch={onSearch} />
            <div style={{ height: '16px' }} />
            <div style={{ display: 'flex' }}>
                <div>
                    <ApiGroup productName={productName} />
                </div>
                <div>
                    <div className={'search-header'}>查询结果</div>
                    <div className={'search-plan'}>{getCreatePlan()}</div>
                    <div>
                        <Table
                            className={'api-table'}
                            rowSelection={rowSelection}
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
                        footer={null}
                        onCancel={handleCancel}
                        width={1600}
                    >
                        <ApiChangeList id={id} />
                    </Modal>
                </div>
            </div>
        </>
    );
};
export default ApiSearchList;
