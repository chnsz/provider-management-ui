import { getApiChangeAnalysis } from '@/services/api-change/api';
import { getApiGroupList, modifyApiChangeStatus } from '@/services/api/api';
import { getProductList } from '@/services/product/api';
import { toShortDate } from '@/utils/common';
import { ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { QueryFilter } from '@ant-design/pro-form';
import { ProSchemaValueEnumObj } from '@ant-design/pro-utils/es/typing';
import { Breadcrumb, notification, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import React, { useEffect, useState } from 'react';
import './api-change.less';

interface DataType {
    key: React.Key;
    id: number;
    productName: string;
    apiGroup: string;
    apiName: string;
    lastVersionDate: string;
    affectStatus: string;
    uri: string;
    method: string;
    apiNameEn: string;
    providers: string;
    remark: string;
}

type FormProps = {
    productName: string;
    apiGroup: string;
    apiName: string;
    affectStatus: string;
};

const ApiChangeSearch: React.FC<{ productGroup: string; onSearch: (val: FormProps) => any }> = (
    props,
) => {
    const [productGroupMap, setProductGroupMap] = useState<ProSchemaValueEnumObj>({});
    const [apiGroupMap, setApiGroupMap] = useState<ProSchemaValueEnumObj>({});

    useEffect(() => {
        getProductList().then((d) => {
            const map: ProSchemaValueEnumObj = {};
            d.items
                .map((p) => p.productName)
                .sort()
                .forEach((n) => (map[n] = n));
            setProductGroupMap(map);
        });
    }, []);

    const onProductGroupChange = (productGroup: string) => {
        getApiGroupList(productGroup).then((d) => {
            const map: ProSchemaValueEnumObj = {};
            d.map((t) => t.apiGroup)
                .sort()
                .forEach((n) => (map[n] = n));
            setApiGroupMap(map);
        });
    };

    return (
        <QueryFilter<FormProps>
            className={'api-change-list'}
            span={6}
            onFinish={async (values) => {
                props.onSearch(values);
            }}
        >
            <ProFormSelect
                name="productName"
                label="产品服务"
                showSearch
                initialValue={props.productGroup}
                rules={[{ required: true }]}
                fieldProps={{
                    allowClear: false,
                    onChange: onProductGroupChange,
                }}
                valueEnum={productGroupMap}
            />
            <ProFormSelect name="apiGroup" label="分组名称" showSearch valueEnum={apiGroupMap} />
            <ProFormText name="apiName" label="API 名称" />
            <ProFormSelect
                name="affectStatus"
                label="状态"
                showSearch
                valueEnum={{
                    need_analysis: '待分析',
                    processing: '处理中',
                    closed: '已关闭',
                }}
            />
        </QueryFilter>
    );
};

const ApiChange: React.FC<{
    id: number;
    handle?: (option: 'ok' | 'cancel', rows: DataType[], idArr: number[]) => any;
    providerName?: string;
    affectStatus?: string;
    remark?: string;
}> = (props) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [data, setData] = useState<DataType[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(20);
    const [pageNum, setPageNum] = useState<number>(1);
    const [queryParams, setQueryParams] = useState<ApiChange.queryListParams>({});
    const [affectStatus, setAffectStatus] = useState<string>(props.affectStatus || '');
    const [notificationApi, contextHolder] = notification.useNotification();

    useEffect(() => {
        getApiChangeAnalysis(queryParams, pageSize, pageNum).then((d) => {
            const arr = d.items.map((d: ApiChange.ApiChange) => {
                return {
                    key: '' + d.id,
                    id: d.id,
                    productName: d.productName,
                    apiGroup: d.apiGroup,
                    apiName: d.apiName,
                    lastVersionDate: d.lastVersionDate,
                    affectStatus: d.affectStatus,
                    uri: d.uri,
                    method: d.method,
                    apiNameEn: d.apiNameEn,
                    providers: d.providers,
                    remark: d.remark,
                };
            });
            setData(arr);
            setTotal(d.total);
        });
    }, [queryParams, pageSize, pageNum]);

    const onSearch = (val: FormProps) => {
        setPageNum(1);
        setQueryParams({
            productName: val.productName,
            apiGroup: val.apiGroup,
            apiName: val.apiName,
            affectStatus: val.affectStatus,
        });
    };

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection: TableRowSelection<DataType> = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const onChangeStatus = (status: string, remark: string | undefined) => {
        console.log('props.id:', props.id);
        console.log('props.remark:', props.remark);
        modifyApiChangeStatus(props.id, status, remark || '').then(() => {
            setAffectStatus('');
            notificationApi['info']({
                message: '提示',
                description: '操作成功',
            });
        });
    };

    const columns: ColumnsType<DataType> = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            render: (v, r, i) => (pageNum - 1) * pageSize + i + 1,
        },
        {
            title: '变更日期',
            dataIndex: 'lastVersionDate',
            key: 'lastVersionDate',
            width: 110,
            render: toShortDate,
        },
        {
            title: '状态',
            dataIndex: 'affectStatus',
            key: 'affectStatus',
            align: 'center',
            width: '6%',
            render: (row) => {
                switch (row) {
                    case 'need_analysis':
                        return <Tag color="orange">待分析</Tag>;
                    case 'processing':
                        return <Tag color="cyan">处理中</Tag>;
                    case 'closed':
                        return <Tag>已关闭</Tag>;
                }
            },
        },
        {
            title: '产品服务',
            dataIndex: 'productName',
            key: 'productName',
            ellipsis: true,
            width: '6%',
        },
        {
            title: 'API分组',
            dataIndex: 'apiGroup',
            key: 'apiGroup',
            ellipsis: true,
            width: 180,
        },
        {
            title: 'API名称',
            dataIndex: 'apiName',
            key: 'apiName',
            ellipsis: true,
            width: '18%',
            render: (v, row) => {
                const href = `https://console.huaweicloud.com/apiexplorer/#/openapi/${row.productName}/doc?api=${row.apiNameEn}`;
                return (
                    <a href={href} rel="noreferrer" target="_blank" title="在API Explorer中查看">
                        {row.apiName}/{row.apiNameEn}
                    </a>
                );
            },
        },
        {
            title: 'URI',
            dataIndex: 'uri',
            key: 'uri',
            ellipsis: true,
            width: '18%',
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
            align: 'center',
            ellipsis: true,
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
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '操作',
            dataIndex: 'operate',
            key: 'operate',
            align: 'center',
            render: () => {
                return (
                    <div>
                        {affectStatus}
                        <a href="#" onClick={() => onChangeStatus('need_analysis', props.remark)}>
                            开启&ensp;&ensp;
                        </a>
                        <a href="#" onClick={() => onChangeStatus('closed', props.remark)}>
                            关闭
                        </a>
                    </div>
                );
            },
        },
    ];

    return (
        <>
            <Breadcrumb
                items={[{ title: '首页' }, { title: 'API 变更分析' }]}
                style={{ margin: '10px 0' }}
            />
            <ApiChangeSearch productGroup={props.providerName || ''} onSearch={onSearch} />
            <div style={{ height: '16px' }} />
            <Table
                rowSelection={rowSelection}
                className={'api-change-list'}
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
            {contextHolder}
        </>
    );
};
export default ApiChange;
