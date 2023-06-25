import {getApiChangeAnalysis} from '@/services/api-change/api';
import {getApiGroupList, modifyApiChangeStatus} from '@/services/api/api';
import {getProductList} from '@/services/product/api';
import {toShortDate} from '@/utils/common';
import {ProFormSelect, ProFormText} from '@ant-design/pro-components';
import {QueryFilter} from '@ant-design/pro-form';
import {ProSchemaValueEnumObj} from '@ant-design/pro-utils/es/typing';
import {Breadcrumb, Button, message, Modal, notification, Space, Table, Tag} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import type {TableRowSelection} from 'antd/es/table/interface';
import React, {useEffect, useState} from 'react';
import './api-change.less';
import ApiChange from "@/pages/api/api-change";

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
            span={4}
            onFinish={async (values) => {
                props.onSearch(values);
            }}
        >
            <ProFormSelect
                name="productName"
                label="产品服务"
                showSearch
                initialValue={props.productGroup}
                rules={[{required: true}]}
                fieldProps={{
                    allowClear: false,
                    onChange: onProductGroupChange,
                }}
                valueEnum={productGroupMap}
            />
            <ProFormSelect name="apiGroup" label="分组名称" showSearch valueEnum={apiGroupMap}/>
            <ProFormSelect
                name="affectStatus"
                label="状态"
                showSearch
                initialValue={'need_analysis'}
                valueEnum={{
                    need_analysis: '待分析',
                    processing: '处理中',
                    closed: '已关闭',
                }}
            />
            <ProFormText name="apiName" label="API 名称"/>
        </QueryFilter>
    );
};

const ApiChangeList: React.FC<{
    id: number;
    handle?: (option: 'ok' | 'cancel', rows: ApiChange.ApiChange[], idArr: number[]) => any;
    providerName?: string;
    affectStatus?: string;
    remark?: string;
}> = (props) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [data, setData] = useState<ApiChange.ApiChange[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(20);
    const [pageNum, setPageNum] = useState<number>(1);
    const [selectedRow, setSelectedRow] = useState<ApiChange.ApiChange | null>(null);
    const [queryParams, setQueryParams] = useState<ApiChange.queryListParams>({affectStatus: 'need_analysis'});
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadData = (params: ApiChange.queryListParams, pageSize: number, pageNum: number) => {
        getApiChangeAnalysis(queryParams, pageSize, pageNum).then((d) => {
            // const arr = d.items.map((d: ApiChange.ApiChange) => {
            //     return {
            //         key: '' + d.id,
            //         id: d.id,
            //         productName: d.productName,
            //         apiGroup: d.apiGroup,
            //         apiName: d.apiName,
            //         lastVersionDate: d.lastVersionDate,
            //         affectStatus: d.affectStatus,
            //         uri: d.uri,
            //         method: d.method,
            //         apiNameEn: d.apiNameEn,
            //         providers: d.providers,
            //         remark: d.remark,
            //     };
            // });
            setData(d.items);
            setTotal(d.total);
        });
    }
    useEffect(() => {
        loadData(queryParams, pageSize, pageNum);
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

    const rowSelection: TableRowSelection<ApiChange.ApiChange> = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const onChangeStatus = (id: number, status: string, remark: string | undefined) => {
        modifyApiChangeStatus(id, status, remark || '').then(() => {
            messageApi.info('操作成功');
            loadData(queryParams, pageSize, pageNum);
        });
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        loadData(queryParams, pageSize, pageNum);
    };

    const columns: ColumnsType<ApiChange.ApiChange> = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
            width: 60,
            align: 'center',
            render: (v, r, i) => (pageNum - 1) * pageSize + i + 1,
        },
        {
            title: '变更日期',
            dataIndex: 'lastVersionDate',
            key: 'lastVersionDate',
            width: 110,
            align: 'center',
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
                return (
                    <Button type={'link'} onClick={() => {
                        showModal();
                        setSelectedRow(row);
                    }}>
                        {row.apiName} / {row.apiNameEn}
                    </Button>
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
            ellipsis: true,
        },
        {
            title: '操作',
            dataIndex: 'operate',
            key: 'operate',
            align: 'center',
            width: 150,
            render: (v, record) => {
                return (
                    <Space>
                        <a href="#" onClick={() => onChangeStatus(record.id, 'need_analysis', props.remark)}>
                            开启
                        </a>
                        <a href="#" onClick={() => onChangeStatus(record.id, 'closed', props.remark)}>
                            关闭
                        </a>
                    </Space>
                );
            },
        },
    ];

    return (
        <>
            <Breadcrumb
                items={[{title: '首页'}, {title: 'API 变更分析'}]}
                style={{margin: '10px 0'}}
            />
            <ApiChangeSearch productGroup={props.providerName || ''} onSearch={onSearch}/>
            <div style={{height: '16px'}}/>
            <Table
                rowSelection={rowSelection}
                className={'api-change-list'}
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
            <Modal
                transitionName={''}
                destroyOnClose
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width={'80%'}
            >
                <ApiChange changeId={selectedRow?.id}/>
            </Modal>
            {contextHolder}
        </>
    );
};
export default ApiChangeList;
