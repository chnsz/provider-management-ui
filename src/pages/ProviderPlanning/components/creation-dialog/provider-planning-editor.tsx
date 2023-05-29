import Editor from '@/components/editor';
import {priorityOptions, statusOptions} from '@/pages/Task/components/task-detail';
import {getProductFeatureList} from '@/services/product-feature/api';
import {getProductList, getUserList} from '@/services/product/api';
import {InfoCircleOutlined} from '@ant-design/icons';
import {Descriptions, Input, Select, Tooltip} from 'antd';
import {DefaultOptionType, SelectProps} from 'antd/es/select';
import React, {useEffect, useState} from 'react';
import '../../provider-planning.less';
import {get} from "lodash";
import RelationTabs from "@/pages/ProviderPlanning/components/creation-dialog/relation-tabs";
import {getCurrentUser} from "@/services/api";

export type CreateOptions = {
    // 归属服务
    productName: string;
    // 标题
    title: string;
    // 特性ID
    featureId: string;
    featureName: string;
    // 详细内容
    content: string;
    // 状态
    status: string;
    //优先级
    priority: string;
    priorityStr: string;
    // 负责人
    assignee: string;
    // 同步到看板
    syncToKanboard: string;
    // 关联的 Provider
    providerList: Relation.ProviderRelation[];
    // 关联的 API
    apiList: Api.Detail[];
};

type PlanningDetailProps = {
    providerPlanning: CreateOptions;
    onChange: (opts: CreateOptions) => any;
};

const ProviderPlanningEditor: React.FC<PlanningDetailProps> = ({providerPlanning, onChange}) => {
    const [assignee, setAssignee] = useState<string>('')
    const [featureList, setFeatureList] = useState<SelectProps['options']>([]);
    const [productList, setProductList] = useState<SelectProps['options']>([]);
    const [ownerList, setOwnerList] = useState<SelectProps['options']>([]);

    const loadFeature = (productName: string) => {
        getProductFeatureList({productName: [productName]}, 1000, 1).then((d) => {
            const arr = d.items.map((t: ProductFeature.ProductFeature) => {
                return {label: t.name, value: t.id};
            });
            setFeatureList(arr);
        });
    };

    useEffect(() => {
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
        setAssignee(providerPlanning.assignee)
    }, [providerPlanning]);

    const onDetailChange = (fieldName: string) => {
        return (val: any, opts?: DefaultOptionType | DefaultOptionType[]) => {
            let updateOpts: CreateOptions = {
                productName: providerPlanning.productName,
                featureId: providerPlanning.featureId,
                featureName: providerPlanning.featureName,
                title: providerPlanning.title,
                priority: providerPlanning.priority,
                priorityStr: providerPlanning.priorityStr,
                status: providerPlanning.status,
                assignee: providerPlanning.assignee,
                content: providerPlanning.content,
                providerList: providerPlanning.providerList,
                apiList: providerPlanning.apiList,
                syncToKanboard: providerPlanning.syncToKanboard,
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
                    updateOpts.priorityStr = 'P' + val;
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
                    if (opts) {
                        updateOpts.featureName = get(opts, 'label') || '';
                    }
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
                    setAssignee(val);
                    break;
                case 'syncToKanboard':
                    if (updateOpts.syncToKanboard === val) {
                        return;
                    }
                    updateOpts.syncToKanboard = val;
                    break;
            }
            onChange(updateOpts);
        };
    };

    useEffect(() => {
        getCurrentUser().then(user => {
            if(user.username !== "") {
                setAssignee(user.username);
                onDetailChange('assignee')(user.username)
            }
        })
    },[]);

    const onApiRelationChange = (list: Api.Detail[]) => {
        let updateOpts: CreateOptions = {
            syncToKanboard: providerPlanning.syncToKanboard,
            productName: providerPlanning.productName,
            featureId: providerPlanning.featureId,
            featureName: providerPlanning.featureName,
            title: providerPlanning.title,
            priority: providerPlanning.priority,
            priorityStr: providerPlanning.priorityStr,
            status: providerPlanning.status,
            assignee: providerPlanning.assignee,
            content: providerPlanning.content,
            providerList: providerPlanning.providerList,
            apiList: list,
        };
        onChange(updateOpts);
    }

    const onProviderRelationChange = (list: Relation.ProviderRelation[]) => {
        let updateOpts: CreateOptions = {
            syncToKanboard: providerPlanning.syncToKanboard,
            productName: providerPlanning.productName,
            featureId: providerPlanning.featureId,
            featureName: providerPlanning.featureName,
            title: providerPlanning.title,
            priority: providerPlanning.priority,
            priorityStr: providerPlanning.priorityStr,
            status: providerPlanning.status,
            assignee: providerPlanning.assignee,
            content: providerPlanning.content,
            providerList: list,
            apiList: providerPlanning.apiList,
        };
        onChange(updateOpts);
    }

    return (
        <div className={'provider-planning'}>
            <div>
                <div>

                </div>
            </div>
            <Descriptions column={4}>
                <Descriptions.Item label="所属服务" span={1}>
                    <Select size={'small'} style={{width: '200px'}}
                            showSearch
                            defaultValue={providerPlanning.productName}
                            onChange={onDetailChange('productName')}
                            options={productList}
                    ></Select>
                </Descriptions.Item>
                <Descriptions.Item label="所属特性" span={1}>
                    <Select size={'small'} style={{width: '200px'}}
                            showSearch
                            defaultValue={providerPlanning.featureId}
                            onChange={onDetailChange('featureId')}
                            options={featureList}
                    ></Select>
                </Descriptions.Item>
                <Descriptions.Item label={<>&nbsp;&nbsp;&nbsp;&nbsp;优先级</>} span={1}>
                    <Select size={'small'} style={{width: '200px'}}
                            defaultValue={providerPlanning.priority}
                            onChange={onDetailChange('priority')}
                            options={priorityOptions}
                    ></Select>
                </Descriptions.Item>
                <Descriptions.Item label="责任人" span={1}>
                    <Select size={'small'} style={{width: '200px'}}
                            value={assignee}
                            onChange={onDetailChange('assignee')}
                            options={ownerList}
                    ></Select>
                </Descriptions.Item>
                <Descriptions.Item label="标题" span={2}>
                    <Input value={providerPlanning.title} onChange={(e) => onDetailChange('title')(e.target.value)}
                           size={'small'}
                           style={{width: '615px'}}
                    ></Input>
                </Descriptions.Item>
                <Descriptions.Item label="同步到看板" span={1}>
                    <Select size={'small'} style={{width: '185px'}}
                            defaultValue={'yes'}
                            onChange={onDetailChange('syncToKanboard')}
                            options={[
                                {label: '同步创建', value: 'yes'},
                                {label: '不同步', value: 'no'},
                            ]}
                    ></Select>
                </Descriptions.Item>
                <Descriptions.Item label="待办状态" span={1}>
                    <Select size={'small'} style={{width: '200px'}}
                            defaultValue={providerPlanning.status}
                            onChange={onDetailChange('status')}
                            options={statusOptions}
                    ></Select>
                </Descriptions.Item>
            </Descriptions>

            <div className={'detail-info'}>
                <div className={'primary-info'}>
                    <div className={'label-name custom-label'}>
                        <div style={{flex: '1'}}>详细内容</div>
                    </div>
                    <div style={{height: 'calc(100% - 45px)'}}>
                        <Editor defaultValue={providerPlanning.content} onChange={onDetailChange('content')}/>
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
                            <InfoCircleOutlined/>
                        </Tooltip>
                    </div>
                    <RelationTabs createOptions={providerPlanning}
                                  onApiRelationChange={onApiRelationChange}
                                  onProviderRelationChange={onProviderRelationChange}/>
                </div>
            </div>
        </div>
    );
};

export default ProviderPlanningEditor;
