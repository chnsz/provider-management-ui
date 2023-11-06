import React, {useEffect, useState} from 'react';
import {Button, Input, message, Modal, Table, Tag} from "antd";
import type {ProSchemaValueEnumObj} from "@ant-design/pro-utils/es/typing";
import type {ColumnsType} from "antd/es/table/interface";
import {getApiFieldChangedList, modifyApiFieldChangeStatus} from "@/services/api-change/api";
import {toShortDate} from "@/utils/common";
import {openApiExplorer} from "@/pages/Portal";
import {QueryFilter} from "@ant-design/pro-form";
import {ProFormSelect, ProFormText} from "@ant-design/pro-components";
import {getProviderList} from "@/services/provider/api";
import {EditOutlined} from "@ant-design/icons";
import {CloudName} from "@/global";
import Txt from "@/components/Txt/Txt";

type FormProps = {
    providerType: string;
    providerName: string;
    fieldName: string;
    changeEvent: string;
    status: string;
};

const SearchForm: React.FC<{ onSearch: (val: FormProps) => any }> = (props) => {
    const [providerNameMap, setProviderNameMap] = useState<ProSchemaValueEnumObj>({});

    useEffect(() => {
        getProviderList({cloudName: CloudName.HuaweiCloud}, 1000, 1).then(data => {
            const map: ProSchemaValueEnumObj = {};
            data.items.map((p) => p.name)
                .sort()
                .forEach(n => map[n] = n);
            setProviderNameMap(map)
        });
    }, []);

    const onProviderTypeChange = (v: "Resource" | "DataSource" | undefined) => {
        if (!v) {
            setProviderNameMap({});
            return;
        }
        getProviderList({cloudName: CloudName.HuaweiCloud, type: v}, 1000, 1).then(data => {
            const map: ProSchemaValueEnumObj = {};
            data.items.map((p) => p.name)
                .sort()
                .forEach(n => map[n] = n);
            setProviderNameMap(map)
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
                name="providerType"
                label="资源类型"
                showSearch
                fieldProps={{
                    onChange: onProviderTypeChange,
                }}
                valueEnum={{
                    Resource: 'Resource',
                    DataSource: 'DataSource',
                }}
            />
            <ProFormSelect
                name="providerName"
                label="资源名称"
                showSearch
                valueEnum={providerNameMap}
            />
            <ProFormText name="fieldName" label="字段名称" placeholder={'支持模糊搜索'}/>
            <ProFormSelect
                name="changeEvent"
                label="变更类型"
                showSearch
                valueEnum={{
                    NewField: '未分析',
                    Unused: '未使用',
                    Deprecated: '字段废弃',
                    DescChange: '描述变更',
                    TypeChange: '类型变更',
                    TypeAndDescChange: '描述&类型变更',
                }}
            />
            <ProFormSelect
                name="status"
                label="状态"
                showSearch
                valueEnum={{
                    open: '待处理',
                    padding: '挂起',
                    expired: '已超期',
                    toExpired: '即将超期',
                }}
            />
        </QueryFilter>
    );
};

let ExpiredDays = 30;
let ToExpiredDays = 10;

const OwnerApiFieldChangeDialog: React.FC<{
    content: any,
    owner: string,
    onClosed?: () => any
}> = ({content, owner, onClosed}) => {
    const [messageApi, contextHolder] = message.useMessage();

    const [data, setData] = useState<ApiChange.ApiFieldChange[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [total, setTotal] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(20);
    const [pageNum, setPageNum] = useState<number>(1);
    const [queryParams, setQueryParams] = useState<ApiChange.ApiFieldChangeQuery>({owner: owner})

    const loadData = (queryParams: ApiChange.ApiFieldChangeQuery, pageSize: number, pageNum: number) => {
        getApiFieldChangedList(queryParams, pageSize, pageNum).then((d) => {
            setData(d.items);
            setTotal(d.total);
            ExpiredDays = d.expiredDays;
            ToExpiredDays = d.toExpiredDays;
        });
    }

    useEffect(() => {
        if (!isModalOpen) {
            return
        }
        loadData(queryParams, pageSize, pageNum);
    }, [queryParams, pageSize, pageNum, isModalOpen]);

    const showModal = () => {
        setIsModalOpen(true);
        setPageNum(1)
    };

    const closeModel = () => {
        if (onClosed) {
            onClosed()
        }
        setIsModalOpen(false);
    };


    const onFormSearched = (query: FormProps) => {
        setQueryParams({
            owner: owner,
            providerType: query.providerType,
            providerName: query.providerName,
            fieldName: query.fieldName,
            changeEvent: query.changeEvent,
            status: query.status,
        });
    }

    const modifyStatusChange = (id: number, status: string, remark: string) => {
        modifyApiFieldChangeStatus(id, status, remark).then(() => {
            const tmp = data.map(t => {
                if (t.id === id) {
                    t.status = status;
                    t.remark = remark;
                }
                return t;
            });
            setData(tmp);
            messageApi.info('已保存');

            if (onClosed) {
                onClosed();
            }
        })
    }

    const columns: ColumnsType<ApiChange.ApiFieldChange> = [
        {
            title: '序号',
            dataIndex: 'sn',
            align: 'center',
            width: 60,
            render: (v, r, i) => (pageNum - 1) * pageSize + i + 1,
        },
        {
            title: '资源类型',
            dataIndex: 'providerType',
            align: 'center',
            ellipsis: true,
            width: 80,
        },
        {
            title: '资源名称',
            dataIndex: 'providerName',
            ellipsis: true,
            width: 150,
            render: v => <Txt value={v}/>,
        },
        {
            title: '变更类型',
            dataIndex: 'changeEvent',
            ellipsis: true,
            align: 'center',
            width: 90,
            render: v => {
                switch (v) {
                    case 'Deprecated':
                        return <Tag color="red">字段废弃</Tag>;
                    case 'NewField':
                        return <Tag color="cyan">未分析</Tag>;
                    case 'Unused':
                        return <Tag color="green">未使用</Tag>;
                    case 'DescChange':
                        return <Tag color="orange">描述变更</Tag>;
                    case 'TypeChange':
                        return <Tag color="orange">类型变更</Tag>;
                    case 'TypeAndDescChange':
                        return <Tag color="orange">描述&类型变更</Tag>;
                }
                return v
            }
        },
        {
            title: 'API名称',
            dataIndex: 'api',
            ellipsis: true,
            width: 170,
            render: (v, row) => openApiExplorer(row.api.productName, row.api.apiNameEn, row.api.uri, row.api.apiName + ' / ' + row.api.apiNameEn),
        },
        {
            title: '位置',
            dataIndex: 'fieldIn',
            align: 'center',
            ellipsis: true,
            width: 60,
        },
        {
            title: '字段名称',
            dataIndex: 'fieldName',
            ellipsis: true,
            width: 170,
            render: (v, row) => <Txt value={v}><span title={v + ' :\n\n' + row.fieldDesc}>{v}</span></Txt>,
        },
        {
            title: '字段类型',
            align: 'center',
            ellipsis: true,
            width: 110,
            dataIndex: 'fieldType',
        },
        {
            title: '变更时间',
            dataIndex: 'created',
            width: 85,
            align: 'center',
            render: toShortDate
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
                    case 'closed':
                        return <Tag color="blue">已完成</Tag>;
                }
                return v
            }
        },
        {
            title: <>备注<EditOutlined style={{color: '#6d6d6d'}}/></>,
            dataIndex: 'remark',
            ellipsis: true,
            width: 150,
            render: (v, row) => {
                return <Input defaultValue={v} bordered={false}
                              onBlur={e => {
                                  const remark = e.target.value;
                                  if (remark === row.remark) {
                                      return;
                                  }
                                  modifyStatusChange(row.id, row.status, remark)
                              }}
                />
            },
        },
        {
            title: '操作',
            dataIndex: 'status',
            align: 'center',
            width: 80,
            render: (v, row) => {
                let text = '挂起';
                let status = 'padding';
                if (v === 'padding') {
                    text = '取消挂起';
                    status = 'open';
                }
                return <a onClick={() => modifyStatusChange(row.id, status, row.remark)}>{text}</a>
            },
        },
    ];

    return (
        <>
            {contextHolder}
            <div style={{cursor: 'pointer'}} onClick={showModal}>{content}</div>
            <Modal title={'API变更列表【' + owner + '】'}
                   transitionName={''}
                   open={isModalOpen}
                   onOk={closeModel}
                   onCancel={closeModel}
                   width={1750}
                   footer={[
                       <Button key="close" type="primary" onClick={closeModel}>关闭</Button>
                   ]}>
                <SearchForm onSearch={onFormSearched}/>
                <div style={{height: '24px'}}/>
                <Table columns={columns} dataSource={data} size={'middle'}
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
            </Modal>
        </>
    );
};

export default OwnerApiFieldChangeDialog;
