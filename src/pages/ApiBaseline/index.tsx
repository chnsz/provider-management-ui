import Entry from '@/pages/ApiBaseline/components/entry';
import Ginseng from '@/pages/ApiBaseline/components/ginseng';
import { Breadcrumb, Button, Form, Input, Select, Space } from 'antd';
import React from 'react';
import './api-baseline.less';

const { Option } = Select;

const BaselineSearch = () => {
    return (
        <div style={{ background: '#ffffff' }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>查询</div>
            <div className={'api-baseline-card'}>
                <div className={'supplement'}>
                    <Form className={'supplement-text'}>
                        <Form.Item label="API名称">
                            <Input className={'supplement-box'} placeholder="请输入" />
                        </Form.Item>
                    </Form>
                    <Form className={'supplement-text'}>
                        <Form.Item label="资源类型">
                            <Select placeholder="请选择" allowClear className={'supplement-box'}>
                                <Option value="male">产品服务1</Option>
                                <Option value="female">产品服务2</Option>
                                <Option value="other">产品服务3</Option>
                            </Select>
                        </Form.Item>
                    </Form>
                    <Form className={'supplement-text'}>
                        <Form.Item label="资源名称">
                            <Select placeholder="请选择" allowClear className={'supplement-box'}>
                                <Option value="male">产品服务1</Option>
                                <Option value="female">产品服务2</Option>
                                <Option value="other">产品服务3</Option>
                            </Select>
                        </Form.Item>
                    </Form>
                    <div className={'supplement-text'}>
                        <Space wrap>
                            <Button type="primary">查询</Button>
                        </Space>
                    </div>
                    <div className={'supplement-text'}>
                        <Space wrap>
                            <Button type="primary">保存</Button>
                        </Space>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ApiBaseline: React.FC = () => {
    return (
        <>
            <Breadcrumb
                items={[{ title: '首页' }, { title: 'API 基线维护' }]}
                style={{ margin: '10px 0' }}
            />
            <BaselineSearch />
            <div style={{ height: '16px' }} />
            <Entry apiID={44} providerType={'Resource'} providerName={'text'} />
            <div style={{ height: '16px' }} />
            <Ginseng />
        </>
    );
};
export default ApiBaseline;
