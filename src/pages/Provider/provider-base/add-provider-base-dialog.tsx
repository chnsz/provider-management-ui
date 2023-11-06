import React, {useEffect, useState} from "react";
import type {ColumnsType} from "antd/es/table/interface";
import {Button, Divider, Modal, Select, Space, Table, Tag} from "antd";
import {getApiDetailList, getApiGroupList} from "@/services/api/api";
import type {ProSchemaValueEnumObj} from "@ant-design/pro-utils/es/typing";
import {getProductList} from "@/services/product/api";
import {QueryFilter} from "@ant-design/pro-form";
import {ProFormSelect, ProFormText} from "@ant-design/pro-components";
import ProviderBaseDialog from "@/pages/Provider/provider-base/provider-base-dialog";
import type {SelectProps} from "rc-select/lib/Select";
import {getProviderList} from "@/services/provider/api";
import {CloudName} from "@/global";

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
                fieldProps={{
                    allowClear: false,
                    onChange: onProductNameChange,
                }}
                valueEnum={productNameMap}
            />
            <ProFormSelect name="apiGroup" label="分组名称" showSearch valueEnum={apiGroupMap}/>
            <ProFormText name="apiName" label="API 名称"/>
            <ProFormText name="uri" label="URI"/>
        </QueryFilter>
    );
};

const AddProviderBaseDialog: React.FC<{
    onClosed?: () => any,
}> = (props) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [data, setData] = useState<Api.Detail[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(20);
    const [pageNum, setPageNum] = useState<number>(1);
    const [queryParams, setQueryParams] = useState<Api.queryListParams>({});
    const [providerType, setProviderType] = useState<'Resource' | 'DataSource'>('Resource');
    const [providerName, setProviderName] = useState<string>('');
    const [providerNameOption, setProviderNameOption] = useState<SelectProps['options']>([]);

    const columns: ColumnsType<Api.Detail> = [
        {
            title: '序号',
            dataIndex: 'serialNo',
            align: 'center',
            width: 80,
            render: (v, r, i) => i + 1,
        },
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
            width: 350,
            render: (val, row) => <>{row.apiName} / {row.apiNameEn}</>
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
        {
            title: '操作',
            dataIndex: 'id',
            width: 120,
            align: 'center',
            render: (val, row) => <ProviderBaseDialog
                model={'button'}
                apiId={val}
                apiName={row.apiName + ' / ' + row.apiNameEn}
                providerType={providerType}
                providerName={providerName}
            />,
        },
    ];

    const handle = (option: 'ok' | 'cancel') => {
        return () => {
            setModalOpen(false);
            if (props.onClosed) {
                props.onClosed();
            }
        };
    };

    const onSearch = (val: FormProps) => {
        setPageNum(1);
        setQueryParams({
            productName: val.productName,
            apiGroup: val.apiGroup,
            apiName: val.apiName,
            uri: val.uri,
            publishStatus: val.publishStatus,
            useRemark: val.useRemark,
        });
    };

    useEffect(() => {
        getApiDetailList(queryParams, pageSize, pageNum).then((d) => {
            setData(d.items);
            setTotal(d.total);
        });
    }, [pageNum, pageSize, queryParams]);

    const loadProviderOption = () => {
        getProviderList({cloudName: CloudName.HuaweiCloud, type: providerType}, 2000, 1)
            .then(data => {
                const option = data.items.map(t => {
                    return {value: t.name, label: t.name};
                });
                setProviderNameOption(option)
            })
    }

    useEffect(() => {
        loadProviderOption();
    }, [providerType]);

    const openDialog = () => {
        setModalOpen(true)
        loadProviderOption()
    }

    return <>
        <Button type={'primary'} size={'small'} onClick={openDialog}>维护基线</Button>
        <Modal title="API 字段变更分析"
               open={isModalOpen}
               onOk={handle('ok')}
               onCancel={handle('cancel')}
               transitionName={''}
               destroyOnClose
               width={1500}
               footer={[
                   <Button key="save" type="primary" onClick={handle('ok')}>关闭</Button>
               ]}>
            <div>
                <Space direction={'horizontal'} size={20}>
                    <span>
                        Provider 类型:&nbsp;&nbsp;
                        <Select style={{width: '200px'}}
                                options={[
                                    {value: 'DataSource', label: 'DataSource'},
                                    {value: 'Resource', label: 'Resource'},
                                ]}
                                value={providerType}
                                onChange={val => setProviderType(val)}/>
                    </span>
                    <span>
                    Provider 名称:&nbsp;&nbsp;
                        <Select style={{width: '400px'}}
                                options={providerNameOption}
                                value={providerName}
                                showSearch
                                onChange={val => setProviderName(val)}/>
                    </span>
                </Space>
            </div>
            <SearchForm onSearch={onSearch} productName={''}/>
            <Divider/>
            <Table
                columns={columns}
                dataSource={data}
                rowKey={(record) => record.id}
                size={'middle'}
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
}

export default AddProviderBaseDialog;
