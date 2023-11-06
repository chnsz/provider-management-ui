import EditableDes from '@/components/EditableDescription';
import Editor from '@/components/editor';
import {getProductList, getUserList} from '@/services/product/api';
import {toLongDate, toShortDate} from '@/utils/common';
import {Badge, Descriptions} from 'antd';
import type {SelectProps} from 'antd/es/select';
import React, {useEffect, useState} from 'react';

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
    task: Task.Task;
    onChange?: (opts: Task.UpdateOpts) => any;
};

const TaskDetail: React.FC<TaskDetailProps> = ({task, onChange}) => {
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
            const updateOpts: Task.UpdateOpts = {
                id: task.id,
                productName: task.productName,
                title: task.title,
                content: task.content,
                deadline: task.deadline,
                status: task.status,
                priority: task.priority,
                cardId: task.cardId,
                assignee: task.assignee,
            };
            switch (field) {
                case 'title':
                    if (updateOpts.title === val) {
                        return;
                    }
                    updateOpts.title = val;
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

    const getKbTask = (t: Task.Task) => {
        if (!t.kanboardTask) {
            return <>未推送卡片</>;
        }
        const title: string = `#${t.kanboardTask.task.id} ${t.kanboardTask.task.title} (点击查询详细）`;
        return (
            <>
                <a href={t.kanboardTask.task.url} target={'_blank'} rel="noreferrer" title={title}>
                    {t.kanboardTask.column.title}
                </a>
                <span className={'custom-label kanboard-label'}>负责人: </span>
                {t.kanboardTask.userDto?.name}
            </>
        );
    };

    return (
        <>
            <Descriptions column={4}>
                <Descriptions.Item label="所属服务" span={1}>
                    <EditableDes
                        value={task.productName}
                        options={productList}
                        onChange={onValChange('productName')}
                    />
                </Descriptions.Item>
                <Descriptions.Item label="优先级" span={1}>
                    <EditableDes
                        value={task.priority}
                        options={priorityOptions}
                        onChange={onValChange('priority')}
                    >
                        <>P{task.priority}</>
                    </EditableDes>
                </Descriptions.Item>
                <Descriptions.Item label="责任人" span={1}>
                    <EditableDes
                        value={task.assignee || ''}
                        options={ownerList}
                        onChange={onValChange('assignee')}
                    />
                </Descriptions.Item>
                <Descriptions.Item label="待办状态" span={1}>
                    <EditableDes
                        value={task.status}
                        options={statusOptions}
                        onChange={onValChange('status')}
                    >
                        {getTaskStatus(task.status)}
                    </EditableDes>
                </Descriptions.Item>
                <Descriptions.Item label="标题" span={2}>
                    <EditableDes value={task.title} onChange={onValChange('title')}/>
                </Descriptions.Item>
                <Descriptions.Item label="截止日期" span={1}>
                    <EditableDes
                        value={toShortDate(task.deadline)}
                        type={'date'}
                        onChange={onValChange('deadline')}
                    >
                        {toShortDate(task.deadline)}
                    </EditableDes>
                </Descriptions.Item>
                <Descriptions.Item label="卡片状态" span={1}>
                    {getKbTask(task)}
                </Descriptions.Item>
            </Descriptions>
            <div className={'custom-label'}>详细内容</div>
            <div style={{height: 'calc(100vh - 600px)', minHeight: '300px', marginTop: '8px'}}>
                <Editor defaultValue={task.content || ''} onChange={onValChange('content')}/>
            </div>
            <Descriptions column={6}>
                <Descriptions.Item label="创建人" span={1}>
                    {task.creator}
                </Descriptions.Item>
                <Descriptions.Item label="" span={3}>
                    <></>
                </Descriptions.Item>
                <Descriptions.Item label="创建时间" span={1}>
                    {toLongDate(task.created)}
                </Descriptions.Item>
                <Descriptions.Item label="更新时间" span={1}>
                    {toLongDate(task.updated)}
                </Descriptions.Item>
            </Descriptions>
        </>
    );
};

export default TaskDetail;
