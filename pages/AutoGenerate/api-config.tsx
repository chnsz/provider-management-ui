import {Checkbox, Col, Collapse, Input, Row, Select, Space, Table, Tag} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import React, {useEffect, useState} from 'react';
import {EditOutlined} from "@ant-design/icons";
import {getApiFieldList} from "@/services/api/api";
import ChooseApiDialog from "./components/choose-api-dialog";
import CustomBreadcrumb from "@/components/Breadcrumb";
import './api-config.less';
import ApiCategory from "@/pages/AutoGenerate/components/api-category";

const {Panel} = Collapse;

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
}

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


const ApiFieldView: React.FC<{
    apiData: ApiDetail;
    onFieldChange: (paramType: 'input' | 'output', field: Field) => any
}> = ({apiData, onFieldChange}) => {
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
            title: <>类型<EditOutlined style={{color: '#6d6d6d'}}/></>,
            dataIndex: 'fieldType',
            align: 'center',
            ellipsis: true,
            width: 150,
            className: 'api-col',
            render: (v: any, row) => {
                return <Select
                    defaultValue={v}
                    style={{width: '100%'}}
                    bordered={false}
                    onChange={v => {row.fieldType = v;
                    onFieldChange(row.paramType, row)}}
                    options={FieldTypeOption}
                />
            }
        }, {
            title: <>名称<EditOutlined style={{color: '#6d6d6d'}}/></>,
            dataIndex: 'fieldName',
            ellipsis: true,
            width: 350,
            className: 'api-col',
            render: (v: any, row) => {
                let required = <>&nbsp;</>;
                if (row.fieldRequired === 'yes' && row.fieldIn !== 'body') {
                    required = <span style={{color: '#ff4d4f', fontWeight: 'bold'}}>*</span>
                }
                return <>
                    {required}
                    <Input defaultValue={v}
                        style={{width: '95%', marginLeft: '0', paddingLeft: '4px'}}
                        onChange={e => {row.fieldName = e.target.value;
                        onFieldChange(row.paramType, row)}}/></>
            },
        }, {
            title: <>描述<EditOutlined style={{color: '#6d6d6d'}}/></>,
            dataIndex: 'fieldDesc',
            ellipsis: true,
            className: 'api-col',
            render: (v, row) => {
                return <Input defaultValue={v} onChange={e => {
                    row.fieldDesc = e.target.value;
                    onFieldChange(row.paramType, row)
                }}/>
            },
        }]
    }, {
        title: 'Schema 字段',
        children: [{
            title: <>是否忽略<EditOutlined style={{color: '#6d6d6d'}}/></>,
            dataIndex: 'ignore',
            align: 'center',
            width: 90,
            render: (v, row) => {
               return <Checkbox defaultChecked={v} onChange={e => {
                    row.ignore = e.target.checked;
                    onFieldChange(row.paramType, row)
                }}/>
            }
        }, {
            title: <>名称<EditOutlined style={{color: '#6d6d6d'}}/></>,
            dataIndex: 'schemaName',
            ellipsis: true,
            width: 200,
            render: (v, row) => {
                return <Input defaultValue={v}
                    onChange={e => {row.schemaName = e.target.value;
                    onFieldChange(row.paramType, row)}}/>
            },
        }, {
            title: <>类型<EditOutlined style={{color: '#6d6d6d'}}/></>,
            dataIndex: 'schemaType',
            align: 'center',
            ellipsis: true,
            width: 150,
            render: (v: any, row) => {
                return <Select
                    defaultValue={v}
                    style={{width: '100%'}}
                    bordered={false}
                    onChange={v => {row.schemaType = v;
                    onFieldChange(row.paramType, row)}}
                    options={FieldTypeOption}
                />
            }
        }, {
            title: <>必填<EditOutlined style={{color: '#6d6d6d'}}/></>,
            dataIndex: 'schemaRequired',
            align: 'center',
            width: 80,
            render: (v, row) => {
                return <Checkbox defaultChecked={v} onChange={e => {
                    row.schemaRequired = e.target.checked;
                    onFieldChange(row.paramType, row)
                }}/>
            }
        }, {
            title: <>描述<EditOutlined style={{color: '#6d6d6d'}}/></>,
            dataIndex: 'schemaDesc',
            ellipsis: true,
            render: (v, row) => {
                return <Input defaultValue={v} onChange={e => {
                    row.schemaName = e.target.value;
                    onFieldChange(row.paramType, row)
                }}/>
            },
        }]
    }];

    const outputColumns:ColumnsType<Field> = columns.slice().map((column: any) => {
        if (column.children) {
            return {
                ...column,
                children: column.children.filter((child: any) => child.dataIndex !== 'ignore')
            };
        }
        return column;
    });

    return <div style={{margin: '0 6px'}}>
        <Space className='api-config' direction={'vertical'}>
            <div style={{fontWeight: 'bold', fontSize: '16px', marginBottom: '10px'}}>请求参数</div>
            <Table
                columns={columns}
                dataSource={apiData.inputFieldList}
                size={'middle'}
                pagination={false}
                rowKey={r => r.id}
            />
            <div style={{height: '15px'}}></div>
            <div style={{fontWeight: 'bold', fontSize: '16px', marginBottom: '10px'}}>响应参数</div>
            <Table
                columns={outputColumns}
                dataSource={apiData.outputFieldList}
                size={'middle'}
                pagination={false}
                rowKey={r => r.id}
            />
        </Space>
    </div>;
}

const ApiInfo: React.FC<{ api: ApiDetail, onSchemaTypeChange: (v: string) => any, onFunChange: (v: any) => any }> = ({api, onSchemaTypeChange, onFunChange}) => {
    return <Row>
        <Col span={12}>
            <Select
                onClick={(e) => e.stopPropagation()}
                showArrow
                style={{width: '140px', marginRight: '10px'}}
                placeholder={'请选择操作'}
                onChange={onSchemaTypeChange}
            >
                <Option value="argument">CreateContext</Option>
                <Option value="attribute">ReadContext</Option>
                <Option value="update">UpdateContext</Option>
                <Option value="delete">DeleteContext</Option>
            </Select>
            #{api.id} 【{api.productName}】&nbsp;&nbsp;{api.apiName} / {api.apiNameEn}
        </Col>
        <Col span={12} style={{textAlign: 'right', marginTop: '4px'}}>
            [{api.method}]&nbsp;&nbsp;{api.uri}
        </Col>
    </Row>;
}

const ApiConfig: React.FC<{ setData: (data: ApiDetail[]) => any }> = ({setData}) => {
    const [apiData, setApiData] = useState<ApiDetail[]>([]);
    const [activeKey, setActiveKey] = useState<string[]>([]);

    const onAdd = (apiId: number[], rows: Api.Detail[]) => {
        getApiFieldList(apiId).then(rst => {
            const tmp = rst.map(t => {
                const api: ApiDetail = {...t};

                api.inputFieldList?.map(t => {
                    t.schemaName = t.fieldName;
                    t.schemaType = t.fieldType;
                    t.schemaRequired = t.fieldRequired === 'yes';
                    t.schemaDesc = t.fieldDesc;
                    t.ignore = false;
                    return t;
                });

                api.outputFieldList?.forEach(t => {
                    t.schemaName = t.fieldName;
                    t.schemaType = t.fieldType;
                    t.schemaRequired = t.fieldRequired === 'yes';
                    t.schemaDesc = t.fieldDesc;
                });
                return api;
            });
            setApiData(tmp);
            setData(tmp);

            if (rst.length > 0) {
                setActiveKey([rst[0].id]);
            }
        });
    };

    const onFieldChange = (apiId: number, paramType: ('input' | 'output'), field: Field) => {
        for (let i = 0; i < apiData.length; i++) {
            if (apiData[i].id !== apiId) {
                continue
            }
            if (paramType === 'input') {
                for (let j = 0; j < apiData[i].inputFieldList.length; j++) {
                    if (apiData[i].inputFieldList[j].id === field.id) {
                        apiData[i].inputFieldList[j] = field
                        break
                    }
                }
            }
            if (paramType === 'output') {
                for (let j = 0; j < apiData[i].outputFieldList.length; j++) {
                    if (apiData[i].outputFieldList[j].id === field.id) {
                        apiData[i].outputFieldList[j] = field
                        break
                    }
                }
            }
            break
        }
        setApiData(apiData)
        setData(apiData)
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
                                    setData(apiData)
                                }}
                            />;

                            return <Panel header={titleInfo} key={api.id}>
                                 <ApiFieldView
                                    apiData={api}
                                    onFieldChange={(paramType, field) => onFieldChange(api.id, paramType, field)}
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
