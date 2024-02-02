import ApiChangeList from '@/pages/api/components/api-change-list';
import {openApiExplorer} from '@/pages/Portal';
import {getApiDetailList, getApiGroupList, updatePublishStatus, updateUseStatus} from '@/services/api/api';
import {DownOutlined, EditOutlined} from '@ant-design/icons';
import {Button, Dropdown, Input, message, Modal, Radio, Select, Space, Table, Tag, Tooltip} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import React, {useEffect, useState} from 'react';
import '../../api/api.less';
import {createProviderPlanning} from "@/services/provider-planning/api";
import type {ProSchemaValueEnumObj} from "@ant-design/pro-utils/es/typing";
import {getProductList} from "@/services/product/api";
import {QueryFilter} from "@ant-design/pro-form";
import {ProFormSelect, ProFormText} from "@ant-design/pro-components";
import {CloudName} from "@/global";

type queryParams = {
    productName?: string;
    apiGroup?: string;
    apiName?: string;
    cloudName?: string;
    uri?: string;
    useRemark?: string;
    publishStatus?: string;
    owner?: string;
    id?: number[];
};

const options = [
    {
        value: 'Resource',
        label: 'Resource',
    },
    {
        value: 'DataSource',
        label: 'DataSource',
    },
];

type FormProps = {
    productName: string;
    apiName: string;
    uri: string;
    useRemark: string;
    apiGroup: string;
};

const SearchForm: React.FC<{ owner?: string, onSearch: (val: FormProps) => any }> = (props) => {
    const [productNameMap, setProductNameMap] = useState<ProSchemaValueEnumObj>({});
    const [apiGroupMap, setApiGroupMap] = useState<ProSchemaValueEnumObj>({});

    useEffect(() => {
        getProductList(props.owner).then((d: Global.List<Product.Product[]>) => {
            const map: ProSchemaValueEnumObj = {};
            d.items.map((p) => p.productName)
                .sort()
                .forEach(n => map[n] = n);
            setProductNameMap(map);
        });
    }, []);

    const onProductNameChange = (v: string) => {
        if (!v) {
            setApiGroupMap({});
            return;
        }
        getApiGroupList(v).then((d: Api.Group[]) => {
            const map: ProSchemaValueEnumObj = {};
            d.map(t => t.apiGroup)
                .sort()
                .forEach(n => map[n] = n);
            setApiGroupMap(map);
        });
    };

    return (
        <QueryFilter<FormProps>
            span={4}
            labelWidth={80}
            searchGutter={8}
            style={{marginTop: '20px', marginBottom: '-27px'}}
            onFinish={async (values) => props.onSearch(values)}
        >
            <ProFormSelect
                name="productName"
                label="产品服务"
                showSearch
                fieldProps={{
                    onChange: onProductNameChange,
                }}
                valueEnum={productNameMap}
            />
            <ProFormSelect name="apiGroup" label="分组名称" showSearch valueEnum={apiGroupMap}/>
            <ProFormText name="apiName" label="API名称" placeholder={'支持模糊搜索'}/>
            <ProFormText name="uri" label="URI" placeholder={'支持模糊搜索'}/>
            <ProFormSelect
                name="useRemark"
                label="覆盖状态"
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

const ApiDialogList: React.FC<queryParams> = (queryParams) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [isRemarkDialogOpen, setRemarkDialogOpen] = useState(false);
    const [remark, setRemark] = useState<string>('');
    const [formData, setFormData] = useState<Api.queryListParams>({});

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isPlanningDialogOpen, setIsPlanningDialogOpen] = useState<boolean>(false);
    const [data, setData] = useState<Api.Detail[]>([]);
    const [selectedRow, setSelectedRow] = useState<Api.Detail[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(20);
    const [pageNum, setPageNum] = useState<number>(1);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [id, setId] = useState<number>(0);
    const [providerType, setProviderType] = useState<string>(options[0].value);
    const [providerName, setProviderName] = useState<string>('');
    const [planningTitle, setPlanningTitle] = useState<string>('新增资源');

    const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: Api.Detail[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
        setSelectedRow(selectedRows);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const loadData = (params: Api.queryListParams, pgSize: number, pgNum: number) => {
        getApiDetailList(params, pgSize, pgNum).then((d) => {
            setData(d.items);
            setTotal(d.total);
        });
    };
    useEffect(() => {
        const params: Api.queryListParams = {...formData};
        if (!params.productName) {
            params.productName = queryParams.productName;
        }
        params.cloudName = queryParams.cloudName;
        params.owner = queryParams.owner;

        loadData(params, pageSize, pageNum);
    }, [queryParams, formData, pageSize, pageNum]);

    const onSearch = (formVal: FormProps) => {
        const params: Api.queryListParams = {...formVal};
        if (!params.productName) {
            params.productName = queryParams.productName;
        }
        setPageNum(1);
        setFormData(params);
    }

    const handleRowClick = (record: Api.Detail) => {
        setId(record.id);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const useStatusItems = [
        {label: '已使用', key: 'used'},
        {label: '待分析', key: 'need_analysis'},
        {label: '不适合', key: 'ignore'},
        {label: '缺少API', key: 'missing_api'},
        {label: '未分析', key: 'planning'},
    ];

    const publishStatusItems = [
        {label: '开放中', key: 'online'},
        {label: '已下线', key: 'offline'},
        {label: '线下API', key: 'unpublished'},
    ];

    const handleUseStatusChange = (status: string) => {
        if (status === 'ignore') {
            setRemarkDialogOpen(true);
            return
        }
        selectedRow.forEach((row) => {
            updateUseStatus(row.id, status).then(() => {
                loadData(formData, pageSize, pageNum);
            });
        });
        setSelectedRowKeys([]);
    };

    const updateUseStatusToIgnore = () => {
        setRemarkDialogOpen(false);
        selectedRow.forEach((row) => {
            updateUseStatus(row.id, 'ignore', remark).then(() => {
                loadData(formData, pageSize, pageNum);
            });
        });
        setSelectedRowKeys([]);
        setRemark('');
    }

    const handlePublishStatusChange = (status: string) => {
        selectedRow.forEach((row) => {
            updatePublishStatus(row.id, status).then(() => {
                loadData(formData, pageSize, pageNum);
            });
        });
        setSelectedRowKeys([]);
    };

    const showCreatePlanning = () => {
        if (selectedRow.length === 0) {
            messageApi.warning('您还没有选择数据，请先选择API');
            return
        }
        setIsPlanningDialogOpen(true);
    }

    const savePlanning = () => {
        setIsPlanningDialogOpen(false);

        createProviderPlanning({
            // 归属服务
            productName: selectedRow[0].productName,
            title: planningTitle + `【${providerType}】${providerName}`,
            priority: 1,
            syncToKanboard: 'no',
            status: 'new',
            providerList: [{
                id: 0,
                dataType: '',
                dataId: 0,

                providerType: providerType,
                providerName: providerName,
            }],
            apiIdList: selectedRow.map(row => row.id),
        }).then(() => {
            loadData(formData, pageSize, pageNum);
            setSelectedRowKeys([]);
        });

        setProviderType(options[0].value);
        setProviderName('');
        setPlanningTitle('新增资源');
    }

    const onRemarkChange = (newRemark: string, row: Api.Detail) => {
        if (newRemark === row.remark) {
            return
        }
        updateUseStatus(row.id, row.useRemark, newRemark).then(() => {
            messageApi.info('保存成功');
            loadData(formData, pageSize, pageNum);
        });
    }


    const getToolbar = () => {
        return (
            <>
                <Space size={20}>
                    <Button size={'small'} type={'primary'} onClick={showCreatePlanning}>新建规划</Button>
                    <Dropdown.Button
                        size={'small'}
                        type={'primary'}
                        icon={<DownOutlined/>}
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
                        icon={<DownOutlined/>}
                        menu={{
                            items: publishStatusItems.map((item) => ({
                                ...item,
                                onClick: () => handlePublishStatusChange(item.key),
                            })),
                        }}
                    >
                        发布状态
                    </Dropdown.Button>
                </Space>
            </>
        );
    };

    const columns1: ColumnsType<Api.Detail> = [
        {
            title: '序号',
            dataIndex: 'id',
            width: 70,
            render: (v, r, i) => (pageNum - 1) * pageSize + i + 1,
        },
        {
            title: '服务',
            dataIndex: 'productName',
            width: 95,
            ellipsis: true,
        },
        {
            title: 'API分组',
            dataIndex: 'apiGroup',
            width: 150,
            ellipsis: true,
        },
        {
            title: 'API名称',
            dataIndex: 'apiName',
            width: '27%',
            ellipsis: true,
            render: (v, row) => openApiExplorer(row.productName, row.apiNameEn, row.uri, v + ' / ' + row.apiNameEn),
        },
        {
            title: 'URI',
            dataIndex: 'uri',
            ellipsis: true,
            render: (v, row) => {
                return (
                    <Tooltip placement="topLeft" title={row.uri}>
                        <Tag>{row.method}</Tag>
                        {row.uri}
                    </Tooltip>
                );
            },
        },
    ];

    const columns2: ColumnsType<Api.Detail> = [];
    if (queryParams.cloudName === CloudName.HuaweiCloud) {
        columns2.push({
            title: '覆盖状态',
            dataIndex: 'useRemark',
            align: 'center',
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
        });
    }

    const columns3: ColumnsType<Api.Detail> = [
        {
            title: <>备注<EditOutlined style={{color: '#6d6d6d'}}/></>,
            dataIndex: 'remark',
            width: '15%',
            ellipsis: true,
            render: (v: any, row) => {
                return <Input defaultValue={v}
                              bordered={false}
                              onBlur={(e) => onRemarkChange(e.target.value, row)}/>
            }
        },
        {
            title: '发布状态',
            dataIndex: 'publishStatus',
            align: 'center',
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
            width: 100,
            align: 'center',
            render: (v, row) => {
                return (
                    <>
                        <a type="button" onClick={() => handleRowClick(row)}>
                            变更历史&ensp;&ensp;
                        </a>
                    </>
                );
            },
        },
    ];

    const columns: ColumnsType<Api.Detail> = [...columns1, ...columns2, ...columns3];

    return (
        <>
            {contextHolder}
            <SearchForm owner={queryParams.owner} onSearch={onSearch}/>
            <div className={'search-plan'}>{getToolbar()}</div>
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
                        showTotal: (num) => `总条数: ${num}`,
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
                width={1750}
            >
                <ApiChangeList id={id}/>
            </Modal>
            <Modal
                title="新建资源规划"
                open={isPlanningDialogOpen}
                transitionName={''}
                onCancel={() => setIsPlanningDialogOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setIsPlanningDialogOpen(false)}>关闭</Button>,
                    <Button type={'primary'} key="save" onClick={savePlanning}>保存</Button>
                ]}>

                <div style={{height: '20px'}}/>
                <Space direction={'vertical'} size={20}>
                    <div>
                        <div>规划类型：</div>
                        <Radio.Group onChange={(e) => setPlanningTitle(e.target.value)} value={planningTitle}>
                            <Radio value={'新增资源'}>新增资源</Radio>
                            <Radio value={'增强已有资源'}>增强已有资源</Radio>
                        </Radio.Group>
                    </div>
                    <div>
                        <Space.Compact style={{width: '100%'}}>
                            <Select
                                defaultValue="DataSource"
                                options={options}
                                style={{width: '120px'}}
                                value={providerType}
                                onChange={(v) => setProviderType(v)}
                            />
                            <Input
                                placeholder={'请输入 Resource 或 DataSource 名称'}
                                value={providerName}
                                style={{width: '320px'}}
                                onChange={(e) => {
                                    setProviderName(e.currentTarget.value);
                                }}
                            />
                        </Space.Compact>
                        <div>关联已有资源，或计划创建新资源</div>
                    </div>
                </Space>
                <div style={{height: '20px'}}/>
            </Modal>
            <Modal title={'请填写不适合的原因'}
                   transitionName={''}
                   open={isRemarkDialogOpen}
                   onCancel={() => setRemarkDialogOpen(false)}
                   width={600}
                   footer={[
                       <Button key={'close'} onClick={updateUseStatusToIgnore}>不填原因</Button>,
                       <Button key="save" type="primary" onClick={updateUseStatusToIgnore}>提交</Button>
                   ]}>
                <div style={{height: '10px'}}/>
                <Input
                    placeholder={'请填写不适合的原因'}
                    value={remark}
                    style={{width: '320px'}}
                    onChange={(e) => {
                        setRemark(e.currentTarget.value);
                    }}
                />
                <div style={{marginTop: '10px'}}>
                    <span>常用：</span>
                    <Space size={10}>
                        <a onClick={() => setRemark('即将废弃')}>即将废弃</a>
                        <a onClick={() => setRemark('已用高本版')}>已用高本版</a>
                    </Space>
                </div>
            </Modal>
        </>
    );
};
export default ApiDialogList;
