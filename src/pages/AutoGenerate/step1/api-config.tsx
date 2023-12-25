import { Button, Checkbox, Col, Collapse, Input, Row, Select, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useState } from 'react';
import { EditOutlined } from "@ant-design/icons";
import '../api-config.less';
import ChooseApiDialog from '../components/choose-api-dialog';
import { getApiFieldList } from '@/services/auto-generate/api';

const { Panel } = Collapse;
const { TextArea } = Input;

export type ApiDetail = {
    id: number;
    productGroup: string;
    productName: string;
    apiGroup: string;
    apiName: string;
    apiNameEn: string;
    method: string;
    uri: string;
    uriShort: string;
    publishStatus: string;
    useRemark: string;
    remark: string;
    definition: string;
    lastSyncDate: string;
    created: string;
    updated: string;
    providerList: null;
    funArrange?: {
        value: string;
        label: string
    }

    inputFieldList: Field[];
    outputFieldList: Field[];

    schemaType: string;
    statusCode: string;
    resourceId: string;
    rosourceOption: {
        label: string,
        value: string,
    }[];
};

export type Field = {
    id: number;
    apiId: number;
    paramType: 'input' | 'output';
    fieldName: string;
    fieldType: string;
    fieldRequired: string;
    fieldIn: string;
    fieldDesc: string;

    ignore?: boolean;
    schemaName: string;
    schemaType: string;
    schemaRequired: boolean;
    schemaDesc: string;
    computed?: boolean;
    default?: string;
    sensitive?: boolean;
    schemaTypeOption?: any;
    selectSchemaName?: string;
}

const FieldTypeOption = [
    { value: 'string', label: 'schema.TypeString' },
    { value: 'integer', label: 'schema.TypeInt' },
    { value: 'float', label: 'schema.TypeFloat' },
    { value: 'boolean', label: 'schema.TypeBool' },
    { value: 'number', label: 'schema.TypeFloat' },
    { value: 'array', label: 'schema.TypeList' },
    { value: 'object', label: 'schema.TypeList' },
    { value: 'map[string]string', label: 'schema.TypeMap' },
];

const ApiFieldView: React.FC<{
    apiData: ApiDetail;
    baseInfo: any;
    apiAllData: ApiDetail[];
    onFieldChange: (paramType: 'input' | 'output', field: Field, paramName?: string, schemaValue?: any) => any;
    onStatusCodeChange: (value: string) => any;
    onResourceIdChange: (value: string) => any;
    onChooseIgnore: (paramsType: 'input' | 'output') => any;
    onCancelIgnore: (paramsType: 'input' | 'output') => any;
}> = ({ apiData, baseInfo, apiAllData, onFieldChange, onStatusCodeChange, onResourceIdChange, onChooseIgnore, onCancelIgnore }) => {
    const columns: ColumnsType<Field> = [{
        title: '序号',
        dataIndex: 'serialNo',
        align: 'center',
        width: 80,
        className: 'api-col',
        render: (v, r, i) => i + 1,
    }, {
        title: 'API 字段',
        children: [{
            title: <>位置</>,
            dataIndex: 'fieldIn',
            width: 90,
            ellipsis: true,
            align: 'center',
            className: 'api-col',
        }, {
            title: '类型',
            dataIndex: 'fieldType',
            align: 'center',
            ellipsis: true,
            width: 150,
            className: 'api-col',
        }, {
            title: '名称',
            dataIndex: 'fieldName',
            ellipsis: true,
            width: 200,
            className: 'api-col',
        }, {
            title: '描述',
            dataIndex: 'fieldDesc',
            ellipsis: true,
            className: 'api-col',
        }]
    }, {
        title: 'Schema 字段',
        children: [{
            title: <>是否忽略<EditOutlined style={{ color: '#6d6d6d' }} /></>,
            dataIndex: 'ignore',
            align: 'center',
            width: 90,
            render: (v, row) => {
                return <Checkbox defaultChecked={v} checked={row.ignore} onChange={e => {
                    row.ignore = e.target.checked;
                    onFieldChange(row.paramType, row)
                }} />
            }
        }, {
            title: <>名称<EditOutlined style={{ color: '#6d6d6d' }} /></>,
            dataIndex: 'schemaName',
            ellipsis: true,
            width: 175,
            render: (v, row) => {
                let schemaTypeOption: Array<any> = [{
                    label: 'id',
                    value: 'id'
                }];
                const isArgumentApi = apiAllData.some(item => item.schemaType === 'argument');
                if (isArgumentApi) {
                    apiAllData.forEach(item => {
                        if (item.schemaType === 'argument') {
                            item.inputFieldList.forEach(i => {
                                schemaTypeOption.push({
                                    label: i.schemaName,
                                    value: i.schemaName
                                });
                            })
                        }
                    });

                    schemaTypeOption = [...new Set(schemaTypeOption.map(item => JSON.stringify(item)))].map(item => JSON.parse(item));
                }
                // 通过row.apiId,找到api,使用api.schemaType去判断
                const api = apiAllData.find(item => item.id === row.apiId);
                if (isArgumentApi && baseInfo?.providerType === 'Resource' && row.paramType === 'input' && api && ['attribute', 'delete', 'update'].includes(api.schemaType)) {
                    row.schemaTypeOption = schemaTypeOption;
                    return <Select
                        allowClear
                        showSearch
                        defaultValue={row.selectSchemaName}
                        placeholder="请选择"
                        style={{ width: '100%' }}
                        bordered={false}
                        onChange={v => {
                            row.schemaName = v;
                            row.selectSchemaName = v;
                            onFieldChange(row.paramType, row)
                        }}
                        options={schemaTypeOption}
                    />
                } else {
                    return <Input defaultValue={v}
                        onChange={e => {
                            row.schemaName = e.target.value;
                            const oldValue = v;
                            const newValue = e.target.value;
                            const schemaValue = {
                                oldValue,
                                newValue
                            };
                            onFieldChange(row.paramType, row, 'schemaName', schemaValue)
                        }} />
                }
            },
        }, {
            title: <>类型<EditOutlined style={{ color: '#6d6d6d' }} /></>,
            dataIndex: 'schemaType',
            align: 'center',
            ellipsis: true,
            width: 175,
            render: (v: any, row) => {
                return <Select
                    defaultValue={v}
                    style={{ width: '100%' }}
                    bordered={false}
                    onChange={v => {
                        row.schemaType = v;
                        onFieldChange(row.paramType, row)
                    }}
                    options={FieldTypeOption}
                />
            }
        }, {
            title: <>必填<EditOutlined style={{ color: '#6d6d6d' }} /></>,
            dataIndex: 'schemaRequired',
            align: 'center',
            width: 80,
            render: (v, row) => {
                return <Checkbox defaultChecked={v} onChange={e => {
                    row.schemaRequired = e.target.checked;
                    onFieldChange(row.paramType, row)
                }} />
            }
        },
        {
            title: <>Computed<EditOutlined style={{ color: '#6d6d6d' }} /></>,
            dataIndex: 'computed',
            align: 'center',
            width: 100,
            render: (v, row) => {
                return <Checkbox defaultChecked={v} onChange={e => {
                    row.computed = e.target.checked;
                    onFieldChange(row.paramType, row)
                }} />
            }
        },
        {
            title: <>Sensitive<EditOutlined style={{ color: '#6d6d6d' }} /></>,
            dataIndex: 'sensitive',
            align: 'center',
            width: 100,
            render: (v, row) => {
                return <Checkbox defaultChecked={v} onChange={e => {
                    row.sensitive = e.target.checked;
                    onFieldChange(row.paramType, row)
                }} />
            }
        },
        {
            title: <>默认值<EditOutlined style={{ color: '#6d6d6d' }} /></>,
            dataIndex: 'default',
            align: 'center',
            width: 100,
            render: (v, row) => {
                return <Input defaultChecked={v} onChange={e => {
                    row.default = e.target.value;
                    onFieldChange(row.paramType, row)
                }} />
            }
        },
        {
            title: <>描述<EditOutlined style={{ color: '#6d6d6d' }} /></>,
            dataIndex: 'schemaDesc',
            ellipsis: true,
            render: (v, row) => {
                return <TextArea rows={1} defaultValue={v} onChange={e => {
                    row.schemaDesc = e.target.value;
                    onFieldChange(row.paramType, row)
                }} />
            },
        }]
    }];

    const outputColumns: ColumnsType<Field> = columns.slice().map((column: any) => {
        if (column.children) {
            return {
                ...column,
                children: column.children.filter((child: any) => !['schemaRequired', 'computed', 'sensitive', 'default'].includes(child.dataIndex))
            };
        }
        return column;
    });

    return <div style={{ margin: '0 6px' }}>
        <Space className='api-config' direction={'vertical'}>
            <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '10px' }}>请求参数</div>
            <div style={{ display: 'flex' }}>
                {
                    apiData.schemaType === 'argument' ?
                        <span style={{ marginRight: '20px' }}>
                            资源ID &nbsp;&nbsp;&nbsp;
                            <Select placeholder="请选择资源ID"
                                showSearch
                                style={{ width: '180px' }}
                                value={apiData.resourceId}
                                options={apiData.rosourceOption}
                                onChange={(e) => {
                                    apiData.resourceId = e;
                                    onResourceIdChange(e)
                                }} />
                        </span> :
                        <span></span>
                }

                <span>
                    成功状态码 &nbsp;&nbsp;&nbsp;
                    <Input defaultValue={apiData.statusCode}
                        onChange={(e) => {
                            apiData.statusCode = e.target.value;
                            onStatusCodeChange(e.target.value)
                        }}
                        placeholder="请输入成功状态码" style={{ width: '145px' }} />
                </span>
            </div>
            <div style={{ marginTop: '10px' }}>
                <Button type="primary" size='small' onClick={() => onChooseIgnore('input')}>全部忽略</Button>
                <Button type="primary" size='small' onClick={() => onCancelIgnore('input')} style={{ marginLeft: '20px' }}>取消全部忽略</Button>
            </div>

            <Table
                columns={columns}
                dataSource={apiData.inputFieldList}
                size={'middle'}
                pagination={false}
                rowKey={r => r.id}
            />
            <div style={{ height: '15px' }}></div>
            {
                ['argument', 'attribute'].includes(apiData.schemaType) &&
                <div>
                    <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '10px' }}>响应参数</div>
                    <div style={{ marginTop: '10px' }}>
                        <Button type="primary" size='small' onClick={() => onChooseIgnore('output')}>全部忽略</Button>
                        <Button type="primary" size='small' onClick={() => onCancelIgnore('output')} style={{ marginLeft: '20px' }}>取消全部忽略</Button>
                    </div>
                    <Table
                        columns={outputColumns}
                        dataSource={apiData.outputFieldList}
                        size={'middle'}
                        pagination={false}
                        rowKey={r => r.id}
                    />
                </div>
            }

        </Space>
    </div>;
}

const ApiInfo: React.FC<{ api: ApiDetail, onSchemaTypeChange: (v: string) => any, deleteApiData: () => any }> = ({ api, onSchemaTypeChange, deleteApiData }) => {
    return <Row>
        <Col span={12}>
            <Select
                onClick={(e) => e.stopPropagation()}
                showArrow
                style={{ width: '140px', marginRight: '10px' }}
                placeholder={'请选择操作'}
                value={api.schemaType}
                onChange={onSchemaTypeChange}
            >
                <Option value="argument">CreateContext</Option>
                <Option value="attribute">ReadContext</Option>
                <Option value="update">UpdateContext</Option>
                <Option value="delete">DeleteContext</Option>
            </Select>
            #{api.id} 【{api.productName}】&nbsp;&nbsp;{api.apiName} / {api.apiNameEn}
        </Col>
        <Col span={12} style={{ textAlign: 'right', marginTop: '4px' }}>
            [{api.method}]&nbsp;&nbsp;{api.uri}
            <Button size='small' onClick={deleteApiData} style={{ marginLeft: '8px' }}>移除</Button>
        </Col>
    </Row>;
}

const ApiConfig: React.FC<{ setData: (data: ApiDetail[]) => any, baseInfo: any, dataId: number | null, apiDataPar: ApiDetail[] }> = ({ setData, baseInfo, dataId, apiDataPar }) => {
    let [apiData, setApiData] = useState<ApiDetail[]>([]);
    const [activeKey, setActiveKey] = useState<string[]>([]);
    apiData = apiDataPar;

    const onAdd = (apiId: number[], rows: Api.Detail[]) => {
        getApiFieldList(apiId).then(rst => {
            const tmp = rst.map(t => {
                let api: ApiDetail = { ...t };
                const findApiData = apiData.find(item => item.id === api.id);
                if (findApiData) {
                    api.schemaType = findApiData.schemaType;
                }
                api.statusCode = '';
                api.resourceId = '';
                api.rosourceOption = [];

                api.inputFieldList?.map(t => {
                    t.schemaName = t.fieldName;
                    t.schemaType = t.fieldType;
                    t.schemaRequired = t.fieldRequired === 'yes' ? true : false;
                    t.schemaDesc = t.fieldDesc;
                    t.ignore = false;
                    t.computed = false;
                    t.default = '';
                    t.sensitive = false;
                    t.selectSchemaName = '';
                    return t;
                });

                api.outputFieldList?.forEach(t => {
                    t.schemaName = t.fieldName;
                    t.schemaType = t.fieldType;
                    t.schemaRequired = t.fieldRequired === 'yes' ? true : false;
                    t.schemaDesc = t.fieldDesc;
                    t.ignore = true;
                    api.rosourceOption.push({
                        label: t.fieldName,
                        value: t.fieldName
                    })
                });
                return api;
            });

            const mergedArray = dataId ? [...apiData] : [...tmp];
            // 编辑自动生成，保留用户之前的api
            if (dataId) {
                tmp.forEach(item => {
                    if (!mergedArray.some(mer => mer.id === item.id)) {
                        mergedArray.push(item);
                    }
                });
            }
            
            setApiData(mergedArray);
            setData(mergedArray);

            if (rst.length > 0) {
                setActiveKey([rst[0].id]);
            }
        });
    };

    const onFieldChange = (apiId: number, paramType: ('input' | 'output'), field: Field, paramName?: string, schemaValue?: any) => {
        for (let i = 0; i < apiData.length; i++) {
            if (apiData[i].id !== apiId) {
                continue
            }
            if (paramType === 'input') {
                for (let j = 0; j < apiData[i].inputFieldList.length; j++) {
                    if (apiData[i].inputFieldList[j].id === field.id) {
                        apiData[i].inputFieldList[j] = field;
                        break
                    }
                }
            }
            if (paramType === 'output') {
                for (let j = 0; j < apiData[i].outputFieldList.length; j++) {
                    if (apiData[i].outputFieldList[j].id === field.id) {
                        apiData[i].outputFieldList[j] = field;
                        break
                    }
                }
            }
            break
        }
        apiData.forEach(api => {
            if (paramName === 'schemaName' && api.schemaType === 'argument' && paramType === 'output') {
                const findData = apiData.find(item => item.schemaType === 'update');
                if (findData) {
                    findData.outputFieldList.forEach(item => {
                        if (item.schemaName === schemaValue.oldValue) {
                            item.schemaName = schemaValue.newValue;
                        }
                    })
                }
            }
        })
        setApiData(apiData)
        setData(apiData)
    }

    const onStatusCodeChange = (apiId: number, value: string) => {
        let findData = apiData.find(item => item.id === apiId);
        if (findData) {
            findData.statusCode = value;
        }
        setApiData(apiData);
        setData(apiData);
    }

    const onResourceIdChange = (apiId: number, value: string) => {
        let findData = apiData.find(item => item.id === apiId);
        if (findData) {
            findData.resourceId = value;
        }
        setApiData(apiData);
        setData(apiData);
    }

    const onChooseIgnore = (apiId: number, paramType: ('input' | 'output')) => {
        let findData = apiData.find(item => item.id === apiId);
        if (findData) {
            if (paramType === 'input') {
                findData.inputFieldList.forEach(t => {
                    t.ignore = true;
                })
            } else {
                findData.outputFieldList.forEach(t => {
                    t.ignore = true;
                })
            }
        }
        setApiData([...apiData]);
        setData([...apiData]);
    }

    const onCancelIgnore = (apiId: number, paramType: ('input' | 'output')) => {
        let findData = apiData.find(item => item.id === apiId);
        if (findData) {
            if (paramType === 'input') {
                findData.inputFieldList.forEach(t => {
                    t.ignore = false;
                })
            } else {
                findData.outputFieldList.forEach(t => {
                    t.ignore = false;
                })
            }
        }
        setApiData([...apiData]);
        setData([...apiData]);
    }

    const deleteApiData = (apiId: number, event: { stopPropagation: () => void; }) => {
        event.stopPropagation();
        if (!apiId) {
            return;
        }

        const filterData = apiData.filter(item => item.id !== apiId);
        setApiData([...filterData]);
        setData([...filterData]);
    }

    return <>
        <div className={'choose-box'}>
            <Space size={15}>
                <ChooseApiDialog
                    handle={(option: 'ok' | 'cancel', rows: Api.Detail[], apiId: number[]) => {
                        if (option === 'ok') {
                            onAdd(apiId, rows);
                        }
                    }}>
                </ChooseApiDialog>
            </Space>
        </div>
        {apiData.length ?
            <div className={'mt20'}>
                <Collapse activeKey={activeKey} onChange={(key: string[]) => setActiveKey(key)}>
                    {
                        apiData.map(api => {
                            const titleInfo = <ApiInfo
                                api={api}
                                onSchemaTypeChange={v => {
                                    api.schemaType = v;
                                    if (v !== 'argument') {
                                        api.resourceId = '';
                                    }
                                    setData(apiData)
                                }}
                                deleteApiData={(e) => deleteApiData(api.id, e)}
                            />;

                            return <Panel header={titleInfo} key={api.id}>
                                <ApiFieldView
                                    apiData={api}
                                    baseInfo={baseInfo}
                                    apiAllData={apiData}
                                    onFieldChange={(paramType, field, paramName, schemaValue) => onFieldChange(api.id, paramType, field, paramName, schemaValue)}
                                    onStatusCodeChange={(value) => onStatusCodeChange(api.id, value)}
                                    onResourceIdChange={(value) => onResourceIdChange(api.id, value)}
                                    onChooseIgnore={(paramType) => onChooseIgnore(api.id, paramType)}
                                    onCancelIgnore={(paramType) => onCancelIgnore(api.id, paramType)}
                                />
                            </Panel>
                        })
                    }
                </Collapse>
            </div> :
            <div className={'no-data'}>暂未选择API</div>
        }
    </>;
}

export default ApiConfig;
