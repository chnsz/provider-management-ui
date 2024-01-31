import React, { useEffect, useState } from "react";
import { Button, Form, Input, Select, Space, Radio, Modal } from 'antd';
import { getProductList } from "@/services/product/api";
import type { SelectProps } from "antd/es/select";
import { getCloudName } from "@/global";
import { addApiMonitor, updateApiMonitor } from "@/services/provider/api";
import { undefined } from "@umijs/utils/compiled/zod";

const { Option } = Select;

type FormValue = {
    providerType: string;
    providerName: string;
    type: string;
    productName: string;
    method: string;
    uriShort: string;
    fieldIn: 'header' | 'query' | 'path' | 'body' | '';
    fieldName: string;
    groupName: string;
}

const FormView: React.FC<{
    option: 'add' | 'update',
    field: Provider.ProviderSyncIssue,
    defaultValue?: Provider.ApiMonitor,
    onFinish: (v: FormValue) => any,
}> = ({ option, field, defaultValue, onFinish }) => {
    const [productNameOpts, setProductNameOpts] = useState<SelectProps['options']>([]);
    const [monitorType, setMonitorType] = useState<string>('API');

    useEffect(() => {
        getProductList().then((d) => {
            const arr = d.items
                .map((p) => p.productName)
                .sort()
                .map((n) => {
                    return { value: n, label: n };
                });

            setProductNameOpts(arr);
        });
    }, []);

    const apiRule = (n: string) => {
        return [{ required: monitorType === 'API', message: n + '字段必填' }]
    }

    return <Form
        name="form"
        onFinish={onFinish}
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600, marginTop: '20px' }}
        initialValues={{
            providerType: field.providerType,
            providerName: field.providerName,
            type: 'API',
            productName: field.productName,
            method: defaultValue?.method === '' ? null : defaultValue?.method,
            uriShort: defaultValue?.uriShort,
            fieldIn: defaultValue?.fieldIn,
            fieldName: defaultValue?.fieldName,
            groupName: defaultValue?.groupName,
        }}
    >
        <Form.Item label="资源类型" style={{ marginBottom: '15px' }} rules={[{ required: true }]}>
            <Space.Compact>
                <Form.Item name='providerType' noStyle rules={[{ required: true, message: '资源类型必填' }]}>
                    <Select placeholder="请选择资源类型" style={{ width: '120px' }}>
                        <Option value="Resource">Resource</Option>
                        <Option value="DataSource">DataSource</Option>
                    </Select>
                </Form.Item>
                <Form.Item name='providerName' noStyle rules={[{ required: true, message: '资源名称必填' }]}>
                    <Input style={{ width: '300px' }} placeholder="请输入资源名称" />
                </Form.Item>
            </Space.Compact>
        </Form.Item>
        <Form.Item label="监控类型" style={{ marginBottom: '15px' }} name="type" rules={[{ required: true }]}>
            <Radio.Group onChange={(e) => setMonitorType(e.target.value)} buttonStyle="solid">
                <Radio.Button value="Service">Service</Radio.Button>
                <Radio.Button value="API">API</Radio.Button>
            </Radio.Group>
        </Form.Item>
        <Form.Item label="服务名称" style={{ marginBottom: '-5px' }}>
            <Form.Item name="productName" rules={[{ required: true }]}>
                <Select style={{ width: '200px' }} placeholder={'服务名称'} showSearch options={productNameOpts} />
            </Form.Item>
        </Form.Item>
        <Form.Item label="API" style={{ marginBottom: '15px' }} hidden={monitorType === 'Service'}>
            <Space.Compact>
                <Form.Item name='method' noStyle rules={apiRule('请求类型')}>
                    <Select style={{ width: '120px' }} placeholder={'请求类型'}
                        options={[
                            { value: 'POST', label: 'POST' },
                            { value: 'GET', label: 'GET' },
                            { value: 'PUT', label: 'PUT' },
                            { value: 'PATCH', label: 'PATCH' },
                            { value: 'DELETE', label: 'DELETE' },
                            { value: 'HEAD', label: 'HEAD' },
                            { value: 'OPTIONS', label: 'OPTIONS' },
                        ]}
                    />
                </Form.Item>
                <Form.Item name='uriShort' noStyle rules={apiRule('URI')}>
                    <Input style={{ width: '400px' }} placeholder={'URI'} />
                </Form.Item>
            </Space.Compact>
        </Form.Item>
        <Form.Item label="字段" style={{ marginBottom: '15px' }} hidden={monitorType === 'Service'}>
            <Space.Compact>
                <Form.Item name='fieldIn' noStyle>
                    <Select style={{ width: '120px' }} placeholder={'字段位置'}>
                        <Option value="body">Body</Option>
                        <Option value="query">Query</Option>
                        <Option value="path">Path</Option>
                        <Option value="header">Header</Option>
                    </Select>
                </Form.Item>
                <Form.Item name='fieldName' noStyle>
                    <Input style={{ width: '400px' }} placeholder={'字段名称'} />
                </Form.Item>
            </Space.Compact>
        </Form.Item>
        <Form.Item label="分组" style={{ marginBottom: '-5px' }} hidden={monitorType === 'Service'}>
            <Form.Item name="groupName">
                <Input placeholder={'分组名称，可选'} />
            </Form.Item>
        </Form.Item>

        <Form.Item label="" colon={false}>
            {
                option === 'add' ? <Button type="primary" htmlType="submit"> 保存 </Button>
                    :
                    <Button type="primary" htmlType="submit"> 更新 </Button>
            }
        </Form.Item>
    </Form>
}

const MonitorDialog: React.FC<{
    content: any,
    cloudName: string,
    option: 'add' | 'update',
    field: Provider.ProviderSyncIssue,
    defaultValue?: Provider.ApiMonitor,
    onClose?: () => any,
}> = ({ content, cloudName, option, field, defaultValue, onClose }) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    let title = `监听服务 / API【${getCloudName(cloudName)}】`;
    if (option === 'add') {
        title = '新增' + title;
    } else if (option === 'update') {
        title = '修改' + title;
    }

    const onFinish = (v: FormValue) => {
        if (option === 'add') {
            addApiMonitor({
                cloudName: cloudName,
                relationId: field.id,
                relationType: field.type,
                status: defaultValue?.status || 'open',
                ...v,
            }).then(onClose);
        } else if (option === 'update') {
            updateApiMonitor({
                id: defaultValue?.id || 0,
                cloudName: cloudName,
                relationId: field.id,
                relationType: field.type,
                status: defaultValue?.status || 'open',
                ...v,
            }).then(onClose);
        }
        setIsModalOpen(false);
    }

    return (
        <>
            <a onClick={showModal} style={{ cursor: 'pointer' }}>{content}</a>
            <Modal title={title}
                destroyOnClose
                transitionName={''}
                open={isModalOpen}
                onOk={handleCancel}
                onCancel={handleCancel}
                width={800}
                footer={[]}>
                <FormView option={option} field={field} defaultValue={defaultValue} onFinish={onFinish} />
            </Modal>
        </>
    );
}

export default MonitorDialog;
