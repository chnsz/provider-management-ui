import {Field} from "@/pages/AutoGenerate/step1/api-config";
import React, {useEffect, useState} from "react";
import {Checkbox, Form, Input, Modal, Row, Space, Typography} from "antd";
import CodeEditor from "@/components/CodeEditor";
import { ApiDetail } from "../step1/api-config";

const {Title, Text} = Typography;

const defaultSetter = `func(body, data *gjson.Result) string {
    return data.Get("xx").String()
}`

const defaultSetter2 = `func(body *gjson.Result) string {
    return body.Get("xx").String()
}`

const defaultGetter = `func() string {
    v, _ := w.Get("xx").(string)
    return v
}`


const getDefSetter = (schema: Field): string => {
    if (schema.schemaName.includes(".")) {
        return defaultSetter;
    }
    return defaultSetter2;
}

export const SchemaEditDialog: React.FC<{
    schemaField: Field,
    apiData: ApiDetail,
    onChange: (rows: Field) => any,
}> = ({schemaField, apiData, onChange}) => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [schema, setSchema] = useState<Field>(schemaField);

    return <>
        <Space direction={'vertical'} size={2} style={{textAlign: 'left', marginLeft: '5px'}}>
            <Checkbox checked={schema.schemaRequired} onChange={e => {
                const newSchema = {...schema};
                newSchema.schemaRequired = e.target.checked;
                setSchema(newSchema);
            }}>
                Required
            </Checkbox>
            <Checkbox checked={schema.computed} onChange={e => {
                const newSchema = {...schema};
                newSchema.computed = e.target.checked;
                setSchema(newSchema);
            }}>
                Computed
            </Checkbox>
            <Checkbox checked={schema.keepZero}
                      onChange={e => {
                          const newSchema = {...schema};
                          newSchema.keepZero = e.target.checked;
                          setSchema(newSchema);
                      }}>
                KeepZero
            < /Checkbox>
            <a onClick={() => setDialogOpen(true)}>更多属性</a>
        </Space>

        <Modal title="Schema 属性配置"
               destroyOnClose
               transitionName={''}
               open={isDialogOpen}
               onOk={() => {
                   setDialogOpen(false);
                   onChange(schema);
               }}
               onCancel={() => {
                   setDialogOpen(false);
                   onChange(schema);
               }}
               footer={[]}
               width={'1500px'}>

            <Space size={20} direction={'vertical'} style={{width: '100%', marginTop: '15px'}}>
                <div>
                    <Title level={5}>基本属性</Title>
                    <Space size={[10, 10]} wrap style={{width: '100%'}} direction={'vertical'}>
                        <Space.Compact block>
                            <div>
                                <span>名称：</span>
                                {schema.schemaName}
                            </div>
                            <div style={{marginLeft: '20px'}}>
                                <span>类型：</span>
                                {schema.schemaType}
                            </div>
                        </Space.Compact>
                        <Space.Compact block>
                            <Checkbox checked={schema.schemaRequired} onChange={e => {
                                const newSchema = {...schema};
                                newSchema.schemaRequired = e.target.checked;
                                setSchema(newSchema);
                            }}>
                                Required
                            </Checkbox>
                            <Checkbox checked={schema.computed}
                                      onChange={e => {
                                          const newSchema = {...schema};
                                          newSchema.computed = e.target.checked;
                                          setSchema(newSchema);
                                      }}>
                                Computed
                            </Checkbox>
                            <Checkbox checked={schema.sensitive}
                                      onChange={e => {
                                          const newSchema = {...schema};
                                          newSchema.sensitive = e.target.checked;
                                          setSchema(newSchema);
                                      }}>
                                Sensitive
                            </Checkbox>
                            <Checkbox checked={schema.keepZero}
                                      onChange={e => {
                                          const newSchema = {...schema};
                                          newSchema.keepZero = e.target.checked;
                                          setSchema(newSchema);
                                      }}>
                                KeepZero
                            < /Checkbox>
                        </Space.Compact>
                    </Space>
                </div>
                {
                    apiData.schemaType === 'attribute' &&
                    <div>
                        <Title level={5}>日期格式</Title>
                        <Space size={20} direction={'horizontal'}>
                            <span>
                                <span style={{ marginRight: '10px', display: 'inline-block' }}>
                                    <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>* </span>
                                    原格式:
                                </span>

                                <Input placeholder="如: 2006-01-02T15:04:05"
                                    allowClear
                                    value={schema.dateFormat?.source}
                                    onChange={e => {
                                        const newSchema = {...schema};
                                        newSchema['dateFormat'] = {
                                            'source': e.target.value,
                                            'target': schema.dateFormat?.target
                                        };
                                        setSchema(newSchema);
                                    }}
                                    style={{ width: '200px' }} />
                            </span>
                            <span>
                                <span style={{ marginRight: '10px', display: 'inline-block' }}>
                                    <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>* </span>
                                    目标格式:
                                </span>

                                <Input placeholder="如: 2006-01-02T15:04:05"
                                    allowClear
                                    value={schema.dateFormat?.target}
                                    onChange={e => {
                                        const newSchema = {...schema};
                                        newSchema['dateFormat'] = {
                                            'source': schema.dateFormat?.source,
                                            'target': e.target.value
                                        };
                                        setSchema(newSchema);
                                    }}
                                    style={{ width: '200px' }} />
                            </span>

                        </Space>
                    </div>

                }
                {
                    schema.paramType === 'input' &&
                    <div>
                        <Title level={5}>自定义 Schema Getter 函数</Title>
                        <CodeEditor language={'go'} value={schema.getterCode || defaultGetter} height={300}
                                    onChange={(v: string) => {
                                        if (v.trim() == defaultGetter) {
                                            v = '';
                                        }
                                        const newSchema = {...schema};
                                        newSchema.getterCode = v;
                                        setSchema(newSchema);
                                    }}/>
                    </div>
                }
                {
                    schema.paramType === 'output' &&
                    <>
                        <div>
                            <Title level={5}>自定义 Schema Setter 函数</Title>
                            <CodeEditor language={'go'} value={schema.setterCode || getDefSetter(schema)} height={300}
                                        onChange={(v: string) => {
                                            if (v.trim() == getDefSetter(schema)) {
                                                v = '';
                                            }
                                            const newSchema = {...schema};
                                            newSchema.setterCode = v;
                                            setSchema(newSchema);
                                        }}/>
                        </div>
                    </>
                }
                
            </Space>
        </Modal>
    </>
}
