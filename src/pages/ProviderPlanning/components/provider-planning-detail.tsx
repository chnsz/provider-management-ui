import EditableDes from '@/components/EditableDescription';
import Editor from '@/components/editor';
import RelationTabs from '@/pages/ProviderPlanning/components/relation-tabs';
import { getTaskStatus, priorityOptions, statusOptions } from '@/pages/Task/components/task-detail';
import { getProductFeatureList } from '@/services/product-feature/api';
import { getProductList, getUserList } from '@/services/product/api';
import { getProviderPlanning, updateProviderPlanning } from '@/services/provider-planning/api';
import { toLongDate } from '@/utils/common';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Badge, Descriptions, Tooltip } from 'antd';
import type { SelectProps } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import '../provider-planning.less';

type PlanningDetailProps = {
    providerPlanning: ProviderPlanning.ProviderPlanning;
    onChange: (p: ProviderPlanning.ProviderPlanning) => any;
};

export const getPlanningStatus = (status: string) => {
    let color = '';
    switch (status) {
        case 'new':
            color = 'lime';
            break;
        case 'processing':
        case 'merging':
            return <Badge status={'processing'} text={status} />;
        case 'merged':
        case 'closed':
            color = 'green';
            break;
        case 'freeze':
            color = 'gold';
            break;
    }
    return <Badge color={color} text={status} />;
};
const defaultSaveTip = '* 失去焦点后自动保存';
const ProviderPlanningDetail: React.FC<PlanningDetailProps> = ({ providerPlanning, onChange }) => {
    const [content, setContent] = useState<string>('');
    const [featureList, setFeatureList] = useState<SelectProps['options']>([]);
    const [productList, setProductList] = useState<SelectProps['options']>([]);
    const [ownerList, setOwnerList] = useState<SelectProps['options']>([]);
    const [saveTip, setSaveTip] = useState<string>(defaultSaveTip);
    const [planning, setPlanning] = useState<ProviderPlanning.ProviderPlanning>(providerPlanning);

    const loadFeature = (productName: string) => {
        getProductFeatureList({ productName: [productName] }, 1000, 1).then((d) => {
            const arr = d.items.map((t: ProductFeature.ProductFeature) => {
                return { label: t.name, value: t.id };
            });
            setFeatureList(arr);
        });
    };

    useEffect(() => {
        if (!providerPlanning?.id) {
            return;
        }
        getProviderPlanning(providerPlanning.id).then((data) => {
            setPlanning(data);
            setContent(data.content || '');
        });

        getProductList().then((d) => {
            const arr = d.items
                .map((p) => p.productName)
                .sort()
                .map((n) => {
                    return {
                        label: n,
                        value: n,
                    };
                });
            setProductList(arr);
        });

        loadFeature(providerPlanning.productName);

        getUserList().then((d) => {
            const arr = d.items.map((n) => {
                return {
                    label: n.username,
                    value: n.username,
                };
            });
            setOwnerList(arr);
        });
    }, [providerPlanning]);

    const onDetailChange = (fieldName: string) => {
        return (val: any) => {
            const updateOpts: ProviderPlanning.UpdateOption = {
                productName: planning.productName,
                title: planning.title,
                featureId: planning.featureId,
                content: planning.content,
                status: planning.status,
                priority: planning.priority,
                assignee: planning.assignee,
            };
            switch (fieldName) {
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
                case 'productName':
                    if (updateOpts.productName === val) {
                        return;
                    }
                    loadFeature(val);
                    updateOpts.productName = val;
                    break;
                case 'featureId':
                    if (updateOpts.featureId === val) {
                        return;
                    }
                    updateOpts.featureId = val;
                    break;
                case 'content':
                    if (updateOpts.content === val) {
                        return;
                    }
                    updateOpts.content = val;
                    break;
                case 'assignee':
                    if (updateOpts.assignee === val) {
                        return;
                    }
                    updateOpts.assignee = val;
                    break;
            }
            setSaveTip('* 保存中...');
            updateProviderPlanning(planning.id, updateOpts).then((t) => {
                setTimeout(() => setSaveTip('* 提交成功'), 1000);
                setTimeout(() => {
                    setSaveTip(defaultSaveTip);
                }, 2000);
                onChange(t);
            });
        };
    };

    const getKbTask = (p: ProviderPlanning.ProviderPlanning) => {
        if (!p.kanboardTask) {
            return <>未推送卡片</>;
        }
        const title: string = `#${p.kanboardTask.task.id} ${p.kanboardTask.task.title} (点击查询详细）`;
        return (
            <>
                <a href={p.kanboardTask.task.url} target={'_blank'} rel="noreferrer" title={title}>
                    {p.kanboardTask.column.title}
                </a>
                <span className={'custom-label kanboard-label'}>负责人: </span>
                {p.kanboardTask.userDto?.name}
            </>
        );
    };

    return (
        <div className={'provider-planning'}>
            <Descriptions column={4}>
                <Descriptions.Item label="所属服务" span={1}>
                    <EditableDes
                        value={planning.productName}
                        options={productList}
                        onChange={onDetailChange('productName')}
                    />
                </Descriptions.Item>
                <Descriptions.Item label="所属特性" span={1}>
                    <EditableDes
                        value={planning.feature?.id || ''}
                        options={featureList}
                        onChange={onDetailChange('featureId')}
                    >
                        {planning.feature?.name || ''}
                    </EditableDes>
                </Descriptions.Item>
                <Descriptions.Item label="优先级" span={1}>
                    <EditableDes
                        value={planning.priority}
                        options={priorityOptions}
                        onChange={onDetailChange('priority')}
                    >
                        <>P{planning.priority}</>
                    </EditableDes>
                </Descriptions.Item>
                <Descriptions.Item label="责任人" span={1}>
                    <EditableDes
                        value={planning.assignee || planning.creator || ''}
                        options={ownerList}
                        onChange={onDetailChange('assignee')}
                    />
                </Descriptions.Item>
                <Descriptions.Item label="标题" span={2}>
                    <EditableDes value={planning.title} onChange={onDetailChange('title')} />
                </Descriptions.Item>
                <Descriptions.Item label="待办状态" span={1}>
                    <EditableDes
                        value={planning.status}
                        options={statusOptions}
                        onChange={onDetailChange('status')}
                    >
                        {getTaskStatus(planning.status)}
                    </EditableDes>
                </Descriptions.Item>
                <Descriptions.Item label="卡片状态" span={1}>
                    {getKbTask(planning)}
                </Descriptions.Item>
            </Descriptions>

            <div className={'detail-info'}>
                <div className={'primary-info'}>
                    <div className={'label-name custom-label'}>
                        <div style={{ display: 'flex' }}>
                            <div style={{ flex: '1' }}>详细内容</div>
                            <div style={{ flex: '1', textAlign: 'right' }}>{saveTip}</div>
                        </div>
                    </div>
                    <div style={{ height: 'calc(100% - 45px)' }}>
                        <Editor defaultValue={content} onChange={onDetailChange('content')} />
                    </div>
                </div>
                <div className={'secondary-info'}>
                    <div className={'label-name custom-label'}>
                        关联的 API 和 Provider&nbsp;
                        <Tooltip
                            placement="top"
                            title={
                                '1、预计创建的 Provider：当所有资源发布后，本规划任务会被自动关闭。' +
                                '2、预计调用的 API：当 API 被调用后，因为 API 可以被多个资源调用，所以无法自动关闭本规划任务。'
                            }
                            arrow={true}
                        >
                            <InfoCircleOutlined />
                        </Tooltip>
                    </div>
                    <RelationTabs className={'relation-tabs'} planning={planning} />
                </div>
            </div>
            <Descriptions column={6}>
                <Descriptions.Item label="创建人" span={1}>
                    {planning.creator}
                </Descriptions.Item>
                <Descriptions.Item label="" span={3}>
                    <></>
                </Descriptions.Item>
                <Descriptions.Item label="创建时间" span={1}>
                    {toLongDate(planning.created)}
                </Descriptions.Item>
                <Descriptions.Item label="更新时间" span={1}>
                    {toLongDate(planning.updated)}
                </Descriptions.Item>
            </Descriptions>
        </div>
    );
};

export default ProviderPlanningDetail;
