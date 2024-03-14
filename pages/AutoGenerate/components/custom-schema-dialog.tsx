import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Tabs, Table, Select, Space } from 'antd';
import { ApiDetail } from '../step1/api-config';

const { TabPane } = Tabs;


const CustomSchemaDialog: React.FC<{ apiData: ApiDetail, handle?: (option: 'ok' | 'cancel', rows: {}) => any, }> = ({ apiData, handle }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    let [dataNode, setDataNode] = useState<string | null>();
    let [dataNodeOption, setDataNodeOption] = useState<any>();
    let [customSchemaData, setCustomSchemaData] = useState<any>([]);
    let [customSchemaName, setCustomSchemaName] = useState<string | null>();
    let [customSchemaNameOption, setCustomSchemaNameOption] = useState<any>([]);
    let [customSchemaOperator, setCustomSchemaOperator] = useState<string | null>();
    let [customSchemaOperatorOption, setCustomSchemaOperatorOption] = useState<any>([]);

    const [defaultActiveKey, setDefaultActiveKey] = useState<string>('tab1');

    useEffect(() => {
        handleCustomData();
    }, [apiData]);

    const handleCustomData = () => {
        setDataNode(apiData.dataNode);
        setDataNodeOption(apiData.dataNodeOption);
        setCustomSchemaData(apiData.customSchemaData);
        setCustomSchemaName(apiData.customSchemaName);
        setCustomSchemaNameOption(apiData.customSchemaNameOption);
        setCustomSchemaOperator(apiData.customSchemaOperator);
        setCustomSchemaOperatorOption(apiData.customSchemaOperatorOption);
    }

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = (option: 'ok' | 'cancel') => {
        return () => {
            setIsModalOpen(false);
            if (handle) {
                const rows = {
                    dataNode,
                    dataNodeOption,
                    customSchemaData,
                    customSchemaName,
                    customSchemaNameOption,
                    customSchemaOperator,
                    customSchemaOperatorOption
                };
                handle(option, rows);
            }
        };
    };

    const columns = [
        {
            title: '字段名称',
            dataIndex: 'name',
            align: 'left',
        },
        {
            title: '运算符',
            dataIndex: 'operator',
            align: 'left',
        },
        {
            title: '操作',
            key: 'action',
            align: 'left',
            with: 150,
            render: (_, record: any) => {
                return <Space size="middle">
                    <a onClick={onDelete(record)}>移除</a>
                </Space>
            },
        }
    ];

    const tabChange = (key: string) => {
        setDefaultActiveKey(key);
    }

    const onDelete = (record: any) => {
        return () => {
            const name = record.name;
            const newData = customSchemaData?.filter(item => item.name !== name);
            setCustomSchemaData([...newData]);
        };
    }

    const onDataNodeChange = (e: any) => {
        const filterName = `${e}.`;
        const filterFieldList = apiData.outputFieldList?.filter(item => item.fieldName.startsWith(filterName));
        const filterCustomSchemaData = customSchemaData?.filter(item => item.name.startsWith(filterName));
        const customSchemaNameOption: any = [];
        filterFieldList?.forEach(item => {
            customSchemaNameOption.push({
                label: item.fieldName,
                value: item.fieldName
            })
        })

        setCustomSchemaNameOption(customSchemaNameOption);
        setCustomSchemaName(null);
        setCustomSchemaData(filterCustomSchemaData);
    }

    const onAddCustomData = () => {
        if (!customSchemaName || !customSchemaOperator) {
            return;
        }

        if (customSchemaData?.find(item => item.name === customSchemaName && item.operator === customSchemaOperator)) {
            return;
        }

        const index = customSchemaData?.findIndex(item => item.name === customSchemaName && item.operator !== customSchemaOperator)
        if (index >= 0) {
            customSchemaData[index].operator = customSchemaOperator;
            setCustomSchemaData([...customSchemaData]);
        } else {
            const newData = [{
                name: customSchemaName,
                operator: customSchemaOperator,
            }];

            setCustomSchemaData([...customSchemaData, ...newData]);
        }
    }

    return (
        <>
            <Button onClick={showModal} size={'small'} type={'primary'}>自定义Schema</Button>

            <Modal title="更多配置"
                destroyOnClose
                transitionName={''}
                open={isModalOpen}
                onOk={handleOk('ok')}
                onCancel={handleOk('cancel')}
                width={'60%'}>

                <Tabs defaultActiveKey={defaultActiveKey} onChange={tabChange}>
                    <TabPane tab="自定义Schema" key="tab1">
                        <Form
                            name="basic"
                            labelAlign="left"
                            labelCol={{ span: 2 }}
                            wrapperCol={{ span: 20 }}
                            initialValues={{ remember: true }}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="数据节点"
                                name="dataNode"
                                rules={[{ required: true, message: '请选择数据节点' }]}>

                                <Select placeholder="请选择数据节点"
                                    showSearch
                                    allowClear
                                    defaultValue={dataNode}
                                    options={dataNodeOption}
                                    onChange={e => {
                                        setDataNode(e);
                                        onDataNodeChange(e);
                                    }}
                                    style={{ width: '180px' }} />
                            </Form.Item>

                            <Form.Item
                                label="自定义字段"
                                name="customField"
                            >
                                <Table
                                    columns={columns}
                                    pagination={false}
                                    dataSource={customSchemaData}
                                    rowKey={r => r.name + '_' + r.operator}
                                />
                            </Form.Item>
                        </Form>
                        <div>
                            <span>
                                <span style={{ width: '90px', display: 'inline-block' }}>
                                    <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>* </span>
                                    字段名称:
                                </span>
                                <Select placeholder="请选择字段名称"
                                    showSearch
                                    allowClear
                                    value={customSchemaName}
                                    options={customSchemaNameOption}
                                    onChange={e => {
                                        setCustomSchemaName(e);
                                    }}
                                    style={{ width: '180px' }} />
                            </span>
                            <span style={{ marginLeft: '20px' }}>
                                <span style={{ width: '90px', display: 'inline-block' }}>
                                    <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>* </span>
                                    运算符:
                                </span>
                                <Select placeholder="请选择运算符"
                                    showSearch
                                    allowClear
                                    value={customSchemaOperator}
                                    options={customSchemaOperatorOption}
                                    onChange={e => {
                                        setCustomSchemaOperator(e);
                                    }}
                                    style={{ width: '180px' }} />
                            </span>
                            <Button size='small' style={{ marginLeft: '20px' }} onClick={onAddCustomData}>增加</Button>
                        </div>
                    </TabPane>
                </Tabs>
            </Modal>
        </>
    );
};

export default CustomSchemaDialog;
