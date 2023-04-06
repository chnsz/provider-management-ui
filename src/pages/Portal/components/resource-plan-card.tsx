import { getResourcePlanSum } from '@/services/portal/api';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Badge, Button, Dropdown, message, Radio, Space, Table } from 'antd';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import type { ColumnsType } from 'antd/es/table/interface';
import React, { useEffect, useState } from 'react';

const ResourcePlanCard: React.FC = () => {
    const [list, setList] = useState<Portal.getResourcePlan[]>([
        {
            serialNo: 0,
            feature: '',
            theme: '',
            priority: '',
            state: '',
            date: '',
            operate: '',
        },
    ]);
    useEffect(() => {
        getResourcePlanSum().then((rsp) => {
            setList(rsp);
        });
    }, []);

    interface DataType {
        serialNo: number;
        feature: string;
        theme: string;
        priority: string;
        state: string;
        date: string;
        operate: string;
    }

    const onClick: MenuProps['onClick'] = ({ key }) => {
        message.info(`Click on item ${key}`);
    };

    const items: MenuProps['items'] = [
        {
            label: '未定义',
            key: '1',
        },
        {
            label: '新增',
            key: '2',
        },
    ];

    const columns: ColumnsType<DataType> = [
        {
            title: '序号',
            dataIndex: 'serialNo',
            key: 'serialNo',
        },
        {
            title: '特性',
            dataIndex: 'feature',
            key: 'feature',
        },
        {
            title: '主题',
            dataIndex: 'theme',
            key: 'theme',
            render: (theme) => <a href="#">{theme}</a>,
        },
        {
            title: '优先级',
            dataIndex: 'priority',
            key: 'priority',
        },
        {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            render: (state) => {
                switch (state) {
                    case '未启动':
                        return (
                            <Space>
                                <Badge status="default" />
                                未启动
                            </Space>
                        );
                    case '已完成':
                        return (
                            <Space>
                                <Badge status="success" />
                                已完成
                            </Space>
                        );
                    case '冻结':
                        return (
                            <Space>
                                <Badge status="warning" />
                                冻结
                            </Space>
                        );
                    case '开发中':
                        return (
                            <Space>
                                <Badge status="processing" />
                                开发中
                            </Space>
                        );
                    default:
                        return null;
                }
            },
        },
        {
            title: '创建日期',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: '操作',
            dataIndex: 'operate',
            key: 'operate',
            render: () => (
                <div>
                    <a href="#">编辑</a>&ensp;&ensp;
                    <Dropdown menu={{ items, onClick }}>
                        <a onClick={(e) => e.preventDefault()}>
                            更多
                            <DownOutlined />
                        </a>
                    </Dropdown>
                </div>
            ),
        },
    ];

    const [size, setSize] = useState<SizeType>('large');
    return (
        <div className={'portal-card'}>
            <div className={'header resource-plan-header'}>
                <div className={'header-resource'}>资源规划</div>
                <div className={'header-button'}>
                    <Radio.Group
                        size={'small'}
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                    >
                        <Radio.Button>全部</Radio.Button>
                        <Radio.Button>进行中</Radio.Button>
                        <Radio.Button>已完成</Radio.Button>
                    </Radio.Group>
                    <Button size={'small'} style={{ marginLeft: '24px' }}>
                        新增
                    </Button>
                </div>
            </div>
            <div className={'container'}>
                <Table columns={columns} dataSource={list} pagination={false} />
            </div>
        </div>
    );
};
export default ResourcePlanCard;
