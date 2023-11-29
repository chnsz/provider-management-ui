import {getApiDetailList, getApiGroupList} from '@/services/api/api';
import {getProductList} from '@/services/product/api';
import {ProFormSelect, ProFormText} from '@ant-design/pro-components';
import {QueryFilter} from '@ant-design/pro-form';
import type {ProSchemaValueEnumObj} from '@ant-design/pro-utils/es/typing';
import {Button, Divider, Modal, Table, Tag} from 'antd';
import type {ColumnsType} from 'antd/es/table/interface';
import React, {useEffect, useState} from 'react';

type ApiListDialogProp = {
    handle?: (option: 'ok' | 'cancel', rows: Api.Detail[], idArr: number[]) => any;
    providerName?: string;
};

const columns: ColumnsType<Api.Detail> = [
    {
        title: '服务',
        dataIndex: 'productName',
        ellipsis: true,
        width: 100,
    },
    {
        title: 'API 分组',
        dataIndex: 'apiGroup',
        ellipsis: true,
        width: 200,
    },
    {
        title: 'API 名称',
        dataIndex: 'apiName',
        ellipsis: true,
        width: 220,
    },
    {
        title: '覆盖状态',
        dataIndex: 'useRemark',
        width: 90,
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
        title: 'URI ',
        dataIndex: 'uri',
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
];

type FormProps = {
    productName: string;
    apiGroup: string;
    publishStatus: string;
    apiName: string;
    uri: string;
    useRemark: string;
};

const SearchForm: React.FC<{ productName: string, onSearch: (val: FormProps) => any }> = (props) => {
    const [productNameMap, setProductNameMap] = useState<ProSchemaValueEnumObj>({});
    const [apiGroupMap, setApiGroupMap] = useState<ProSchemaValueEnumObj>({});

    useEffect(() => {
        getProductList().then((d) => {
            console.log(d)
            const map: ProSchemaValueEnumObj = {};
            d.items.map((p) => p.productName)
                .sort()
                .forEach(n => map[n] = n);
            setProductNameMap(map);
        });
    }, []);

    const onProductNameChange = (v: string) => {
        getApiGroupList(v).then((d) => {
            const map: ProSchemaValueEnumObj = {};
            d.map(t => t.apiGroup)
                .sort()
                .forEach(n => map[n] = n);
            setApiGroupMap(map);
        });
    };

    return (
        <QueryFilter<FormProps>
            span={6}
            style={{marginTop: '20px', marginBottom: '-27px'}}
            onFinish={async (values) => {
                props.onSearch(values);
            }}
        >
            <ProFormSelect
                name="productName"
                label="产品服务"
                showSearch
                initialValue={props.productName}
                rules={[{required: true}]}
                fieldProps={{
                    allowClear: false,
                    onChange: onProductNameChange,
                }}
                valueEnum={productNameMap}
            />
            <ProFormSelect name="apiGroup" label="分组名称" showSearch valueEnum={apiGroupMap}/>
            <ProFormText name="apiName" label="API 名称"/>
            <ProFormText name="uri" label="URI"/>
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

const ChooseApiDialog: React.FC<ApiListDialogProp> = (props) => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<Api.Detail[]>([]);
    const [data, setData] = useState<Api.Detail[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(20);
    const [pageNum, setPageNum] = useState<number>(1);
    const [queryParams, setQueryParams] = useState<Api.queryListParams>({});

    const onSelectChange = (newSelectedRowKeys: React.Key[], rows: Api.Detail[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
        setSelectedRows(rows);
    };

    const handle = (option: 'ok' | 'cancel') => {
        return () => {
            setIsDialogOpen(false);
            if (props.handle) {
                const idArr = selectedRowKeys.map((t) => parseInt(t.toString()));
                props.handle(option, selectedRows, idArr);
                console.log(props)
            }
        };
    };

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

    useEffect(() => {
        getApiDetailList(queryParams, pageSize, pageNum).then((d) => {
            console.log(d)
            setData(d.items);
            setTotal(d.total);
        });
    }, [pageNum, pageSize, queryParams]);

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    return (
        <>
            <Button size={'small'} type={'primary'} onClick={() => setIsDialogOpen(true)}>
                选择API
            </Button>
            <Modal
                transitionName={''}
                destroyOnClose
                title="新选API"
                width={1400}
                cancelText={'取消'}
                okText={'确定'}
                open={isDialogOpen}
                onOk={handle('ok')}
                onCancel={handle('cancel')}
            >
                <SearchForm onSearch={onSearch} productName={props.providerName || ''}/>
                <Divider/>
                <Table
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
                        showTotal: (total) => `总条数：${total}`,
                        onShowSizeChange: (current, size) => {
                            setPageSize(size);
                        },
                        onChange: (page: number, size: number) => {
                            setPageNum(page);
                            setPageSize(size);
                        },
                    }}
                />
            </Modal>
        </>
    );
};

export default ChooseApiDialog;
