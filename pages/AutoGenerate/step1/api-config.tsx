import {Button, Checkbox, Col, Collapse, Input, Row, Select, Space, Table, Tooltip} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import React, {useEffect, useRef, useState} from 'react';
import {EditOutlined, MenuOutlined} from "@ant-design/icons";
import '../api-config.less';
import ChooseApiDialog from '../components/choose-api-dialog';
import {getApiFieldList} from '@/services/auto-generate/api';
import type {SortableContainerProps, SortEnd} from 'react-sortable-hoc';
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
import {arrayMoveImmutable} from '@ant-design/pro-components';
import CustomSchemaDialog from '../components/custom-schema-dialog';
import {camelToSnake} from "@/utils/common";
import {SchemaEditDialog} from "@/pages/AutoGenerate/components/schema-edit-dialog";
import { allFunData } from './fun-arrange';

const {Panel} = Collapse;
const {TextArea} = Input;

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
    serviceAlias: string;
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
    defaultLimit?: number | null;
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
    defaultSize?: number | null;
    dataNode: string | null;
    dataNodeOption: {
        label: string,
        value: string,
    }[],
    customSchemaData: {
        name: string,
        schemaName: string,
        operator: string
    }[],
    customSchemaName: string | null,
    schemaName: string | null,
    customSchemaNameOption: {
        label: string,
        value: string
    }[],
    customSchemaOperator: string | null,
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
    keepZero?: boolean;
    schemaTypeOption?: any;
    selectSchemaName?: string;
    index?: number;
    getterCode?: string;
    setterCode?: string;
}

export const FieldTypeOption = [
    {value: 'string', label: 'schema.TypeString'},
    {value: 'integer', label: 'schema.TypeInt'},
    {value: 'float', label: 'schema.TypeFloat'},
    {value: 'boolean', label: 'schema.TypeBool'},
    {value: 'number', label: 'schema.TypeFloat'},
    {value: 'array', label: 'schema.TypeSet'},
    {value: 'array_list', label: 'schema.TypeList'},
    {value: 'object', label: 'schema.TypeList'},
    {value: 'map[string]object', label: 'schema.TypeList'},
    {value: 'map[string]string', label: 'schema.TypeMap'},
];

const SchemaTypeOption = [
    {value: 'schema.TypeString', label: 'schema.TypeString'},
    {value: 'schema.TypeInt', label: 'schema.TypeInt'},
    {value: 'schema.TypeFloat', label: 'schema.TypeFloat'},
    {value: 'schema.TypeBool', label: 'schema.TypeBool'},
    {value: 'schema.TypeSet', label: 'schema.TypeSet'},
    {value: 'schema.TypeList', label: 'schema.TypeList'},
    {value: 'map[string]string', label: 'schema.TypeMap'},
];

const ApiFieldView: React.FC<{
    apiData: ApiDetail;
    baseInfo: any;
    apiAllData: ApiDetail[];
    onApiChange: (data: ApiDetail[]) => any,
    onFieldChange: (paramType: 'input' | 'output', field: Field, paramName?: string, schemaValue?: any) => any;
}> = ({
          apiData,
          baseInfo,
          apiAllData,
          onApiChange,
          onFieldChange,
      }) => {
    const [sort, setSort] = useState<boolean>(false);
    const [inputFieldList, setInputFieldData] = useState<Field[]>(apiData.inputFieldList);
    const [outputFieldList, setOutputFieldData] = useState<Field[]>(apiData.outputFieldList);

    useEffect(() => {
        setInputFieldData(apiData.inputFieldList);
        setOutputFieldData(apiData.outputFieldList);
    }, [apiData]);

    const DragHandle = SortableHandle(() => <MenuOutlined style={{cursor: 'grab', color: '#999'}}/>);
    const columns: ColumnsType<Field> = [
        {
            title: '序号',
            dataIndex: 'serialNo',
            align: 'center',
            width: 70,
            className: 'api-col',
            render: (v, r, i) => i + 1,
        }, {
            title: 'API 字段信息',
            dataIndex: 'fieldName',
            ellipsis: true,
            width: 350,
            className: 'api-col',
            render: (v, row) => {
                let required = <></>
                if (row.fieldRequired === 'yes') {
                    required = <span style={{color: 'red'}}>&nbsp;*</span>
                }
                if (row.ignore || sort) {
                    return <>{row.fieldIn} / {row.fieldType} / {row.fieldName}{required}</>;
                }

                return <Space direction={'vertical'} size={8}>
                    <div>名称：
                        <Tooltip title={row.fieldName}>
                            {row.fieldName}{required}
                        </Tooltip>
                    </div>
                    <div>类型：{row.fieldType}</div>
                    <div>位置：{row.fieldIn}</div>
                </Space>
            },
        },
        {
            dataIndex: 'sort',
            width: 40,
            align: 'left',
            className: 'api-col',
            render: () => <DragHandle/>,
        }, {
            title: <>忽略<EditOutlined style={{color: '#6d6d6d'}}/></>,
            dataIndex: 'ignore',
            align: 'center',
            width: 90,
            render: (v, row) => {
                return <Checkbox defaultChecked={v} checked={row.ignore} onChange={e => {
                    row.ignore = e.target.checked;
                    onFieldChange(row.paramType, row)
                }}/>
            }
        }, {
            title: <>字段信息<EditOutlined style={{color: '#6d6d6d'}}/></>,
            dataIndex: 'schemaName',
            ellipsis: true,
            width: 500,
            render: (v, row) => {
                if (row.ignore) {
                    return '';
                }

                if (sort) {
                    return <>
                        {v} / {row.schemaType} / {row.default}
                    </>;
                }

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
                        style={{width: '100%'}}
                        bordered={false}
                        onChange={v => {
                            row.schemaName = v;
                            row.selectSchemaName = v;
                            onFieldChange(row.paramType, row)
                        }}
                        options={schemaTypeOption}
                    />
                } else {
                    return <Space direction={'vertical'} size={4}>
                        <div>
                            名&nbsp;&nbsp;&nbsp;&nbsp;称：
                            <Input defaultValue={v}
                                   size={"middle"}
                                   className={'middle'}
                                   onChange={e => {
                                       row.schemaName = e.target.value;
                                       const oldValue = v;
                                       const newValue = e.target.value;
                                       const schemaValue = {
                                           oldValue,
                                           newValue
                                       };
                                       onFieldChange(row.paramType, row, 'schemaName', schemaValue)
                                   }}/>
                        </div>
                        <div>
                            类&nbsp;&nbsp;&nbsp;&nbsp;型：
                            <Select
                                defaultValue={row.schemaType}
                                size={"middle"}
                                className={'middle'}
                                onChange={v => {
                                    row.schemaType = v;
                                    onFieldChange(row.paramType, row)
                                }}
                                options={SchemaTypeOption}
                            />
                        </div>
                        <div>
                            默认值：
                            <Input defaultValue={row.default}
                                   size={"middle"}
                                   className={'middle'}
                                   onChange={e => {
                                       row.default = e.target.value;
                                       onFieldChange(row.paramType, row)
                                   }}/>
                        </div>
                    </Space>
                }
            },
        }, {
            title: <>其他属性<EditOutlined style={{color: '#6d6d6d'}}/></>,
            width: 150,
            align: 'center',
            render: (v, row) => {
                if (row.ignore || sort) {
                    return '';
                }

                return <SchemaEditDialog schemaField={row} onChange={(data) => {
                    if (row.paramType === 'output') {
                        const arr = [...outputFieldList];
                        arr.forEach(t => {
                            if (t.id === row.id) {
                                t.schemaRequired = row.schemaRequired;
                                t.computed = row.computed;
                                t.sensitive = row.sensitive;
                                t.keepZero = row.keepZero;
                                t.setterCode = row.setterCode;
                            }
                        });
                        setOutputFieldData(arr);
                    } else if (row.paramType === 'input') {
                        const arr = [...inputFieldList];
                        arr.forEach(t => {
                            if (t.id === row.id) {
                                t.schemaRequired = row.schemaRequired;
                                t.computed = row.computed;
                                t.sensitive = row.sensitive;
                                t.keepZero = row.keepZero;
                                t.setterCode = row.setterCode;
                            }
                        });
                        setInputFieldData(arr);
                    }
                    onFieldChange(row.paramType, data);
                }}/>
            },
        }, {
            title: <>描述<EditOutlined style={{color: '#6d6d6d'}}/></>,
            dataIndex: 'schemaDesc',
            ellipsis: true,
            render: (v, row) => {
                if (row.ignore) {
                    return <></>;
                }
                if (sort) {
                    return <>{row.schemaDesc}</>;
                }

                return <TextArea rows={4} defaultValue={v} onChange={e => {
                    row.schemaDesc = e.target.value;
                    onFieldChange(row.paramType, row)
                }}/>
            },
        }];

    const outputColumns: ColumnsType<Field> = columns.slice().map((column: any) => {
        if (column.children) {
            return {
                ...column,
                children: column.children.filter((child: any) => !['schemaRequired', 'computed', 'sensitive', 'default', 'keepZero'].includes(child.dataIndex))
            };
        }
        return column;
    });

    const SortableItem = SortableElement((props: React.HTMLAttributes<HTMLTableRowElement>) => (
        <tr {...props} />
    ));
    const SortableBody = SortableContainer((props: React.HTMLAttributes<HTMLTableSectionElement>) => (
        <tbody {...props} />
    ));

    const inputDraggableContainer = (props: SortableContainerProps) => (
        <SortableBody
            useDragHandle
            disableAutoscroll
            helperClass="row-dragging"
            onSortEnd={onInputSortEnd}
            {...props}
        />
    );

    const inputDraggableBodyRow: React.FC<any> = ({className, style, id, ...restProps}) => {
        const index = inputFieldList.findIndex(x => x.id === restProps['data-row-key']);
        return <SortableItem index={index} {...restProps} />;
    };

    const onInputSortEnd = ({oldIndex, newIndex}: SortEnd) => {
        if (oldIndex !== newIndex) {
            const newData = arrayMoveImmutable(inputFieldList.slice(), oldIndex, newIndex).filter(
                (el: any) => !!el,
            );

            newData.forEach((item, index) => {
                item.index = index + 1;
            })
            onHandleDragData(apiData.id, newData, 'input')
        }
    };

    const outputDraggableContainer = (props: SortableContainerProps) => (
        <SortableBody
            useDragHandle
            disableAutoscroll
            helperClass="row-dragging"
            onSortEnd={onOutPutSortEnd}
            {...props}
        />
    );

    const outputDraggableBodyRow: React.FC<any> = ({className, style, id, ...restProps}) => {
        const index = outputFieldList.findIndex(x => x.id === restProps['data-row-key']);
        return <SortableItem index={index} {...restProps} />;
    };

    const onOutPutSortEnd = ({oldIndex, newIndex}: SortEnd) => {
        if (oldIndex !== newIndex) {
            const newData = arrayMoveImmutable(outputFieldList.slice(), oldIndex, newIndex).filter(
                (el: any) => !!el,
            );

            newData.forEach((item, index) => {
                item.index = index + 1;
            })
            onHandleDragData(apiData.id, newData, 'output')
        }
    };


    // api相关操作方法
    const onApiOperate = (apiId: number, value: string | number | boolean, changeKey: string, emptyKey?: string) => {
        let findData = apiAllData.find(item => item.id === apiId);
        if (findData) {
            findData[changeKey] = value;
            if (emptyKey) {
                findData[emptyKey] = '';
            }
        }
        onApiChange(apiAllData);
    }

    const onPageIdChange = (apiId: number, value: string) => {
        let findData = apiAllData.find(item => item.id === apiId);
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

        onApiChange(apiAllData);
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

    const onHandleIgnore = (apiId: number, paramType: ('input' | 'output'), handleType: ('choose' | 'cancel')) => {
        let findData = apiAllData.find(item => item.id === apiId);
        if (findData) {
            if (paramType === 'input') {
                findData.inputFieldList.forEach(t => {
                    t.ignore = handleType === 'choose' ? true : false;
                })
            } else {
                findData.outputFieldList.forEach(t => {
                    t.ignore = handleType === 'choose' ? true : false;
                })
            }
        }
        onApiChange(apiAllData);
    }

    const onHandleDragData = (apiId: number, value: any, paramType: ('input' | 'output')) => {
        let findData = apiAllData.find(item => item.id === apiId);
        if (findData) {
            if (paramType === 'input') {
                setInputFieldData(value);
                findData.inputFieldList = value;
            } else {
                setOutputFieldData(value);
                findData.outputFieldList = value;
            }
        }
        onApiChange(apiAllData);
    }

    const onAddSchemaData = (apiId: number, row: any) => {
        let findData = apiAllData.find(item => item.id === apiId);
        if (findData) {
            findData.customSchemaData = row.customSchemaData;
            findData.customSchemaName = row.customSchemaName;
            findData.schemaName = row.schemaName;
            findData.customSchemaNameOption = row.customSchemaNameOption;
            findData.customSchemaOperator = row.customSchemaOperator;
            findData.dataNode = row.dataNode;
            findData.dataNodeOption = row.dataNodeOption;
        }

        onApiChange(apiAllData);
    }

    return <div style={{margin: '0 6px'}}>
        <Space className='api-config' direction={'vertical'}>
            <div style={{fontWeight: 'bold', fontSize: '16px', marginBottom: '10px'}}>请求参数</div>
            <div style={{display: 'flex'}}>
                {
                    (apiData.schemaType === 'argument' || baseInfo?.providerType === 'DataSource') ?
                        <span style={{marginRight: '20px'}}>
                                资源ID &nbsp;&nbsp;&nbsp;
                            {
                                apiData.isJmespath &&
                                <Input defaultValue={apiData.jmespath}
                                       onChange={(e) => {
                                           apiData.jmespath = e.target.value;
                                           onApiOperate(apiData.id, e.target.value, 'jmespath')
                                       }}
                                       placeholder="jmespath" style={{width: '180px'}}/>
                            }

                            {
                                !apiData.isJmespath &&
                                <Select placeholder="请选择资源ID"
                                        showSearch
                                        allowClear
                                        style={{width: '180px'}}
                                        value={apiData.resourceId}
                                        options={apiData.rosourceOption}
                                        onChange={(e) => {
                                            apiData.resourceId = e;
                                            onApiOperate(apiData.id, e, 'resourceId', 'jmespath')
                                        }}/>
                            }
                            <span style={{marginLeft: '5px'}}>
                                    <Checkbox defaultChecked={apiData.isJmespath} checked={apiData.isJmespath}
                                              onChange={e => {
                                                  apiData.isJmespath = e.target.checked;
                                                  onApiOperate(apiData.id, e.target.checked, 'isJmespath', 'resourceId')
                                              }}>jmespath</Checkbox>
                                </span>


                            </span> :
                        <span></span>
                }

                <span>
                        状态码 &nbsp;
                    <Input defaultValue={apiData.statusCode || 200}
                           onChange={(e) => {
                               apiData.statusCode = e.target.value;
                               onApiOperate(apiData.id, e.target.value, 'statusCode')
                           }}
                           placeholder="成功状态码" style={{width: '100px'}}/>
                    </span>
                <span style={{marginLeft: '15px', lineHeight: '34px'}}>
                        <CustomSchemaDialog apiData={apiData}
                                            handle={(option: 'ok' | 'cancel', rows: Api.Detail[], apiId: number[]) => {
                                                if (option === 'ok') {
                                                    onAddSchemaData(apiData.id, rows);
                                                }
                                            }}></CustomSchemaDialog>
                    </span>
                {
                    apiData.schemaType === 'attribute' ?
                        <span style={{lineHeight: '34px'}}>
                                <Checkbox defaultChecked={apiData.isPage} checked={apiData.isPage} onChange={e => {
                                    apiData.isPage = e.target.checked;
                                    onApiOperate(apiData.id, e.target.checked, 'isPage')
                                }}>分页查询</Checkbox>
                            </span> :
                        <span></span>
                }

                {
                    apiData.schemaType === 'attribute' && apiData.isPage ?
                        <div>
                                <span style={{marginLeft: '5px'}}>
                                    <span style={{color: '#ff4d4f', fontWeight: 'bold'}}>* </span>
                                    分页方式&nbsp;
                                    <Select placeholder="请选择分页方式"
                                            showSearch
                                            allowClear
                                            style={{width: '100px'}}
                                            value={apiData.pageMethod}
                                            options={apiData.pageOption}
                                            onChange={(e) => {
                                                if (!e) {
                                                    return
                                                }
                                                apiData.pageMethod = e;
                                                onPageIdChange(apiData.id, e)
                                            }}/>
                                </span>
                            <span style={{marginLeft: '5px'}}>
                                    <span style={{color: '#ff4d4f', fontWeight: 'bold'}}>* </span>
                                    DataPath&nbsp;
                                <Input defaultValue={apiData.dataPath}
                                       onChange={(e) => {
                                           if (!e) {
                                               return
                                           }
                                           apiData.dataPath = e.target.value;
                                           onApiOperate(apiData.id, e.target.value, 'dataPath')
                                       }}
                                       placeholder="请输入DataPath" style={{width: '140px'}}/>
                                </span>

                            {
                                apiData.pageMethod === 'marker' &&
                                <span>
                                        <span style={{marginLeft: '5px'}}>
                                            <span style={{color: '#ff4d4f', fontWeight: 'bold'}}>* </span>
                                            MarkerKey&nbsp;
                                            <Select placeholder="请选择MarkerKey"
                                                    showSearch
                                                    allowClear
                                                    style={{width: '180px'}}
                                                    value={apiData.markerKey}
                                                    options={apiData.markerOption}
                                                    onChange={(e) => {
                                                        if (!e) {
                                                            return
                                                        }
                                                        apiData.markerKey = e;
                                                        onApiOperate(apiData.id, e, 'markerKey')
                                                    }}/>
                                        </span>
                                        <span style={{marginLeft: '5px'}}>
                                            <span style={{color: '#ff4d4f', fontWeight: 'bold'}}>* </span>
                                            NextExp &nbsp;
                                            <Input defaultValue={apiData.nextExp}
                                                   onChange={(e) => {
                                                       if (!e.target.value) {
                                                           return
                                                       }
                                                       apiData.nextExp = e.target.value;
                                                       onApiOperate(apiData.id, e.target.value, 'nextExp')
                                                   }}
                                                   placeholder="请输入NextExp" style={{width: '150px'}}/>
                                        </span>
                                        <span style={{marginLeft: '5px'}}>
                                            DefaultLimit&nbsp;
                                            <Input defaultValue={apiData.defaultLimit}
                                                   onChange={(e) => {
                                                       if (!e) {
                                                           return
                                                       }
                                                       apiData.defaultLimit = e.target.value;
                                                       onApiOperate(apiData.id, e.target.value, 'defaultLimit')
                                                   }}
                                                   placeholder="" style={{width: '60px'}}/>
                                        </span>
                                    </span>
                            }

                            {
                                apiData.pageMethod === 'link' &&
                                <span style={{marginLeft: '5px'}}>
                                        <span style={{color: '#ff4d4f', fontWeight: 'bold'}}>* </span>
                                        LinkExp&nbsp;
                                    <Input defaultValue={apiData.linkExp}
                                           onChange={(e) => {
                                               apiData.linkExp = e.target.value;
                                               onApiOperate(apiData.id, e.target.value, 'linkExp')
                                           }}
                                           placeholder="请输入LinkExp" style={{width: '150px'}}/>
                                    </span>
                            }

                            {
                                apiData.pageMethod === 'offset' &&
                                <span>
                                        <span style={{marginLeft: '5px'}}>
                                            <span style={{color: '#ff4d4f', fontWeight: 'bold'}}>* </span>
                                            OffsetKey&nbsp;
                                            <Select placeholder="请选择OffsetKey"
                                                    showSearch
                                                    allowClear
                                                    style={{width: '140px'}}
                                                    value={apiData.offsetKey}
                                                    options={apiData.offsetOption}
                                                    onChange={(e) => {
                                                        if (!e) {
                                                            return
                                                        }
                                                        apiData.offsetKey = e;
                                                        onApiOperate(apiData.id, e, 'offsetKey')
                                                    }}/>
                                        </span>
                                        <span style={{marginLeft: '5px'}}>
                                            <span style={{color: '#ff4d4f', fontWeight: 'bold'}}>* </span>
                                            LimitKey&nbsp;
                                            <Select placeholder="请选择LimitKey"
                                                    showSearch
                                                    allowClear
                                                    style={{width: '140px'}}
                                                    value={apiData.limitKey}
                                                    options={apiData.limitOption}
                                                    onChange={(e) => {
                                                        if (!e) {
                                                            return
                                                        }
                                                        apiData.limitKey = e;
                                                        onApiOperate(apiData.id, e, 'limitKey')
                                                    }}/>
                                        </span>
                                        <span style={{marginLeft: '5px'}}>
                                            DefaultLimit&nbsp;
                                            <Input defaultValue={apiData.defaultLimit}
                                                   onChange={(e) => {
                                                       if (!e) {
                                                           return
                                                       }
                                                       apiData.defaultLimit = e.target.value;
                                                       onApiOperate(apiData.id, e.target.value, 'defaultLimit')
                                                   }}
                                                   placeholder="" style={{width: '60px'}}/>
                                        </span>
                                    </span>
                            }
                            {
                                apiData.pageMethod === 'pageSize' &&
                                <span>
                                        <span style={{marginLeft: '5px'}}>
                                            <span style={{color: '#ff4d4f', fontWeight: 'bold'}}>* </span>
                                            PageNumKey&nbsp;
                                            <Select placeholder="请选择"
                                                    showSearch
                                                    allowClear
                                                    style={{width: '120px'}}
                                                    value={apiData.pageNumKey}
                                                    options={apiData.pageNumOption}
                                                    onChange={(e) => {
                                                        if (!e) {
                                                            return
                                                        }
                                                        apiData.pageNumKey = e;
                                                        onApiOperate(apiData.id, e, 'pageNumKey')
                                                    }}/>
                                        </span>
                                        <span style={{marginLeft: '5px'}}>
                                            <span style={{color: '#ff4d4f', fontWeight: 'bold'}}>* </span>
                                            PageSizeKey&nbsp;
                                            <Select placeholder="请选择"
                                                    showSearch
                                                    allowClear
                                                    style={{width: '120px'}}
                                                    value={apiData.pageSizeKey}
                                                    options={apiData.pageSizeOption}
                                                    onChange={(e) => {
                                                        if (!e) {
                                                            return
                                                        }
                                                        apiData.pageSizeKey = e;
                                                        onApiOperate(apiData.id, e, 'pageSizeKey')
                                                    }}/>
                                        </span>
                                        <span style={{marginLeft: '5px'}}>
                                            DefaultSize&nbsp;
                                            <Input defaultValue={apiData.defaultSize}
                                                   onChange={(e) => {
                                                       if (!e) {
                                                           return
                                                       }
                                                       apiData.defaultSize = e.target.value;
                                                       onApiOperate(apiData.id, e.target.value, 'defaultSize')
                                                   }}
                                                   style={{width: '60px'}}/>
                                        </span>
                                    </span>
                            }
                        </div> :
                        <span></span>

                }

            </div>
            <div style={{margin: '10px 0'}}>
                <Space direction={'horizontal'}>
                    {
                        sort ?
                            <Button type="primary" size='small' onClick={() => setSort(false)}>结束排序</Button>
                            :
                            <Button type="primary" size='small' onClick={() => setSort(true)}>启用排序</Button>
                    }
                    <Button type="primary" size='small'
                            onClick={() => onHandleIgnore(apiData.id, 'input', 'choose')}>全部忽略</Button>
                    <Button type="primary" size='small'
                            onClick={() => onHandleIgnore(apiData.id, 'input', 'cancel')}>取消全部忽略</Button>
                </Space>
            </div>

            <Table
                columns={
                    sort ? columns : columns.filter(t => t.dataIndex !== 'sort')
                }
                dataSource={inputFieldList}
                size={'middle'}
                pagination={false}
                rowKey={r => r.id}
                components={{
                    body: !sort ? {} : {
                        wrapper: inputDraggableContainer,
                        row: inputDraggableBodyRow,
                    },
                }}
            />
            <div style={{height: '15px'}}></div>
            {
                ['argument', 'attribute'].includes(apiData.schemaType) &&
                <div>
                    <div style={{fontWeight: 'bold', fontSize: '16px', marginBottom: '10px'}}>响应参数</div>
                    <div style={{marginTop: '10px'}}>
                        <Space direction={'horizontal'}>
                            {
                                sort ?
                                    <Button type="primary" size='small'
                                            onClick={() => setSort(false)}>结束排序</Button>
                                    :
                                    <Button type="primary" size='small'
                                            onClick={() => setSort(true)}>启用排序</Button>
                            }
                            <Button type="primary" size='small'
                                    onClick={() => onHandleIgnore(apiData.id, 'output', 'choose')}>全部忽略</Button>
                            <Button type="primary" size='small'
                                    onClick={() => onHandleIgnore(apiData.id, 'output', 'cancel')}>取消全部忽略</Button>
                        </Space>
                    </div>
                    <Table
                        columns={
                            sort ? outputColumns : outputColumns.filter(t => t.dataIndex !== 'sort')
                        }
                        dataSource={outputFieldList}
                        size={'middle'}
                        pagination={false}
                        rowKey={r => r.id}
                        components={{
                            body: !sort ? {} : {
                                wrapper: outputDraggableContainer,
                                row: outputDraggableBodyRow,
                            },
                        }}
                    />
                </div>
            }

        </Space>
    </div>;
}

const ApiInfo: React.FC<{ api: ApiDetail, onSchemaTypeChange: (v: string) => any, deleteApiData: () => any, onServiceAlias:(v: string) => any }> = ({
    api,
    onSchemaTypeChange,
    deleteApiData,
    onServiceAlias,
}) => {
    return <Row>
        <Col span={12}>
            <Select
                onClick={(e) => e.stopPropagation()}
                showArrow
                style={{width: '140px', marginRight: '10px'}}
                placeholder={'请选择操作'}
                value={api.schemaType}
                onChange={onSchemaTypeChange}
            >
                <Option value="argument">CreateContext</Option>
                <Option value="attribute">ReadContext</Option>
                <Option value="update">UpdateContext</Option>
                <Option value="delete">DeleteContext</Option>
            </Select>
            <Input value={api.serviceAlias}
                onClick={(e) => e.stopPropagation()}
                placeholder='为服务设置endpoint'
                size={"middle"}
                style={{ width: '160px' }}
                onChange={e => {
                    onServiceAlias(e.target.value)
                }} />
            <span style={{ marginLeft: '10px' }}>#{api.id} 【{api.productName}】&nbsp;&nbsp;{api.apiName} / {api.apiNameEn}</span>
        </Col>
        <Col span={12} style={{textAlign: 'right', marginTop: '4px'}}>
            [{api.method}]&nbsp;&nbsp;{api.uri}
            <Button size='small' onClick={deleteApiData} style={{marginLeft: '8px'}}>移除</Button>
        </Col>
    </Row>;
}

export const getType = (originType: string): string => {
    let newType = originType;
    const ft = FieldTypeOption.filter(t => t.value == originType)
    if (ft.length > 0) {
        newType = ft[0].label;
    }
    return newType || originType;
}

const ApiConfig: React.FC<{
    setData: (data: ApiDetail[]) => any,
    baseInfo: any,
    dataId: number | null,
    apiDataPar: ApiDetail[],
    funData: allFunData[],
    setFunData: (data: allFunData[]) => any,
}> = ({setData, baseInfo, dataId, apiDataPar, funData, setFunData}) => {
    let [apiData, setApiData] = useState<ApiDetail[]>([]);
    const [activeKey, setActiveKey] = useState<string[]>([]);
    apiData = apiDataPar;

    useEffect(() => {
        if (baseInfo?.providerType === 'DataSource' && apiData.length) {
            apiData.forEach(api => {
                const uuOption = api.rosourceOption.find(item => item.value === '$_UUID_$');
                if (!uuOption) {
                    api.rosourceOption.unshift({
                        label: '使用UUID',
                        value: '$_UUID_$'
                    });

                    if (!api.resourceId) {
                        api.resourceId = '$_UUID_$'
                    }
                }
            })
            setApiData(apiData);
            setData(apiData);
        }

        if (baseInfo?.providerType === 'Resource' && apiData.length) {
            apiData.forEach(api => {
                api.rosourceOption = api.rosourceOption.filter(item => item.value !== '$_UUID_$')
                if (api.resourceId === '$_UUID_$') {
                    api.resourceId = ''
                }
                setApiData(apiData);
                setData(apiData);
            })
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
                let api: ApiDetail = {...t};
                const findApiData = apiData.find(item => item.id === api.id);
                if (findApiData) {
                    api.schemaType = findApiData.schemaType;
                }
                api.statusCode = '';
                api.serviceAlias = '';
                api.jmespath = '';
                api.isJmespath = false;
                api.rosourceOption = baseInfo?.providerType === 'DataSource' ? [{
                    label: '使用UUID',
                    value: '$_UUID_$'
                }] : [];
                api.resourceId = baseInfo?.providerType === 'DataSource' ? '$_UUID_$' : '';
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

                api.dataNode = null;
                api.dataNodeOption = [];
                api.customSchemaData = [];
                api.customSchemaName = null;
                api.customSchemaNameOption = [];
                api.customSchemaOperator = null;

                api.inputFieldList?.map((t, index) => {
                    t.schemaName = camelToSnake(t.fieldName);
                    t.schemaType = getType(t.fieldType);
                    t.schemaRequired = t.fieldRequired === 'yes' ? true : false;
                    t.schemaDesc = t.fieldDesc;
                    t.ignore = false;
                    if (t.fieldIn === 'header' || (t.fieldIn === 'path' && t.fieldName === 'project_id') || (t.fieldIn === 'path' && t.fieldName === 'domain_id')) {
                        t.ignore = true;
                    }
                    t.computed = false;
                    t.default = '';
                    t.sensitive = false;
                    t.keepZero = false;
                    t.selectSchemaName = '';
                    t.index = index + 1;
                    return t;
                });

                api.outputFieldList?.forEach((t, index) => {
                    t.schemaName = camelToSnake(t.fieldName);
                    t.schemaType = getType(t.fieldType);
                    t.schemaRequired = t.fieldRequired === 'yes' ? true : false;
                    t.schemaDesc = t.fieldDesc;
                    t.ignore = true;
                    t.index = index + 1;
                    api.rosourceOption.push({
                        label: t.fieldName,
                        value: t.fieldName
                    })

                    api.dataNodeOption.push({
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

    const deleteApiData = (apiId: number, event: { stopPropagation: () => void; }) => {
        event.stopPropagation();
        if (!apiId) {
            return;
        }

        // 移除的API，如果为readContext,对应在readContext中,Set Schema类型的编排函数需要移除
        const findData = apiData.find(item => item.id === apiId && item.schemaType === 'attribute');
        if (findData) {
            const readContextData = funData.find(item => item.id === 'readContext');
            if (readContextData) {
                readContextData.contextValue = readContextData.contextValue.filter(item => !(item.funType === 'setSchema' && item.funName === `${findData.apiNameEn}ToSchema`));
            }
            setFunData([...funData]);
        }

        const filterData = apiData.filter(item => item.id !== apiId);
        setApiData([...filterData]);
        setData([...filterData]);
    }

    const onApiChange = (data: ApiDetail[]) => {
        setApiData([...data]);
        setData([...data]);
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
                                            if (item.fieldIn === 'header' || (item.fieldIn === 'path' && item.fieldName === 'project_id') || (item.fieldIn === 'path' && item.fieldName === 'domain_id')) {
                                                item.ignore = true;
                                            }
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
                                onServiceAlias={v => {
                                    api.serviceAlias = v;
                                    setData(apiData);
                                }}          
                                deleteApiData={(e) => deleteApiData(api.id, e)}
                            />;

                            return <Panel header={titleInfo} key={api.id}>
                                <ApiFieldView
                                    apiData={api}
                                    baseInfo={baseInfo}
                                    apiAllData={apiData}
                                    onApiChange={onApiChange}
                                    onFieldChange={(paramType, field, paramName, schemaValue) => onFieldChange(api.id, paramType, field, paramName, schemaValue)}
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
