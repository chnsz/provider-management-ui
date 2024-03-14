import React, {useEffect, useState} from 'react';
import {Button, Form, Modal, Tabs, Table, Select, Space} from 'antd';
import {ApiDetail} from '../step1/api-config';

const {TabPane} = Tabs;


const CustomSchemaDialog: React.FC<{
    apiData: ApiDetail,
    handle?: (option: 'ok' | 'cancel', rows: {}) => any,
}> = ({apiData, handle}) => {
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
            <Button onClick={showModal} size={'small'} type={'link'}>自定义Schema</Button>

            <Modal title="更多配置"
                   destroyOnClose
                   transitionName={''}
                   open={isModalOpen}
                   onOk={handleOk('ok')}
                   onCancel={handleOk('cancel')}
                   width={'1000px'}>

                <Tabs defaultActiveKey={defaultActiveKey} onChange={tabChange}>
                    <TabPane tab="自定义Schema" key="tab1">
                        <Space direction={'vertical'} size={20} style={{width: '100%'}}>
                            <div>
                                <span style={{color: '#ff4d4f', fontWeight: 'bold'}}>* </span>
                                <span style={{marginRight: '10px'}}>数据根节点:</span>
                                <Select placeholder="请选择数据节点"
                                        showSearch
                                        allowClear
                                        defaultValue={dataNode}
                                        options={dataNodeOption}
                                        onChange={e => {
                                            setDataNode(e);
                                            onDataNodeChange(e);
                                        }}
                                        style={{width: '300px'}}/>
                            </div>
                            <div>
                                <h4>自定义字段列表</h4>
                                <Table
                                    columns={columns}
                                    size={'middle'}
                                    pagination={false}
                                    dataSource={customSchemaData}
                                    rowKey={r => r.name + '_' + r.operator}
                                />
                            </div>
                            <div>
                            <span>
                                <span style={{color: '#ff4d4f', fontWeight: 'bold'}}>* </span>
                                <span style={{marginRight: '10px', display: 'inline-block'}}>
                                    新增字段:
                                </span>
                                <Select placeholder="请选择字段名称"
                                        showSearch
                                        allowClear
                                        value={customSchemaName}
                                        options={customSchemaNameOption}
                                        onChange={e => {
                                            setCustomSchemaName(e);
                                        }}
                                        style={{width: '300px'}}/>
                            </span>
                                <span style={{marginLeft: '20px'}}>
                                <span style={{marginRight: '10px', display: 'inline-block'}}>
                                    <span style={{color: '#ff4d4f', fontWeight: 'bold'}}>* </span>
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
                                        style={{width: '180px'}}/>
                            </span>
                                <Button type={'primary'} size='small' style={{marginLeft: '20px'}}
                                        onClick={onAddCustomData}>增加</Button>
                            </div>
                        </Space>
                    </TabPane>
                </Tabs>
            </Modal>
        </>
    );
};

export default CustomSchemaDialog;
