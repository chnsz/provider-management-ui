import ProviderApiList from '@/pages/Portal/components/provider-api-list';
import { EditOutlined, MinusCircleOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd';
import { Input, message, Modal, Select, Space, Switch, Table, Tabs } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import '../portal.less';
import {
    changeEpsSupport,
    changePrePaidSupport,
    changeTagSupport,
    changeUtFlag,
    getProviderList,
    getProviderSyncList,
    updateRelaTag,
    updateRemark,
    updateSchemaSyncStatus,
    updateSync
} from "@/services/provider/api";
// @ts-ignore
import { Scrollbars } from 'react-custom-scrollbars';
import { CloudName } from "@/global";

const EditInput: React.FC<{ val: string, onBlur: (v: string) => any }> = ({ val, onBlur }) => {
    const [value, setValue] = useState(val);
    useEffect(() => {
        setValue(val);
    }, [val]);

    return <>
        <Input value={value} maxLength={16}
            onChange={(v) => setValue(v.target.value)}
            onBlur={(v) => onBlur(v.target.value)}
        />
    </>
}


const ProviderListCard: React.FC<{
    productName: string,
    tableHeight?: string,
    hideTitle?: boolean,
    selectedKey?: string
}> = (
    { productName, tableHeight, hideTitle, selectedKey }
) => {
        const [messageApi, contextHolder] = message.useMessage();
        const [data, setData] = useState<Provider.Provider[]>([]);
        const [g42Data, setG42Data] = useState<Provider.Provider[]>([]);
        const [flexibleEngineData, setFlexibleEngineData] = useState<Provider.Provider[]>([]);
        const [apiList, setApiList] = useState<Api.Detail[]>([]);
        const [isModalOpen, setIsModalOpen] = useState(false);
        const tabHeight = tableHeight || '380px';
        const [huaweiCount, setHuaweiCount] = useState<number>(0)
        const [g42Count, setG42Count] = useState<number>(0)
        const [feCount, setFeCount] = useState<number>(0)
        const defSelected = selectedKey || '1';

        const showApiList = (record: Provider.Provider) => {
            return () => {
                setApiList(record.apiList);
                setIsModalOpen(true);
            }
        };

        const loadData = (prodName: string) => {
            getProviderList({ cloudName: CloudName.HuaweiCloud, productName: prodName }, 100, 1)
                .then((rsp) => {
                    setData(rsp.items);
                    setHuaweiCount(rsp.items.length)
                });

            getProviderSyncList({ cloudName: CloudName.G42Cloud, productName: prodName })
                .then((rsp: Global.List<Provider.Provider[]>) => {
                    setG42Data(rsp.items);
                    let count = 0;
                    rsp.items.forEach(t => {
                        if (t.g42Name) {
                            count++
                        }
                    })
                    setG42Count(count);
                });
            getProviderSyncList({ cloudName: CloudName.FlexibleEngineCloud, productName: prodName })
                .then((rsp: Global.List<Provider.Provider[]>) => {
                    setFlexibleEngineData(rsp.items);
                    let count = 0;
                    rsp.items.forEach(t => {
                        if (t.feName) {
                            count++
                        }
                    })
                    setFeCount(count);
                });
        }

        useEffect(() => {
            loadData(productName);
        }, [productName]);

        const onChange = (type: string, record: Provider.Provider) => {
            return (checked: boolean) => {
                switch (type) {
                    case 'prePaidSupport':
                        changePrePaidSupport(record.id, checked ? 'true' : 'false');
                        return;
                    case 'epsSupport':
                        changeEpsSupport(record.id, checked ? 'true' : 'false');
                        return;
                    case 'tagSupport':
                        changeTagSupport(record.id, checked ? 'true' : 'false');
                        return;
                    case 'utFlag':
                        changeUtFlag(record.id, checked ? 'full_coverage' : '-');
                        return;
                }
            };
        };

        const commonFeatureRender = (featType: string) => {
            return (text: string, record: Provider.Provider) => {
                if (record.type === 'DataSource') {
                    return <span><MinusCircleOutlined style={{ color: 'rgba(0, 0, 0, 0.43)' }} /></span>
                }
                return <Switch defaultChecked={text === 'true'} onChange={onChange(featType, record)} />;
            }
        }

        const huaweiCloudColumns: ColumnsType<Provider.Provider> = [
            {
                title: '序号',
                dataIndex: 'serialNo',
                align: 'center',
                width: 45,
                render: (v, r, i) => i + 1,
            },
            {
                title: '资源类型',
                dataIndex: 'type',
                ellipsis: true,
                width: '8%',
            },
            {
                title: 'Category',
                dataIndex: 'category',
                ellipsis: true,
                width: 100,
            },
            {
                title: '名称',
                dataIndex: 'name',
                render: (name) => <a href="#">{name}</a>,
            },
            {
                title: '调用 API 个数',
                dataIndex: 'apiList',
                width: '10%',
                align: 'center',
                render: (val, record) => (
                    <a type="button" onClick={showApiList(record)}>
                        {(val || []).length}
                    </a>
                ),
            },
            {
                title: 'UT覆盖率(%)',
                width: '120px',
                align: 'center',
                dataIndex: 'utCoverage',
                render: (text, record) => {
                    return (
                        <>
                            <Switch style={{ width: '60px' }}
                                defaultChecked={record.utFlag === 'full_coverage' || text > 80}
                                checkedChildren={text}
                                unCheckedChildren={text}
                                onChange={onChange('utFlag', record)}
                            />
                        </>
                    );
                },
            },
            {
                title: '包周期',
                width: '7%',
                align: 'center',
                dataIndex: 'prePaidSupport',
                render: commonFeatureRender('prePaidSupport'),
            },
            {
                title: '标签',
                width: '7%',
                align: 'center',
                dataIndex: 'tagSupport',
                render: commonFeatureRender('tagSupport'),
            },
            {
                title: '企业项目',
                width: '7%',
                align: 'center',
                dataIndex: 'epsSupport',
                render: commonFeatureRender('epsSupport'),
            },
        ];

        const saveProvider = (fieldName: string, val: string, row: Provider.Provider) => {
            if (fieldName === 'name') {
                if (row.cloudName === CloudName.G42Cloud && val === row.g42Name) {
                    return;
                }
                if (row.cloudName === CloudName.FlexibleEngineCloud && val === row.feName) {
                    return;
                }
                updateSync(row.id, row.cloudName, val).then(() => {
                    messageApi.info('操作成功');
                    loadData(productName);
                });
            } else if (fieldName === 'remark') {
                if (row.cloudName === CloudName.G42Cloud && val === row.g42Remark) {
                    return;
                }
                if (row.cloudName === CloudName.FlexibleEngineCloud && val === row.feRemark) {
                    return;
                }
                updateRemark(row.id, row.cloudName, val).then(() => {
                    messageApi.info('操作成功');
                    loadData(productName);
                });
            } else if (fieldName === 'relaTag') {
                if (row.cloudName === CloudName.G42Cloud && val === row.g42RelaTag) {
                    return;
                }
                if (row.cloudName === CloudName.FlexibleEngineCloud && val === row.feRelaTag) {
                    return;
                }
                updateRelaTag(row.id, row.cloudName, val).then(() => {
                    messageApi.info('操作成功');
                    loadData(productName);
                });
            } else if (fieldName === 'schemaSyncStatus') {
                if (row.cloudName === CloudName.G42Cloud && val === row.g42SchemaSyncStatus) {
                    return;
                }
                if (row.cloudName === CloudName.FlexibleEngineCloud && val === row.feSchemaSyncStatus) {
                    return;
                }
                updateSchemaSyncStatus(row.id, row.cloudName, val).then(() => {
                    messageApi.info('操作成功');
                    loadData(productName);
                });
            }
        }

        const partnerColumns: ColumnsType<Provider.Provider> = [
            {
                title: '序号',
                dataIndex: 'serialNo',
                align: 'center',
                width: 45,
                render: (v, r, i) => i + 1,
            },
            {
                title: '资源类型',
                dataIndex: 'type',
                ellipsis: true,
                width: 80,
            },
            {
                title: 'Category',
                dataIndex: 'category',
                ellipsis: true,
                width: 120,
            },
            {
                title: '华为云资源名称',
                dataIndex: 'name',
            },
            {
                title: <>伙伴云资源名称<EditOutlined style={{ color: '#6d6d6d' }} /></>,
                dataIndex: 'name',
                render: (v, row) => {
                    let name = ''
                    if (row.cloudName === CloudName.G42Cloud) {
                        name = row.g42Name;
                    } else if (row.cloudName === CloudName.FlexibleEngineCloud) {
                        name = row.feName;
                    }
                    return <Input defaultValue={name} bordered={false}
                        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                            saveProvider('name', e.target.value, row)
                        }}
                    />
                },
            },
            {
                title: <>备注<EditOutlined style={{ color: '#6d6d6d' }} /></>,
                width: 250,
                render: (v: any, row) => {
                    let remark = ''
                    if (row.cloudName === CloudName.G42Cloud) {
                        remark = row.g42Remark;
                    } else if (row.cloudName === CloudName.FlexibleEngineCloud) {
                        remark = row.feRemark;
                    }
                    return <>
                        <EditInput val={remark} onBlur={(val: string) => saveProvider('remark', val, row)} />
                        <Space>
                            <a onClick={() => {
                                saveProvider('remark', '缺API', row)
                            }}>
                                缺少API
                            </a>
                            <a onClick={() => {
                                saveProvider('remark', '无服务', row)
                            }}>
                                无服务
                            </a>
                            <a onClick={() => {
                                saveProvider('remark', '待支持', row)
                            }}>
                                待支持
                            </a>
                        </Space>
                    </>
                }
            },
            {
                title: <>引用<EditOutlined style={{ color: '#6d6d6d' }} /></>,
                dataIndex: 'g42RelaTag',
                width: '90px',
                render: (v: any, row) => {
                    let relaTag = ''
                    if (row.cloudName === CloudName.G42Cloud) {
                        relaTag = row.g42RelaTag;
                    } else if (row.cloudName === CloudName.FlexibleEngineCloud) {
                        relaTag = row.feRelaTag;
                    }
                    return <Select
                        defaultValue={relaTag}
                        bordered={false}
                        style={{ width: '80%' }}
                        onChange={(val: string) => saveProvider('relaTag', val, row)}
                        options={[
                            { value: 'yes', label: '是' },
                            { value: 'no', label: '否' },
                        ]}
                    />
                }
            },
        ];

        const items: TabsProps['items'] = [
            {
                key: '1',
                label: <>华为云 ({huaweiCount})</>,
                children: <div style={{ height: tabHeight }}>
                    <Scrollbars>
                        <Table size={'middle'}
                            columns={huaweiCloudColumns}
                            dataSource={data}
                            pagination={false}
                            rowKey={(record) => record.id}
                        />
                    </Scrollbars>
                </div>,
            },
            {
                key: '2',
                label: <>法电 ({feCount})</>,
                children: <div style={{ height: tabHeight }}>
                    <Scrollbars>
                        <Table size={'small'}
                            columns={partnerColumns}
                            dataSource={flexibleEngineData}
                            pagination={false}
                            rowKey={(record) => record.id}
                        />
                    </Scrollbars>
                </div>,
            },
            {
                key: '3',
                label: <>G42 ({g42Count})</>,
                children: <div style={{ height: tabHeight }}>
                    <Scrollbars>
                        <Table size={'small'}
                            columns={partnerColumns}
                            dataSource={g42Data}
                            pagination={false}
                            rowKey={(record) => record.id}
                        />
                    </Scrollbars>
                </div>,
            },
        ];

        return (
            <>
                {contextHolder}
                <div className={'portal-card'}>
                    {hideTitle ? <></> : <div className={'header'}>Provider 列表</div>}
                    <div className={'container'}>
                        <Tabs defaultActiveKey={defSelected} items={items} />
                    </div>
                </div>
                <Modal
                    title="引用API个数"
                    transitionName={''}
                    destroyOnClose
                    open={isModalOpen}
                    footer={null}
                    onCancel={() => setIsModalOpen(false)}
                    width={1400}
                >
                    <ProviderApiList data={apiList} />
                </Modal>
            </>
        );
    };
export default ProviderListCard;
