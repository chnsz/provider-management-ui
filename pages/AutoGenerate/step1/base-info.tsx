import React, {useEffect, useState} from "react";
import '../index.less'
import {Space, Select, Input, Checkbox, Form, Row, Col} from "antd";

export interface BaseInfo {
    providerType: string | null;
    providerName: string;
    productName: string;
    packageName: string;
    globalService: boolean;

    tagPath: string;
    tagVersion: string;

    createTimeout: string;
    readTimeout: string;
    updateTimeout: string;
    deleteTimeout: string;
}

const BaseInfoForm: React.FC<{
    onChange: (data: any) => any,
    defaultValue?: BaseInfo,
}> = ({onChange, defaultValue}) => {
    const [form] = Form.useForm();
    
    useEffect(() => {
        if (!defaultValue) {
            form.setFieldsValue({});
            return
        }

        form.setFieldsValue(defaultValue);
    }, [defaultValue]);

    return <div style={{margin: '20px'}}>
        <Form form={form}
              name="basic"
              layout={'vertical'}
              initialValues={{
                defaultValue
              }}
              autoComplete="off"
              onValuesChange={(v, data) => onChange(data)}
        >
            <Space.Compact block>
                <Space size={15}>
                    <Form.Item label="资源信息" required>
                        <Input.Group compact>
                            <Form.Item name={'providerType'} noStyle>
                                <Select placeholder="资源类型" style={{width: '150px'}}>
                                    <Option value="DataSource">DataSource</Option>
                                    <Option value="Resource">Resource</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name={'providerName'} noStyle>
                                <Input style={{width: '330px'}} placeholder="请输入"/>
                            </Form.Item>
                        </Input.Group>
                    </Form.Item>
                    <Form.Item label="所属服务" name="productName" required>
                        <Input style={{width: '150px'}} placeholder="请输入"/>
                    </Form.Item>
                    <Form.Item label="包名" name="packageName" tooltip={'用于生成代码中的 package 名称'}>
                        <Input style={{width: '150px'}} placeholder="请输入"/>
                    </Form.Item>
                    <Form.Item label={' '} name="globalService" valuePropName="checked">
                        <Checkbox>全局服务</Checkbox>
                    </Form.Item>
                </Space>
            </Space.Compact>
            <Space.Compact block style={{marginTop: '-10px'}}>
                <Space size={15}>
                    <Form.Item label="CreateTimeout" name="createTimeout" style={{width: '150px'}}>
                        <Input placeholder={'单位：分钟'}/>
                    </Form.Item>
                    <Form.Item label="ReadTimeout" name="readTimeout" style={{width: '150px'}}>
                        <Input placeholder={'单位：分钟'}/>
                    </Form.Item>
                    <Form.Item label="UpdateTimeout" name="updateTimeout" style={{width: '150px'}}>
                        <Input placeholder={'单位：分钟'}/>
                    </Form.Item>
                    <Form.Item label="DeleteTimeout" name="deleteTimeout" style={{width: '150px'}}>
                        <Input placeholder={'单位：分钟'}/>
                    </Form.Item>
                </Space>
            </Space.Compact>
        </Form>
    </div>
}

export default BaseInfoForm;
