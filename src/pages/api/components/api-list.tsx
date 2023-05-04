import { Button, Form, Input, Select, Space } from 'antd';
import React from 'react';
import '../api.less';

const { Option } = Select;

const ApiList: React.FC = () => {
    return (
        <div className={'api-card'}>
            <div className={'api-list'}>
                <Form className={'api-group'}>
                    <Form.Item label="产品服务">
                        <Select placeholder="请选择" allowClear className={'api-input'}>
                            <Option value="male">产品服务1</Option>
                            <Option value="female">产品服务2</Option>
                            <Option value="other">产品服务3</Option>
                        </Select>
                    </Form.Item>
                </Form>
                <Form className={'api-group'}>
                    <Form.Item label="分组名称">
                        <Select placeholder="请选择" allowClear className={'api-input'}>
                            <Option value="male">产品服务1</Option>
                            <Option value="female">产品服务2</Option>
                            <Option value="other">产品服务3</Option>
                        </Select>
                    </Form.Item>
                </Form>
                <Form className={'api-group'}>
                    <Form.Item label="API名称">
                        <Input className={'api-input'} placeholder="请输入" />
                    </Form.Item>
                </Form>
                <Form className={'api-group'}>
                    <Form.Item label="URI">
                        <Input className={'api-input'} placeholder="请输入" />
                    </Form.Item>
                </Form>
                <Form className={'api-group'}>
                    <Form.Item label="覆盖分析">
                        <Select placeholder="请选择" allowClear className={'api-input'}>
                            <Option value="male">产品服务1</Option>
                            <Option value="female">产品服务2</Option>
                            <Option value="other">产品服务3</Option>
                        </Select>
                    </Form.Item>
                </Form>
                <Form className={'api-group'}>
                    <Form.Item label="发布状态">
                        <Select placeholder="请选择" allowClear className={'api-input'}>
                            <Option value="male">产品服务1</Option>
                            <Option value="female">产品服务2</Option>
                            <Option value="other">产品服务3</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </div>
            <div className={'api-button'}>
                <Space wrap>
                    <Button type="primary">查询</Button>
                    <Button>重置</Button>
                </Space>
            </div>
        </div>
    );
};
export default ApiList;
