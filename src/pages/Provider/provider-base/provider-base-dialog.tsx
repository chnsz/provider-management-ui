import React, {useState} from "react";
import {Button, Col, Divider, Input, message, Modal, notification, Row, Select, Space, Table, Tag} from "antd";
import {getProviderBaseList, saveProviderBase} from "@/services/provider/api";
import type {ColumnsType} from "antd/es/table/interface";
// @ts-ignore
import {Scrollbars} from 'react-custom-scrollbars';
import {set} from 'lodash'
import TextArea from "antd/es/input/TextArea";
import {EditOutlined} from "@ant-design/icons";
import ApiFieldDiffDialog from "@/pages/Provider/provider-base/api-field-diff-dialog";

const FieldTypeOption = [
    {value: 'string', label: 'string'},
    {value: 'integer', label: 'integer'},
    {value: 'float', label: 'float'},
    {value: 'boolean', label: 'boolean'},
    {value: 'number', label: 'number'},
    {value: 'array', label: 'array'},
    {value: 'object', label: 'object'},
    {value: 'map[string]string', label: 'map[string]string'},
    {value: 'map[string]boolean', label: 'map[string]boolean'},
    {value: 'map[string]integer', label: 'map[string]integer'},
    {value: 'map[string]array', label: 'map[string]array'},
    {value: 'map[string]object', label: 'map[string]object'},
];

const FieldInOption = [
    {value: 'body', label: 'body'},
    {value: 'path', label: 'path'},
    {value: 'query', label: 'query'},
    {value: 'header', label: 'header'},
]

const ProviderBaseDialog: React.FC<{
    apiId?: number,
    apiName?: string,
    providerType?: string,
    providerName?: string,
    text?: string,
    model?: 'button',
    onClosed?: () => any,
}> = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data1, setData1] = useState<Provider.ProviderBase[]>([]);
    const [data2, setData2] = useState<Provider.ProviderBase[]>([]);
    const [originData1, setOriginData1] = useState<Provider.ProviderBase[]>([]);
    const [originData2, setOriginData2] = useState<Provider.ProviderBase[]>([]);

    const [fieldName, setFieldName] = useState<string>('');
    const [fieldType, setFieldType] = useState<string>('string');
    const [fieldIn, setFieldIn] = useState<string>('body');
    const [fieldDesc, setFieldDesc] = useState<string>('');
    const [schemaName, setSchemaName] = useState<string>('');
    const [remark, setRemark] = useState<string>('');
    const [messageApi, contextHolder] = message.useMessage();
    const [expandKey1, setExpandKey1] = useState<string[]>([]);
    const [expandKey2, setExpandKey2] = useState<string[]>([]);
    const [inputFilter, setInputFilter] = useState<string>('');
    const [outputFilter, setOutputFilter] = useState<string>('');

    const showModal = () => {
        if (!props.apiId || !props.providerType || !props.providerName) {
            console.warn('apiId:', props.apiId, 'providerType', props.providerType, 'providerName', props.providerName)
            messageApi.warning('providerName 不可以为空');
            return
        }

        getProviderBaseList(props.apiId || 0, props.providerType || '', props.providerName || '')
            .then(data => {
                const arr1: Provider.ProviderBase[] = [];
                const arr2: Provider.ProviderBase[] = [];
                const expKey1: string[] = []
                const expKey2: string[] = []

                let num = 0;
                data.items.forEach(t => {
                    t.id = num++;
                    const key = t.paramType + '_' + t.fieldName + '_' + t.fieldIn + '_' + t.id;

                    if (t.paramType === 'input') {
                        arr1.push(t);
                        if (t.changeEvent) {
                            expKey1.push(key);
                        }
                    } else if (t.paramType === 'output') {
                        arr2.push(t);
                        if (t.changeEvent) {
                            expKey2.push(key);
                        }
                    }
                })
                setData1(arr1);
                setData2(arr2);
                setOriginData1(arr1);
                setOriginData2(arr2);
                setExpandKey1(expKey1);
                setExpandKey2(expKey2);
            });
        setIsModalOpen(true);
    };

    const handleOk = () => {
        saveProviderBase(props.apiId || 0,
            props.providerType || '',
            props.providerName || '',
            originData1.filter(t => t.useStatus !== ''),
            data2.filter(t => t.useStatus !== '')
        ).then((d: any) => {
            if (d === 'success') {
                setIsModalOpen(false);
                if (props.onClosed) {
                    props.onClosed();
                }
            }
        });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const markUsed = (dataType: string, row: Provider.ProviderBase) => {
        if (dataType === 'input') {
            setData1(
                data1.map(t => {
                    if (t.id === row.id) {
                        t.useStatus = 'used';
                    }
                    return t
                })
            );
        } else if (dataType === 'output') {
            setData2(
                data2.map(t => {
                    if (t.id === row.id) {
                        t.useStatus = 'used';
                    }
                    return t
                })
            );
        }
    }

    const markUnused = (dataType: string, row: Provider.ProviderBase) => {
        if (dataType === 'input') {
            setData1(
                data1.map(t => {
                    if (t.id === row.id) {
                        t.useStatus = 'not-used';
                    }
                    return t
                })
            );
        } else if (dataType === 'output') {
            setData2(
                data2.map(t => {
                    if (t.id === row.id) {
                        t.useStatus = 'not-used';
                    }
                    return t
                })
            );
        }
    }
    const markIgnore = (dataType: string, row: Provider.ProviderBase) => {
        if (dataType === 'input') {
            setData1(
                data1.map(t => {
                    if (t.id === row.id) {
                        t.useStatus = 'ignore';
                    }
                    return t
                })
            );
        } else if (dataType === 'output') {
            setData2(
                data2.map(t => {
                    if (t.id === row.id) {
                        t.useStatus = 'ignore';
                    }
                    return t
                })
            );
        }
    }

    const clean = (dataType: string, row: Provider.ProviderBase) => {
        if (dataType === 'input') {
            setData1(
                data1.map(t => {
                    if (t.id === row.id) {
                        t.useStatus = '';
                    }
                    return t
                })
            );
        } else if (dataType === 'output') {
            setData2(
                data2.map(t => {
                    if (t.id === row.id) {
                        t.useStatus = '';
                    }
                    return t
                })
            );
        }
    }

    const onEdit = (field: string, val: any, row: Provider.ProviderBase) => {
        set(row, field, val);
    }

    const addNewField = (paramType: string) => {
        const field = {
            id: new Date().getTime(),
            apiId: 0,
            paramType: paramType,
            fieldDesc: fieldDesc,
            fieldIn: fieldIn,
            fieldName: fieldName,
            fieldType: fieldType,
            manualTag: 'yes',
            remark: remark,
            schemaName: schemaName,
            useStatus: 'used'
        }
        if (paramType === 'input') {
            setData1([...data1, field]);
        } else if (paramType === 'output') {
            setData2([...data2, field]);
        }
        setFieldName('');
        setFieldType('string');
        setFieldDesc('');
        setFieldIn('body');
        setSchemaName('');
        setRemark('');
    }

    const markRestUnused = (paramType: string, state: string) => {
        return () => {
            if (paramType === 'input') {
                const data = data1.map(t => {
                    if (t.useStatus === '') {
                        t.useStatus = state
                    }
                    return t;
                });
                setData1(data);
            } else if (paramType === 'output') {
                const data = data2.map(t => {
                    if (t.useStatus === '') {
                        t.useStatus = state
                    }
                    return t;
                });
                setData2(data);
            }
        }
    }

    const columns1: ColumnsType<Provider.ProviderBase> = [
        {
            title: '序号',
            dataIndex: 'serialNo',
            align: 'center',
            width: 80,
            render: (v, r, i) => i + 1,
        },
        {
            title: <>字段位置<EditOutlined style={{color: '#6d6d6d'}}/></>,
            dataIndex: 'fieldIn',
            width: 120,
            align: 'center',
            render: (v: any, row) => {
                return <Select
                    defaultValue={v}
                    style={{width: '100%'}}
                    bordered={false}
                    onChange={v => onEdit('fieldIn', v, row)}
                    options={FieldInOption}
                />
            }
        },
        {
            title: <>字段名称<EditOutlined style={{color: '#6d6d6d'}}/></>,
            dataIndex: 'fieldName',
            width: '15%',
            ellipsis: true,
            render: (v: any, row) => {
                let required = <>&nbsp;</>;
                if (row.fieldRequired === 'yes' && row.fieldIn !== 'body') {
                    required = <span style={{color: '#ff4d4f', fontWeight: 'bold'}}>*</span>
                }
                return <>
                    {required}
                    <Input defaultValue={v}
                           bordered={false}
                           style={{width: '95%', marginLeft: '0', paddingLeft: '4px'}}
                           onBlur={(e) => onEdit('fieldName', e.target.value, row)}/>
                </>
            },
        },
        {
            title: <>字段类型<EditOutlined style={{color: '#6d6d6d'}}/></>,
            dataIndex: 'fieldType',
            width: 150,
            align: 'center',
            render: (v: any, row) => {
                return <Select
                    defaultValue={v}
                    style={{width: '100%'}}
                    bordered={false}
                    onChange={v => onEdit('fieldType', v, row)}
                    options={FieldTypeOption}
                />
            }
        },
        {
            title: <>字段描述<EditOutlined style={{color: '#6d6d6d'}}/></>,
            dataIndex: 'fieldDesc',
            render: (v: any, row) => {
                return <TextArea defaultValue={v}
                                 autoSize
                                 bordered={false}
                                 onBlur={(e) => onEdit('fieldDesc', e.target.value, row)}/>
            }
        },
        {
            title: <>标记状态</>,
            width: 100,
            align: 'center',
            dataIndex: 'useStatus',
            render: (v) => {
                if (v === 'used') {
                    return <Tag color="blue">已使用</Tag>
                }
                if (v === 'not-used') {
                    return <Tag color="orange">未使用</Tag>
                }
                if (v === 'ignore') {
                    return <Tag color="cyan">不关注</Tag>
                }
                return v;
            }
        },
        {
            title: <>Schema 名称<EditOutlined style={{color: '#6d6d6d'}}/></>,
            width: 200,
            dataIndex: 'schemaName',
            render: (v: any, row) => {
                return <Input defaultValue={v}
                              bordered={false}
                              onBlur={(e) => onEdit('schemaName', e.target.value, row)}/>
            }
        },
        {
            title: <>备注<EditOutlined style={{color: '#6d6d6d'}}/></>,
            width: 200,
            dataIndex: 'remark',
            render: (v: any, row) => {
                return <Input defaultValue={v}
                              bordered={false}
                              onBlur={(e) => onEdit('remark', e.target.value, row)}/>
            }
        },
        {
            title: '操作标记',
            width: 170,
            align: 'center',
            dataIndex: 'remark',
            render: (v, row) =>
                <>
                    <Space direction={'horizontal'}>
                        <a onClick={() => markUsed(row.paramType, row)}>已用</a>
                        <a onClick={() => markUnused(row.paramType, row)}>未用</a>
                        <a onClick={() => markIgnore(row.paramType, row)}>不关注</a>
                        <a onClick={() => clean(row.paramType, row)}>清空</a>
                        {/*<a onClick={() => remove(row.paramType, row)}>删除</a>*/}
                    </Space>
                </>
        },
    ];

    const filterInput = (val: string) => {
        setInputFilter(val);
        if (val === '') {
            setData1(originData1);
            return;
        }
        const arr = data1.filter(t => t.fieldName.toLowerCase().includes(val))
        setData1(arr);
    }

    const filterOutput = (val: string) => {
        setOutputFilter(val);
        if (val === '') {
            setData2(originData2);
            return;
        }
        const arr = data2.filter(t => t.fieldName.toLowerCase().includes(val))
        setData2(arr);
    }

    const columns2: ColumnsType<Provider.ProviderBase> = columns1.filter(t => t.title !== '字段位置')

    return <>
        {
            props.model === 'button' ?
                <Button type={'primary'} onClick={showModal} size={'small'}>对此基线</Button>
                :
                <a onClick={showModal} title={props.text}>{props.text}</a>
        }
        {contextHolder}
        <Modal title={`维护基线【${props.providerType}: ${props.providerName}】【API: ${props.apiName || ''}】`}
               open={isModalOpen}
               onOk={handleOk}
               onCancel={handleCancel}
               transitionName={''}
               destroyOnClose
               mask={false}
               maskClosable={false}
               width={'95%'}
               footer={[
                   <Button key="save" onClick={handleCancel}>关闭</Button>,
                   <Button key="close" type="primary" onClick={handleOk}>保存</Button>,
               ]}>
            <div style={{height: '75vh'}}>
                <Scrollbars>
                    <div style={{display: 'flex', padding: '10px 0'}}>
                        <div style={{flex: 5, fontWeight: 'bold', fontSize: '16px'}}>请求参数</div>
                        <div style={{flex: 1}}>
                            <div>
                                <span>过滤：</span>
                                <Input style={{width: '260px'}} value={inputFilter}
                                       allowClear
                                       onChange={(e) => filterInput(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <Table
                        columns={columns1}
                        dataSource={data1}
                        size={'small'}
                        pagination={false}
                        expandable={{
                            expandedRowRender: (record) => <ApiFieldDiffDialog providerBase={record}/>,
                            rowExpandable: (record) => record.changeEvent !== null,
                            expandedRowKeys: expandKey1,
                        }}
                        rowKey={r => r.paramType + '_' + r.fieldName + '_' + r.fieldIn + '_' + r.id}
                    />
                    <div>
                        <h4>手动补录</h4>
                        <Space direction={'horizontal'}>
                            名称:<Input style={{width: '200px'}}
                                        value={fieldName}
                                        onChange={(e) => setFieldName(e.target.value)}/>
                            位置:<Select style={{width: '100px'}}
                                         options={FieldInOption}
                                         value={fieldIn}
                                         onChange={val => setFieldIn(val)}/>
                            类型:<Select style={{width: '100px'}}
                                         options={FieldTypeOption}
                                         value={fieldType}
                                         onChange={val => setFieldType(val)}/>
                            描述:<Input style={{width: '200px'}}
                                        value={fieldDesc}
                                        onChange={(e) => setFieldDesc(e.target.value)}/>
                            Schema 名称:<Input style={{width: '100px'}}
                                               value={schemaName}
                                               onChange={(e) => setSchemaName(e.target.value)}/>
                            备注:<Input style={{width: '200px'}}
                                        value={remark}
                                        onChange={(e) => setRemark(e.target.value)}/>
                            <Button type="primary" onClick={() => addNewField('input')}>新增</Button>
                        </Space>
                    </div>
                    <Divider dashed/>
                    <div style={{display: 'flex', padding: '10px 0'}}>
                        <div style={{flex: 5, fontWeight: 'bold', fontSize: '16px'}}>响应参数</div>
                        <div style={{flex: 1}}>
                            <div>
                                <span>过滤：</span>
                                <Input style={{width: '260px'}} value={outputFilter}
                                       allowClear
                                       onChange={(e) => filterOutput(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <Table
                        columns={columns2}
                        dataSource={data2}
                        size={'small'}
                        pagination={false}
                        expandable={{
                            expandedRowRender: (record) => <ApiFieldDiffDialog providerBase={record}/>,
                            rowExpandable: (record) => record.changeEvent !== null,
                            expandedRowKeys: expandKey2,
                        }}
                        rowKey={r => r.paramType + '_' + r.fieldName + '_' + r.fieldIn + '_' + r.id}
                    />
                    <div>
                        <h4>手动补录</h4>
                        <Space direction={'horizontal'}>
                            名称:<Input style={{width: '200px'}}
                                        value={fieldName}
                                        onChange={(e) => setFieldName(e.target.value)}/>
                            类型:<Select style={{width: '100px'}}
                                         options={FieldTypeOption}
                                         value={fieldType}
                                         onChange={val => setFieldType(val)}/>
                            描述:<Input style={{width: '100px'}}
                                        value={fieldDesc}
                                        onChange={(e) => setFieldDesc(e.target.value)}/>
                            Schema 名称:<Input style={{width: '100px'}}
                                               value={schemaName}
                                               onChange={(e) => setSchemaName(e.target.value)}/>
                            备注:<Input style={{width: '200px'}}
                                        value={remark}
                                        onChange={(e) => setRemark(e.target.value)}/>
                            <Button type="primary" onClick={() => addNewField('output')}>新增</Button>
                        </Space>
                    </div>
                </Scrollbars>
                <Row style={{marginTop: '24px'}}>
                    <Col span={8}/>
                    <Col span={4}>
                        <Space>
                            <span>将剩余<span style={{color: '#fa541c'}}>入参</span>字段标记为：</span>
                            <a onClick={markRestUnused('input', 'not-used')}>未使用</a>
                            <a onClick={markRestUnused('input', 'ignore')}>不关注</a>
                        </Space>
                    </Col>
                    <Col span={4}>
                        <Space>
                            <span>将剩余<span style={{color: '#fa541c'}}>出参</span>字段标记为：</span>
                            <a onClick={markRestUnused('output', 'not-used')}>未使用</a>
                            <a onClick={markRestUnused('output', 'ignore')}>不关注</a>
                        </Space>
                    </Col>
                    <Col span={8}/>
                </Row>
            </div>
        </Modal>
    </>
}

export default ProviderBaseDialog;
