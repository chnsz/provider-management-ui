import {Checkbox, Col, Collapse, Input, Row, Select, Space, Table} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import React, {useEffect, useState} from 'react';
import {EditOutlined} from "@ant-design/icons";
import {getApiFieldList} from "@/services/api/api";
import './api-config.less';

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

    ignore: boolean;
    schemaName: string;
    schemaType: string;
    schemaRequired: string;
    schemaDesc: string;
}


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
            title: <>类型</>,
            dataIndex: 'fieldType',
            align: 'center',
            ellipsis: true,
            width: 150,
            className: 'api-col',
        }, {
            title: <>名称</>,
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
                    {v}
                </>
            },
        }, {
            title: <>描述</>,
            dataIndex: 'fieldDesc',
            ellipsis: true,
            className: 'api-col',
        }]
    }, {
        title: 'Schema 字段',
        children: [{
            title: <>是否忽略</>,
            dataIndex: 'age',
            align: 'center',
            width: 90,
            render: () => <Checkbox/>,
        }, {
            title: <>名称<EditOutlined style={{color: '#6d6d6d'}}/></>,
            dataIndex: 'schemaName',
            ellipsis: true,
            width: 200,
            render: (v, row) => {
                return <Input defaultValue={v} onChange={e => {
                    row.schemaName = e.target.value;
                    onFieldChange(row.paramType, row)
                }}/>
            },
        }, {
            title: <>类型<EditOutlined style={{color: '#6d6d6d'}}/></>,
            dataIndex: 'schemaType',
            align: 'center',
            ellipsis: true,
            width: 150,
        }, {
            title: <>必填<EditOutlined style={{color: '#6d6d6d'}}/></>,
            dataIndex: 'schemaRequired',
            align: 'center',
            render: () => <Checkbox/>,
            width: 80,
        }, {
            title: <>描述<EditOutlined style={{color: '#6d6d6d'}}/></>,
            dataIndex: 'schemaDesc',
            ellipsis: true,
        }]
    }];

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
                columns={columns}
                dataSource={apiData.outputFieldList}
                size={'middle'}
                pagination={false}
                rowKey={r => r.id}
            />
        </Space>
    </div>;
}

const ApiInfo: React.FC<{ api: ApiDetail, onSchemaTypeChange: (v: string) => any }> = ({api, onSchemaTypeChange}) => {
    return <Row>
        <Col span={12}>
            <Select
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

const ApiConfig: React.FC<{ apiId: number[], setData: (data: ApiDetail[]) => any }> = ({apiId, setData}) => {
    const [apiData, setApiData] = useState<ApiDetail[]>([]);
    const [activeKey, setActiveKey] = useState<string[]>([]);

    useEffect(() => {
        getApiFieldList(apiId).then(rst => {
            const tmp = rst.map(t => {
                const api: ApiDetail = {...t};

                api.inputFieldList?.map(t => {
                    t.schemaName = t.fieldName;
                    t.schemaType = t.fieldType;
                    t.schemaRequired = t.fieldRequired;
                    t.schemaDesc = t.fieldDesc;
                    return t;
                });

                api.outputFieldList?.forEach(t => {
                    t.schemaName = t.fieldName;
                    t.schemaType = t.fieldType;
                    t.schemaRequired = t.fieldRequired;
                    t.schemaDesc = t.fieldDesc;
                });
                return api;
            });
            setApiData(tmp);

            if (rst.length > 0) {
                setActiveKey([rst[0].id]);
            }
        });
    }, [apiId]);

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
    </>;
}

export default ApiConfig;
