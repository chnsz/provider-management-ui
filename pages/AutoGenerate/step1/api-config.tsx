import { Button, Checkbox, Col, Collapse, Input, Row, Select, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { EditOutlined } from "@ant-design/icons";
import '../api-config.less';
import ChooseApiDialog from '../components/choose-api-dialog';
import { getApiFieldList } from '@/services/auto-generate/api';
import { valueType } from 'antd/lib/statistic/utils';

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
    jmespath: string;
    isJmespath: boolean;
    rosourceOption: {
        label: string,
        value: string,
    }[];
    isPage?: boolean;
    dataPath?: string | null;
    pageMethod?: string | null;
    pageOption?: {
        label: string,
        value: string
    }[];
    markerKey?: string | null;
    markerOption?: {
        label: string,
        value: string
    }[];
    nextExp?: string | null;
    linkExp?: string | null;
    offsetKey?: string | null;
    offsetOption?: {
        label: string,
        value: string
    }[];
    limitKey?: string | null;
    limitOption?: {
        label: string,
        value: string
    }[];
    defaultLimit?: string | null;
    pageNumKey?: string | null;
    pageNumOption?: {
        label: string,
        value: string
    }[];
    pageSizeKey?: string | null;
    pageSizeOption?: {
        label: string,
        value: string
    }[];
    defaultSize?: string | null;
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

export const FieldTypeOption = [
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
    onJmespathChange: (value: string) => any;
    onJmespathChecked: (value: boolean) => any;
    onDataPathChange: (value: string) => any;
    onResourceIdChange: (value: string) => any;
    onPageChecked: (value: boolean) => any;
    onPageIdChange: (value: string) => any;
    onMarkerKeyChange: (value: string) => any;
    onNextExpChange: (value: string) => any;
    onLinkExpChange: (value: string) => any,
    onOffsetKeyChange: (value: string) => any;
    onLimitKeyChange: (value: string) => any;
    onDefaultLimitChange: (value: string) => any;
    onPageNumKeyChange: (value: string) => any;
    onPageSizeKeyChange: (value: string) => any;
    onDefaultSizeChange: (value: string) => any;
    onChooseIgnore: (paramsType: 'input' | 'output') => any;
    onCancelIgnore: (paramsType: 'input' | 'output') => any;
}> = ({
    apiData,
    baseInfo,
    apiAllData,
    onFieldChange,
    onStatusCodeChange,
    onJmespathChange,
    onJmespathChecked,
    onDataPathChange,
    onResourceIdChange,
    onPageChecked,
    onPageIdChange,
    onMarkerKeyChange,
    onNextExpChange,
    onLinkExpChange,
    onOffsetKeyChange,
    onLimitKeyChange,
    onDefaultLimitChange,
    onPageNumKeyChange,
    onPageSizeKeyChange,
    onDefaultSizeChange,
    onChooseIgnore,
    onCancelIgnore
}) => {
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
                        (apiData.schemaType === 'argument' || baseInfo?.providerType === 'DataSource') ?
                            <span style={{ marginRight: '20px' }}>
                                资源ID &nbsp;&nbsp;&nbsp;
                                {
                                    apiData.isJmespath &&
                                    <Input defaultValue={apiData.jmespath}
                                        onChange={(e) => {
                                            apiData.jmespath = e.target.value;
                                            onJmespathChange(e.target.value)
                                        }}
                                        placeholder="jmespath" style={{ width: '180px' }} />
                                }

                                {
                                    !apiData.isJmespath &&
                                    <Select placeholder="请选择资源ID"
                                        showSearch
                                        allowClear
                                        style={{ width: '180px' }}
                                        value={apiData.resourceId}
                                        options={apiData.rosourceOption}
                                        onChange={(e) => {
                                            apiData.resourceId = e;
                                            onResourceIdChange(e)
                                        }} />
                                }
                                <span style={{ marginLeft: '5px' }}>
                                    <Checkbox defaultChecked={apiData.isJmespath} checked={apiData.isJmespath} onChange={e => {
                                        apiData.isJmespath = e.target.checked;
                                        onJmespathChecked(e.target.checked)
                                    }}>jmespath</Checkbox>
                                </span>


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
                    {
                        apiData.schemaType === 'attribute' ?
                            <span style={{ marginLeft: '20px', lineHeight: '34px' }}>
                                <Checkbox defaultChecked={apiData.isPage} checked={apiData.isPage} onChange={e => {
                                    apiData.isPage = e.target.checked;
                                    onPageChecked(e.target.checked)
                                }}>分页查询</Checkbox>
                            </span> :
                            <span></span>
                    }

                    {
                        apiData.schemaType === 'attribute' && apiData.isPage ?
                            <div>
                                <span style={{ marginLeft: '20px' }}>
                                    <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>* </span>
                                    分页方式 &nbsp;&nbsp;&nbsp;
                                    <Select placeholder="请选择分页方式"
                                        showSearch
                                        allowClear
                                        style={{ width: '180px' }}
                                        value={apiData.pageMethod}
                                        options={apiData.pageOption}
                                        onChange={(e) => {
                                            apiData.pageMethod = e;
                                            onPageIdChange(e)
                                        }} />
                                </span>
                                <span style={{ marginLeft: '20px' }}>
                                    <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>* </span>
                                    DataPath &nbsp;&nbsp;&nbsp;
                                    <Input defaultValue={apiData.dataPath}
                                        onChange={(e) => {
                                            apiData.dataPath = e.target.value;
                                            onDataPathChange(e.target.value)
                                        }}
                                        placeholder="请输入DataPath" style={{ width: '145px' }} />
                                </span>

                                {
                                    apiData.pageMethod === 'marker' &&
                                    <span>
                                        <span style={{ marginLeft: '20px' }}>
                                            <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>* </span>
                                            MarkerKey &nbsp;&nbsp;&nbsp;
                                            <Select placeholder="请选择MarkerKey"
                                                showSearch
                                                allowClear
                                                style={{ width: '180px' }}
                                                value={apiData.markerKey}
                                                options={apiData.markerOption}
                                                onChange={(e) => {
                                                    apiData.markerKey = e;
                                                    onMarkerKeyChange(e)
                                                }} />
                                        </span>
                                        <span style={{ marginLeft: '20px' }}>
                                            <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>* </span>
                                            NextExp &nbsp;&nbsp;&nbsp;
                                            <Input defaultValue={apiData.nextExp}
                                                onChange={(e) => {
                                                    apiData.nextExp = e.target.value;
                                                    onNextExpChange(e.target.value)
                                                }}
                                                placeholder="请输入NextExp" style={{ width: '145px' }} />
                                        </span>
                                    </span>
                                }

                                {
                                    apiData.pageMethod === 'link' &&
                                    <span style={{ marginLeft: '20px' }}>
                                        <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>* </span>
                                        LinkExp &nbsp;&nbsp;&nbsp;
                                        <Input defaultValue={apiData.linkExp}
                                            onChange={(e) => {
                                                apiData.linkExp = e.target.value;
                                                onLinkExpChange(e.target.value)
                                            }}
                                            placeholder="请输入LinkExp" style={{ width: '145px' }} />
                                    </span>
                                }

                                {
                                    apiData.pageMethod === 'offset' &&
                                    <span>
                                        <span style={{ marginLeft: '20px' }}>
                                            <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>* </span>
                                            OffsetKey &nbsp;&nbsp;&nbsp;
                                            <Select placeholder="请选择OffsetKey"
                                                showSearch
                                                allowClear
                                                style={{ width: '180px' }}
                                                value={apiData.offsetKey}
                                                options={apiData.offsetOption}
                                                onChange={(e) => {
                                                    apiData.offsetKey = e;
                                                    onOffsetKeyChange(e)
                                                }} />
                                        </span>
                                        <span style={{ marginLeft: '20px' }}>
                                            <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>* </span>
                                            LimitKey &nbsp;&nbsp;&nbsp;
                                            <Select placeholder="请选择LimitKey"
                                                showSearch
                                                allowClear
                                                style={{ width: '180px' }}
                                                value={apiData.limitKey}
                                                options={apiData.limitOption}
                                                onChange={(e) => {
                                                    apiData.limitKey = e;
                                                    onLimitKeyChange(e)
                                                }} />
                                        </span>
                                        <span style={{ marginLeft: '20px' }}>
                                            DefaultLimit &nbsp;&nbsp;&nbsp;
                                            <Input defaultValue={apiData.defaultLimit}
                                                onChange={(e) => {
                                                    apiData.defaultLimit = e.target.value;
                                                    onDefaultLimitChange(e.target.value)
                                                }}
                                                placeholder="请输入DefaultLimit" style={{ width: '145px' }} />
                                        </span>
                                    </span>
                                }

                                {
                                    apiData.pageMethod === 'pageSize' &&
                                    <span>
                                        <span style={{ marginLeft: '20px' }}>
                                            <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>* </span>
                                            PageNumKey &nbsp;&nbsp;&nbsp;
                                            <Select placeholder="请选择PageNumKey"
                                                showSearch
                                                allowClear
                                                style={{ width: '180px' }}
                                                value={apiData.pageNumKey}
                                                options={apiData.pageNumOption}
                                                onChange={(e) => {
                                                    apiData.pageNumKey = e;
                                                    onPageNumKeyChange(e)
                                                }} />
                                        </span>
                                        <span style={{ marginLeft: '20px' }}>
                                            <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>* </span>
                                            PageSizeKey &nbsp;&nbsp;&nbsp;
                                            <Select placeholder="请选择PageSizeKey"
                                                showSearch
                                                allowClear
                                                style={{ width: '180px' }}
                                                value={apiData.pageSizeKey}
                                                options={apiData.pageSizeOption}
                                                onChange={(e) => {
                                                    apiData.pageSizeKey = e;
                                                    onPageSizeKeyChange(e)
                                                }} />
                                        </span>
                                        <span style={{ marginLeft: '20px' }}>
                                            DefaultSize &nbsp;&nbsp;&nbsp;
                                            <Input defaultValue={apiData.defaultSize}
                                                onChange={(e) => {
                                                    apiData.defaultSize = e.target.value;
                                                    onDefaultSizeChange(e.target.value)
                                                }}
                                                placeholder="请输入DefaultSize" style={{ width: '145px' }} />
                                        </span>
                                    </span>
                                }
                            </div> :
                            <span></span>

                    }

                </div>
                <div style={{ marginTop: '10px' }}>
                    <Button type="primary" size='small' onClick={() => onChooseIgnore('input')}>全部忽略</Button>
                    <Button type="primary" size='small' onClick={() => onCancelIgnore('input')}
                        style={{ marginLeft: '20px' }}>取消全部忽略</Button>
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
                            <Button type="primary" size='small' onClick={() => onCancelIgnore('output')}
                                style={{ marginLeft: '20px' }}>取消全部忽略</Button>
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

const ApiInfo: React.FC<{ api: ApiDetail, onSchemaTypeChange: (v: string) => any, deleteApiData: () => any }> = ({
    api,
    onSchemaTypeChange,
    deleteApiData
}) => {
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

const ApiConfig: React.FC<{
    setData: (data: ApiDetail[]) => any,
    baseInfo: any,
    dataId: number | null,
    apiDataPar: ApiDetail[]
}> = ({ setData, baseInfo, dataId, apiDataPar }) => {
    let [apiData, setApiData] = useState<ApiDetail[]>([]);
    const [activeKey, setActiveKey] = useState<string[]>([]);
    apiData = apiDataPar;

    useEffect(() => {
        if (baseInfo?.providerType === 'DataSource' && apiData.length) {
            apiData.forEach(api => {
                api.schemaType = 'attribute';
            })
            setApiData(apiData);
            setData(apiData);
        }
    }, [baseInfo?.providerType])
    
    const pageOption = [
        {
            label: 'marker',
            value: 'marker'
        },
        {
            label: 'link',
            value: 'link'
        },
        {
            label: 'offset',
            value: 'offset'
        },
        {
            label: 'pageSize',
            value: 'pageSize'
        }
    ];

    const onAdd = (apiId: number[], rows: Api.Detail[]) => {
        getApiFieldList(apiId).then(rst => {
            const tmp = rst.map(t => {
                let api: ApiDetail = { ...t };
                const findApiData = apiData.find(item => item.id === api.id);
                if (findApiData) {
                    api.schemaType = findApiData.schemaType;
                }

                if (baseInfo?.providerType === 'DataSource') {
                    api.schemaType = 'attribute';
                }
                api.statusCode = '';
                api.jmespath = '';
                api.isJmespath = false;
                api.resourceId = '';
                api.rosourceOption = [];
                api.dataPath = null;
                api.nextExp = null;
                api.linkExp = null;
                api.defaultLimit = null;
                api.defaultSize = null;
                api.pageMethod = null;
                api.isPage = false;
                api.pageOption = [];
                api.markerKey = null;
                api.offsetKey = null;
                api.limitKey = null;
                api.pageNumKey = null;
                api.pageSizeKey = null;
                api.markerOption = [];
                api.offsetOption = [];
                api.pageNumOption = [];
                api.limitOption = [];
                api.pageSizeOption = [];

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

    const onJmespathChange = (apiId: number, value: string) => {
        let findData = apiData.find(item => item.id === apiId);
        if (findData) {
            findData.jmespath = value;
        }
        setApiData(apiData);
        setData(apiData);
    }

    const onDataPathChange = (apiId: number, value: string) => {
        let findData = apiData.find(item => item.id === apiId);
        if (findData) {
            findData.dataPath = value;
        }
        setApiData(apiData);
        setData(apiData);
    }

    const onNextExpChange = (apiId: number, value: string) => {
        let findData = apiData.find(item => item.id === apiId);
        if (findData) {
            findData.nextExp = value;
        }
        setApiData(apiData);
        setData(apiData);
    }

    const onLinkExpChange = (apiId: number, value: string) => {
        let findData = apiData.find(item => item.id === apiId);
        if (findData) {
            findData.linkExp = value;
        }
        setApiData(apiData);
        setData(apiData);
    }

    const onDefaultLimitChange = (apiId: number, value: string) => {
        let findData = apiData.find(item => item.id === apiId);
        if (findData) {
            findData.defaultLimit = value;
        }
        setApiData(apiData);
        setData(apiData);
    }

    const onDefaultSizeChange = (apiId: number, value: string) => {
        let findData = apiData.find(item => item.id === apiId);
        if (findData) {
            findData.defaultSize = value;
        }
        setApiData(apiData);
        setData(apiData);
    }

    const onResourceIdChange = (apiId: number, value: string) => {
        let findData = apiData.find(item => item.id === apiId);
        if (findData) {
            findData.resourceId = value;
            findData.jmespath = '';
        }
        setApiData(apiData);
        setData(apiData);
    }

    const onPageIdChange = (apiId: number, value: string) => {
        let findData = apiData.find(item => item.id === apiId);
        if (findData) {
            findData.pageMethod = value;
            if (value === 'marker') {
                setLinkEmpty(findData);
                setOffsetEmpty(findData);
                setPageSizeEmpty(findData);
            } else if (value === 'link') {
                setMarkerEmpty(findData)
                setOffsetEmpty(findData);
                setPageSizeEmpty(findData);
            } else if (value === 'offset') {
                setMarkerEmpty(findData)
                setLinkEmpty(findData);
                setPageSizeEmpty(findData);
            } else if (value === 'pageSize') {
                setMarkerEmpty(findData)
                setLinkEmpty(findData);
                setOffsetEmpty(findData);
            }
        }

        setApiData(apiData);
        setData(apiData);
    }

    const setMarkerEmpty = (api: any) => {
        api.markerKey = null;
        api.nextExp = null;
    }

    const setLinkEmpty = (api: any) => {
        api.linkExp = null;
    }

    const setOffsetEmpty = (api: any) => {
        api.offsetKey = null;
        api.limitKey = null;
        api.defaultLimit = null;
    }

    const setPageSizeEmpty = (api: any) => {
        api.pageNumKey = null;
        api.pageSizeKey = null;
        api.defaultSize = null;
    }

    const onMarkerKeyChange = (apiId: number, value: string) => {
        let findData = apiData.find(item => item.id === apiId);
        if (findData) {
            findData.markerKey = value;
        }

        setApiData(apiData);
        setData(apiData);
    }

    const onPageChecked = (apiId: number, value: boolean) => {
        let findData = apiData.find(item => item.id === apiId);
        if (findData) {
            findData.isPage = value;
        }

        setApiData(apiData);
        setData(apiData);
    }

    const onJmespathChecked = (apiId: number, value: boolean) => {
        let findData = apiData.find(item => item.id === apiId);
        if (findData) {
            findData.isJmespath = value;
            findData.resourceId = '';
        }

        setApiData(apiData);
        setData(apiData);
    }

    const onOffsetKeyChange = (apiId: number, value: string) => {
        let findData = apiData.find(item => item.id === apiId);
        if (findData) {
            findData.offsetKey = value;
        }

        setApiData(apiData);
        setData(apiData);
    }

    const onPageNumKeyChange = (apiId: number, value: string) => {
        let findData = apiData.find(item => item.id === apiId);
        if (findData) {
            findData.pageNumKey = value;
        }

        setApiData(apiData);
        setData(apiData);
    }

    const onPageSizeKeyChange = (apiId: number, value: string) => {
        let findData = apiData.find(item => item.id === apiId);
        if (findData) {
            findData.pageSizeKey = value;
        }

        setApiData(apiData);
        setData(apiData);
    }

    const onLimitKeyChange = (apiId: number, value: string) => {
        let findData = apiData.find(item => item.id === apiId);
        if (findData) {
            findData.limitKey = value;
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
                                    api.pageOption = [];
                                    api.markerOption = [];
                                    api.offsetOption = [];
                                    api.pageNumOption = [];
                                    api.limitOption = [];
                                    api.pageSizeOption = [];
                                    if (v !== 'argument') {
                                        api.resourceId = '';
                                    }

                                    if (v === 'attribute') {
                                        api.outputFieldList?.forEach((item) => {
                                            item.ignore = false;
                                        })
                                        api.pageOption = pageOption;
                                        const queryMarker = api.inputFieldList.filter(item => item.fieldIn === 'query');
                                        queryMarker?.forEach(item => {
                                            api.markerOption?.push({
                                                label: item.fieldName,
                                                value: item.fieldName
                                            });

                                            api.offsetOption?.push({
                                                label: item.fieldName,
                                                value: item.fieldName
                                            });

                                            api.limitOption?.push({
                                                label: item.fieldName,
                                                value: item.fieldName
                                            });

                                            api.pageNumOption?.push({
                                                label: item.fieldName,
                                                value: item.fieldName
                                            });

                                            api.pageSizeOption?.push({
                                                label: item.fieldName,
                                                value: item.fieldName
                                            });
                                        })
                                    } else {
                                        api.nextExp = null;
                                        api.linkExp = null;
                                        api.defaultLimit = null;
                                        api.defaultSize = null;
                                        api.isPage = false;
                                        api.pageMethod = null;
                                        api.markerKey = null;
                                        api.offsetKey = null;
                                        api.limitKey = null;
                                        api.pageNumKey = null;
                                        api.pageSizeKey = null;
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
                                    onJmespathChange={(value => onJmespathChange(api.id, value))}
                                    onJmespathChecked={(value => onJmespathChecked(api.id, value))}
                                    onDataPathChange={(value) => onDataPathChange(api.id, value)}
                                    onResourceIdChange={(value) => onResourceIdChange(api.id, value)}
                                    onPageChecked={(value) => onPageChecked(api.id, value)}
                                    onPageIdChange={(value) => onPageIdChange(api.id, value)}
                                    onMarkerKeyChange={(value) => onMarkerKeyChange(api.id, value)}
                                    onNextExpChange={(value) => onNextExpChange(api.id, value)}
                                    onLinkExpChange={(value) => onLinkExpChange(api.id, value)}
                                    onDefaultLimitChange={(value) => onDefaultLimitChange(api.id, value)}
                                    onDefaultSizeChange={(value) => onDefaultSizeChange(api.id, value)}
                                    onOffsetKeyChange={(value) => onOffsetKeyChange(api.id, value)}
                                    onLimitKeyChange={(value) => onLimitKeyChange(api.id, value)}
                                    onPageNumKeyChange={(value) => onPageNumKeyChange(api.id, value)}
                                    onPageSizeKeyChange={(value) => onPageSizeKeyChange(api.id, value)}
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
