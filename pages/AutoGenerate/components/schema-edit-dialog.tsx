import {Field} from "@/pages/AutoGenerate/step1/api-config";
import React, {useEffect, useState} from "react";
import {Checkbox, Col, Modal, Row, Space, Typography} from "antd";
import CodeEditor from "@/components/CodeEditor";

const {Title} = Typography;

const defaultSetter = `func(body, data *gjson.Result) string {
    return data.Get("xx").String()
}`

const defaultGetter = `func() string {
    v, _ := w.Get("xx").(string)
    return v
}`

export const SchemaEditDialog: React.FC<{
    schemaField: Field,
    onChange: (rows: Field) => any,
}> = ({schemaField, onChange}) => {
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

            <Space size={15} direction={'vertical'} style={{width: '100%', marginTop: '15px'}}>
                <div>
                    <Title level={5}>基本属性</Title>
                    <Space size={[8, 16]} wrap>
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
                    </Space>
                </div>
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
                    <div>
                        <Title level={5}>自定义 Schema Setter 函数</Title>
                        <CodeEditor language={'go'} value={schema.setterCode || defaultSetter} height={300}
                                    onChange={(v: string) => {
                                        if (v.trim() == defaultSetter) {
                                            v = '';
                                        }
                                        const newSchema = {...schema};
                                        newSchema.setterCode = v;
                                        setSchema(newSchema);
                                    }}/>
                    </div>
                }
            </Space>
        </Modal>
    </>
}
