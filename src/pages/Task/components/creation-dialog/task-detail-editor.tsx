import Editor from '@/components/editor';
import {getProductList, getUserList} from '@/services/product/api';
import {Badge, DatePicker, Descriptions, Input, Select} from 'antd';
import type {SelectProps} from 'antd/es/select';
import React, {useEffect, useState} from 'react';
import dayjs from "dayjs";

export const priorityOptions = [
    {label: 'P0', value: 0},
    {label: 'P1', value: 1},
    {label: 'P2', value: 2},
    {label: 'P3', value: 3},
];

export const statusOptions = [
    {label: '未启动', value: 'new'},
    {label: '进行中', value: 'processing'},
    {label: '待合并', value: 'merging'},
    {label: '已合并', value: 'merged'},
    {label: '已关闭', value: 'closed'},
    {label: '冻结', value: 'freeze'},
];

export const getTaskStatus = (status: string) => {
    let color = '';
    let text = '';
    switch (status) {
        case 'new':
            color = 'lime';
            text = '未启动';
            break;
        case 'processing':
            text = '进行中';
            return <Badge status={'processing'} text={text}/>;
        case 'merging':
            text = '待合并';
            return <Badge status={'processing'} text={text}/>;
        case 'merged':
            text = '已合并';
            color = 'green';
            break;
        case 'closed':
            color = '#bfbfbf';
            text = '已关闭';
            break;
        case 'freeze':
            text = '冻结';
            color = 'gold';
            break;
    }
    return <Badge color={color} text={text}/>;
};

type TaskDetailProps = {
    task: Task.CreateOpts;
    onChange?: (opts: Task.CreateOpts) => any;
};

const TaskDetailEditor: React.FC<TaskDetailProps> = ({task, onChange}) => {
    const [productList, setProductList] = useState<SelectProps['options']>([]);
    const [ownerList, setOwnerList] = useState<SelectProps['options']>([]);

    useEffect(() => {
        getProductList().then((d) => {
            const arr = d.items
                .map((p: Product.Product) => p.productName)
                .map((productName: string) => {
                    return {
                        label: productName,
                        value: productName,
                    };
                });
            setProductList(arr);
        });
        getUserList().then((d) => {
            const arr = d.items.map((user: Product.User) => {
                return {
                    label: user.username,
                    value: user.username,
                };
            });
            setOwnerList(arr);
        });
    }, []);

    const onValChange = (field: string) => {

        if (!onChange) {
            return;
        }
        return (val: any) => {
            const updateOpts: Task.CreateOpts = {
                productName: task.productName,
                title: task.title,
                content: task.content,
                deadline: task.deadline,
                status: task.status,
                priority: task.priority,
                assignee: task.assignee,
            };
            switch (field) {
                case 'title':
                    if (updateOpts.title === val.target.value) {
                        return;
                    }
                    updateOpts.title = val.target.value;
                    break;
                case 'priority':
                    if (updateOpts.priority === val) {
                        return;
                    }
                    updateOpts.priority = val;
                    break;
                case 'status':
                    if (updateOpts.status === val) {
                        return;
                    }
                    updateOpts.status = val;
                    break;
                case 'assignee':
                    if (updateOpts.assignee === val) {
                        return;
                    }
                    updateOpts.assignee = val;
                    break;
                case 'productName':
                    if (updateOpts.productName === val) {
                        return;
                    }
                    updateOpts.productName = val;
                    break;
                case 'deadline':
                    if (updateOpts.deadline === val) {
                        return;
                    }
                    updateOpts.deadline = val + 'T00:00:00+08:00';
                    break;
                case 'content':
                    if (updateOpts.content === val) {
                        return;
                    }
                    updateOpts.content = val;
                    break;
            }
            onChange(updateOpts);
        };
    };


    return (
        <>
            <Descriptions column={4}>
                <Descriptions.Item label="所属服务" span={1}>
                    <Select size={'small'} style={{width: '200px'}}
                            showSearch
                            value={task.productName}
                            onChange={onValChange('productName')}
                            options={productList}
                    />
                </Descriptions.Item>
                <Descriptions.Item label="优先级" span={1}>
                    <Select size={'small'} style={{width: '200px'}}
                            value={task.priority}
                            onChange={onValChange('priority')}
                            options={priorityOptions}
                    />
                </Descriptions.Item>
                <Descriptions.Item label="责任人" span={1}>
                    <Select size={'small'} style={{width: '200px'}}
                            value={task.assignee}
                            onChange={onValChange('assignee')}
                            options={ownerList}
                    />
                </Descriptions.Item>
                <Descriptions.Item label="待办状态" span={1}>
                    <Select size={'small'} style={{width: '200px'}}
                            value={task.status}
                            onChange={onValChange('status')}
                            options={statusOptions}
                    />
                </Descriptions.Item>
                <Descriptions.Item label="标题" span={2}>
                    <Input value={task.title} onChange={onValChange('title')} size={'small'}
                           style={{width: '615px'}}
                    />
                </Descriptions.Item>
                <Descriptions.Item label="截止日期" span={1}>
                    <DatePicker value={task.deadline ? dayjs(task.deadline, 'YYYY-MM-DD') : undefined}
                                placeholder={''} size={'small'}
                                format={'YYYY-MM-DD'}
                                onChange={(d, s) => {
                                    const fun = onValChange('deadline');
                                    if (fun) {
                                        fun(s)
                                    }
                                }}
                    />
                </Descriptions.Item>
            </Descriptions>
            <div className={'custom-label'}>详细内容</div>
            <div style={{height: 'calc(100vh - 600px)', minHeight: '300px', marginTop: '8px'}}>
                <Editor defaultValue={task.content || ''} onChange={onValChange('content')}/>
            </div>
        </>
    );
};

export default TaskDetailEditor;
