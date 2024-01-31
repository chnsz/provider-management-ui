import React, { useEffect, useState } from "react";
import type { MenuProps } from 'antd';
import { Badge, Dropdown, Input, message, Modal, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { getProviderSyncIssueList, updateProviderSyncStatus } from "@/services/provider/api";
import { typeNameMap } from "@/services/partner/constants";
import { QueryFilter } from "@ant-design/pro-form";
import { ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { EditOutlined } from "@ant-design/icons";
import { get } from "lodash";
import { CloudName, openDocsInRegistry } from "@/global";
import ProviderSyncSumDialog from "@/pages/Partner/components/provider_sync_sum_dialog";
import type { PresetStatusColorType } from "antd/es/_util/colors";
import MonitorDialog from "@/pages/Partner/monitor/monitor-dialog";
import MonitorListDialog from "@/pages/Partner/monitor/monitor-list-dialog";
import Txt from "@/components/Txt/Txt";

type FormProps = {
    type: string;
    providerType: string;
    providerName: string;
    fieldName: string;
    status: string;
};

const SearchForm: React.FC<{
    onSearch: (val: FormProps) => any,
    type: string,
    cloudName: Global.CloudName
}> = (props) => {
    return (
        <QueryFilter<FormProps>
            span={4}
            labelWidth={80}
            searchGutter={8}
            style={{ marginTop: '20px', marginBottom: '-27px' }}
            onFinish={async (values) => props.onSearch(values)}
        >
            <ProFormSelect
                name="type"
                label="问题类型"
                initialValue={props.type}
                valueEnum={typeNameMap}
            />
            <ProFormSelect
                name="providerType"
                label="资源类型"
                /*fieldProps={{
                    onChange: onProviderTypeChange,
                }}*/
                valueEnum={{
                    Resource: 'Resource',
                    DataSource: 'DataSource',
                }}
            />
            {/*<ProFormSelect*/}
            {/*    name="providerName"*/}
            {/*    label="资源名称"*/}
            {/*    showSearch*/}
            {/*    valueEnum={providerNameMap}*/}
            {/*/>*/}
            <ProFormText name="providerName" label="资源名称" />
            <ProFormText name="fieldName" label="字段名称" placeholder={'支持模糊搜索'} />
            <ProFormSelect
                name="status"
                label="状态"
                showSearch
                valueEnum={{
                    open: '待处理',
                    toExpired: '即将超期',
                    expired: '已超期',
                    padding: '挂起',
                    monitoring: '监控中',
                    closed: '已完成',
                    'manually-closed': '手动关闭',
                    'api-missing': 'API未发布',
                    'service-missing': '服务未上线',
                    'merging': '待合并',
                }}
            />
        </QueryFilter>
    );
};

export const getSyncTypeName = (type: string) => {
    if (!typeNameMap.hasOwnProperty(type)) {
        return type;
    }
    return typeNameMap[type];
}

let ExpiredDays = 30;
let ToExpiredDays = 10;

const wrapperRequired = (v: any) => {
    if (!v) {
        return '';
    }
    if (v.toString().toLowerCase() === 'required') {
        return <Tag color={'gold'}>{v}</Tag>;
    }
    return <Tag color={'green'}>{v}</Tag>
}

const wrapperFieldCategory = (v: any) => {
    if (!v) {
        return '';
    }
    const mapper: Record<string, string> = {
        argument: 'blue',
        attribute: 'cyan',
        timeout: 'green',
        import: 'purple'
    };
    const color = mapper[v];
    return <Tag color={color}>{v}</Tag>;
}

const wrapperProviderName = (v: any, row: Provider.ProviderSyncIssue) => {
    if (v.toString().startsWith('huaweicloud_')) {
        return openDocsInRegistry(row.cloudName, row.providerType, row.providerName, v)
    }

    const status: PresetStatusColorType = row.isReference ? 'processing' : 'default';
    const el = <Badge status={status} text={v} style={{ color: '#1890ff' }} />
    return openDocsInRegistry(row.cloudName, row.providerType, row.providerName, el)
}

const wrapperFieldName = (v: any, row: Provider.ProviderSyncIssue, callback?: () => any) => {
    return <MonitorListDialog content={v}
        cloudName={row.cloudName}
        providerType={row.providerType}
        providerName={row.providerName}
        relationType={row.type}
        onClose={() => {
            if (callback) {
                callback()
            }
        }}
    />
}

const renderCol = (field: string, wrapper?: (v: any, row: Provider.ProviderSyncIssue, callback?: () => any) => any, callback?: () => any) => {
    return (v: any, row: Provider.ProviderSyncIssue) => {
        if (wrapper === wrapperFieldName && !v) {
            return wrapper ? wrapper('(查看监控)', row, callback) : '(查看监控)';
        }
        if (!row.diffSchema) {
            return wrapper ? wrapper(v, row, callback) : v;
        }

        const diffVal = get(row, 'diffSchema.' + field)
        let v1 = (diffVal + '').toLowerCase();
        v1 = v1 === 'set' ? 'list' : v1;
        let v2 = (v + '').toLowerCase();
        v2 = v2 === 'set' ? 'list' : v2;

        if (v1 === v2) {
            return wrapper ? wrapper(v, row, callback) : v;
        }

        const borderTop = '1px dotted #fa8c16';
        // if (!diffVal) {
        //     borderTop = '';
        // }
        return <>
            <div style={{ height: '22px' }}> {wrapper ? wrapper(v, row, callback) : v} </div>
            <div style={{ borderTop: borderTop, height: '22px', borderRadius: '0px' }} title={'schema 中的值'}>
                {wrapper ? wrapper(diffVal, row, callback) : diffVal}
            </div>
        </>;
    }
}

const quickInputMapper: Record<string, { remark: string, status: string }> = {
    '1': {
        remark: '已提交PR，待合并',
        status: 'merging',
    },
    '2': {
        remark: '服务未上线',
        status: '',
    },
    '3': {
        remark: '缺少API',
        status: '',
    },
    '4': {
        remark: 'Schema为Optional，实际是Required',
        status: 'manually-closed',
    },
    '5': {
        remark: 'DataSource回填字段，误报',
        status: 'manually-closed',
    },
}

const getDropItems = () => {
    const items: MenuProps['items'] = [];
    for (const k in quickInputMapper) {
        if (!quickInputMapper.hasOwnProperty(k)) {
            continue
        }
        const input = quickInputMapper[k];
        items.push({
            key: k,
            label: (
                <span>{input.remark}</span>
            ),
        })
    }
    return items;
}

const Remark: React.FC<{ value: string, onChange: (remark: string, status: string) => any }> = ({ value, onChange }) => {
    const [val, setVal] = useState<string>(value);

    const onClick: MenuProps['onClick'] = ({ key }) => {
        if (!quickInputMapper.hasOwnProperty(key)) {
            return
        }

        const remark = quickInputMapper[key].remark;
        const status = quickInputMapper[key].status;

        setVal(remark);
        onChange(remark, status);
    };

    const items = getDropItems();
    return <Dropdown menu={{ items, onClick }}>
        <Input value={val}
            onChange={e => setVal(e.target.value)}
            onBlur={e => onChange(e.target.value, '')}
        />
    </Dropdown>
}

const ProviderSyncIssueDialog: React.FC<{
    sumData: Provider.ProviderIssueCount,
    cloudName: Global.CloudName,
    syncType: string,
    onClosed?: () => any,
    short?: boolean,
}> = ({ sumData, cloudName, syncType, onClosed, short }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [total, setTotal] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(15);
    const [pageNum, setPageNum] = useState<number>(1);
    const [formData, setFormData] = useState<FormProps>({
        providerType: '',
        providerName: '',
        fieldName: '',
        status: '',
        type: syncType,
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataSource, setDataSource] = useState<Provider.ProviderSyncIssue[]>([]);

    const loadData = () => {
        const params = { cloudName, ...formData }
        getProviderSyncIssueList(params, pageSize, pageNum)
            .then(t => {
                setDataSource(t.items);
                setTotal(t.total);
                ExpiredDays = t.expiredDays;
                ToExpiredDays = t.toExpiredDays;
            });
    }

    useEffect(() => {
        if (isModalOpen) {
            loadData();
        }
    }, [formData, pageSize, pageNum]);

    const showModal = () => {
        loadData();
        setIsModalOpen(true);
    };

    const closeModel = () => {
        setIsModalOpen(false);
        if (onClosed) {
            onClosed();
        }
    };

    const modifyStatusChange = (id: number, status: string, remark: string) => {
        updateProviderSyncStatus(id, status, remark).then(() => {
            const tmp = dataSource.map(t => {
                if (t.id === id) {
                    t.status = status;
                    t.remark = remark;
                }
                return t;
            });
            setDataSource(tmp);
            messageApi.info('已保存');
        })
    }

    const columns: ColumnsType<Provider.ProviderSyncIssue> = [
        {
            title: '序号',
            dataIndex: 'id',
            width: 60,
            align: 'center',
            render: (v, r, i) => (pageNum - 1) * pageSize + i + 1,
        },
        {
            title: '类别',
            dataIndex: 'type',
            width: 120,
            ellipsis: true,
            render: (v) => getSyncTypeName(v),
        },
        {
            title: '资源类型',
            width: 100,
            dataIndex: 'providerType',
        },
        {
            title: '资源名称',
            width: '15%',
            dataIndex: 'providerName',
            ellipsis: true,
            render: (v, row) => {
                const view = renderCol('providerName', wrapperProviderName)(v, row);
                return <Txt value={v}>{view}</Txt>
            },
        },
        {
            title: '字段分类',
            width: 100,
            dataIndex: 'fieldCategory',
            align: 'center',
            render: renderCol('fieldCategory', wrapperFieldCategory),
        },
        {
            title: '名称',
            width: '15%',
            dataIndex: 'fieldName',
            ellipsis: true,
            render: (v, row) => {
                const view = renderCol('fieldName', wrapperFieldName, loadData)(v, row);
                return <Txt value={v}>{view}</Txt>
            },
        },
        {
            title: '类型',
            dataIndex: 'fieldType',
            width: 80,
            align: 'center',
            render: renderCol('fieldType'),
        },
        {
            title: 'ForceNew',
            dataIndex: 'forceNew',
            width: 100,
            align: 'center',
            render: renderCol('forceNew'),
        },
        {
            title: 'Computed',
            dataIndex: 'computed',
            width: 100,
            align: 'center',
            render: renderCol('computed'),
        },
        {
            title: 'Required',
            dataIndex: 'requiredFlag',
            width: 100,
            align: 'center',
            render: renderCol('requiredFlag', wrapperRequired),
        },
        {
            title: 'SLA',
            dataIndex: 'daysUsed',
            align: 'center',
            width: 60,
            render: v => {
                if (v > ExpiredDays) {
                    return <Tag color="#fa541c">{v}</Tag>
                } else if (v + ToExpiredDays > ExpiredDays) {
                    return <Tag color="#ffc53d">{v}</Tag>
                }
                return v;
            },
        },
        {
            title: '状态',
            align: 'center',
            width: 80,
            dataIndex: 'status',
            render: v => {
                switch (v) {
                    case 'open':
                        return <Tag color="gold">待处理</Tag>;
                    case 'padding':
                        return <Tag color="purple">挂起</Tag>;
                    case 'service-missing':
                        return <Tag color="orange">服务未上线</Tag>;
                    case 'api-missing':
                        return <Tag color="orange">API未发布</Tag>;
                    case 'monitoring':
                        return <Tag color="purple">监控中</Tag>;
                    case 'closed':
                        return <Tag color="blue">已完成</Tag>;
                    case 'manually-closed':
                        return <Tag color="blue">手动关闭</Tag>;
                    case 'merging':
                        return <Tag color="blue">待合并</Tag>
                }
                return v
            }
        },
        {
            title: <>备注<EditOutlined style={{ color: '#6d6d6d' }} /></>,
            dataIndex: 'remark',
            width: 200,
            render: (v, row) => {
                return <Remark value={v} onChange={(remark, status) => {
                    if (remark === row.remark) {
                        return;
                    }
                    modifyStatusChange(row.id, status === '' ? row.status : status, remark)
                }} />
            },
        },
        {
            title: '操作',
            dataIndex: 'status',
            align: 'center',
            width: 160,
            render: (v, row) => {
                if (v === 'manually-closed') {
                    return <a onClick={() => modifyStatusChange(row.id, 'open', row.remark)}>开启</a>
                }

                return <Space>
                    {
                        v === 'padding' ?
                            <a onClick={() => modifyStatusChange(row.id, 'open', row.remark)}>取消挂起</a>
                            :
                            <a onClick={() => modifyStatusChange(row.id, 'padding', row.remark)}>挂起</a>
                    }

                    <MonitorDialog content={'监控'} option={'add'} cloudName={cloudName} field={row} onClose={loadData}
                        defaultValue={{
                            id: 0,
                            cloudName: cloudName,
                            providerType: row.providerType,
                            providerName: row.providerName,
                            type: 'API',
                            status: 'open',

                            productName: '',
                            method: '',
                            uriShort: '',
                            fieldIn: 'body',
                            fieldName: '',

                            relationType: row.type,
                            relationId: row.id,
                            groupName: '',
                        }}
                    />
                    <a onClick={() => modifyStatusChange(row.id, 'manually-closed', row.remark)}
                        style={{ color: 'red' }}> 关闭 </a>
                </Space>
            },
        },
    ];

    const getCloudName = () => {
        switch (cloudName) {
            case CloudName.HuaweiCloud:
                return '华为云';
            case CloudName.FlexibleEngineCloud:
                return '法电';
            case CloudName.G42Cloud:
                return 'G42';
        }
        return cloudName;
    }

    let view = <div style={{ display: 'flex' }}>
        <div onClick={showModal} style={{ width: '90%', display: 'flex', cursor: 'pointer' }}>
            <div style={{ width: '11.11%' }}>
                <div style={{ color: '#ff4d4f' }}>{sumData.expired}</div>
                <div className={'label'}>已超期</div>
            </div>
            <div style={{ width: '11.11%' }}>
                <div style={{ color: '#faad14' }}>{sumData.toExpired}</div>
                <div className={'label'}>即将超期</div>
            </div>
            <div style={{ width: '11.11%' }}>
                <div style={{ color: '#faad14' }}>{sumData.open}</div>
                <div className={'label'}>待处理</div>
            </div>
            <div style={{ width: '11.11%' }}>
                <div style={{ color: '#1677ff' }}>{sumData.padding}</div>
                <div className={'label'}>挂起</div>
            </div>
            <div style={{ width: '11.11%' }}>
                <div style={{ color: '#faad14' }}>{sumData.serviceMissing}</div>
                <div className={'label'}>服务未上线</div>
            </div>
            <div style={{ width: '11.11%' }}>
                <div style={{ color: '#faad14' }}>{sumData.apiMissing}</div>
                <div className={'label'}>API未发布</div>
            </div>
            <div style={{ width: '11.11%' }}>
                <div style={{ color: '#c388fd' }}>{sumData.monitoring || 0}</div>
                <div className={'label'}>监控中</div>
            </div>
            <div style={{ width: '11.11%' }}>
                <div style={{ color: '#52c41a' }}>{sumData.merging}</div>
                <div className={'label'}>待合并</div>
            </div>
            <div style={{ width: '11.11%' }}>
                <div style={{ color: '#52c41a' }}>{sumData.closed}</div>
                <div className={'label'}>已完成</div>
            </div>
        </div>
        <div style={{ width: '10%' }}>
            <ProviderSyncSumDialog
                cloudName={cloudName}
                syncType={syncType}
                status={['open']}
                context={
                    <>
                        <div style={{ color: '#1677ff' }}>{sumData.resource}&nbsp;&nbsp;{sumData.dataSource} </div>
                        <div className={'label'}>R & D</div>
                    </>
                }
            />
        </div>
    </div>

    if (short) {
        view = <div style={{ display: 'flex' }}>
            <div onClick={showModal} style={{ width: '83.34%', display: 'flex', cursor: 'pointer' }}>
                <div style={{ width: '20%' }}>
                    <div style={{ color: '#ff4d4f' }}>{sumData.expired}</div>
                    <div className={'label'}>已超期</div>
                </div>
                <div style={{ width: '20%' }}>
                    <div style={{ color: '#faad14' }}>{sumData.toExpired}</div>
                    <div className={'label'}>即将超期</div>
                </div>
                <div style={{ width: '20%' }}>
                    <div style={{ color: '#faad14' }}>{sumData.open}</div>
                    <div className={'label'}>待处理</div>
                </div>
                <div style={{ width: '20%' }}>
                    <div style={{ color: '#1677ff' }}>{sumData.padding}</div>
                    <div className={'label'}>挂起</div>
                </div>
                <div style={{ width: '20%' }}>
                    <div style={{ color: '#52c41a' }}>{sumData.merging}</div>
                    <div className={'label'}>待合并</div>
                </div>
            </div>
            <div style={{ width: '16.66%' }}>
                <ProviderSyncSumDialog
                    cloudName={cloudName}
                    syncType={syncType}
                    status={['open']}
                    context={
                        <>
                            <div style={{ color: '#1677ff' }}>{sumData.resource}&nbsp;&nbsp;{sumData.dataSource} </div>
                            <div className={'label'}>R & D</div>
                        </>
                    }
                />
            </div>
        </div>
    }

    return (
        <>
            {contextHolder}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ width: '100%', maxWidth: short ? '360px' : '680px' }}>
                    {view}
                </div>
            </div>
            <Modal title={`字段列表 - ${getSyncTypeName(syncType)}【${getCloudName()}】`}
                transitionName={''}
                destroyOnClose
                open={isModalOpen}
                onOk={closeModel}
                onCancel={closeModel}
                width={'95%'}
                footer={[]}>
                <Space size={20} direction={'vertical'} style={{ width: '100%' }}>
                    <SearchForm cloudName={cloudName} type={syncType} onSearch={v => {
                        setFormData(v);
                        setPageNum(1);
                    }} />
                    <Table dataSource={dataSource} columns={columns} size={'small'}
                        rowKey={(record) => record.id + ''}
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
                </Space>
            </Modal>
        </>
    );
}

export default ProviderSyncIssueDialog;
