import {Table} from 'antd';
import type {ColumnsType} from 'antd/es/table/interface';
import React, {useEffect, useState} from 'react';
import {getProviderPlanningList} from "@/services/provider-planning/api";
import {getTaskStatus} from "@/pages/Task/components/task-detail";
import {toShortDate} from "@/utils/common";

const ProviderPlanningCard: React.FC<{ productName: string }> = ({productName}) => {
    const [list, setList] = useState<ProviderPlanning.ProviderPlanning[]>([]);

    useEffect(() => {
        getProviderPlanningList({productName: [productName]}, 10, 1).then((rsp) => {
            setList(rsp.items);
        });
    }, [productName]);

    const columns: ColumnsType<ProviderPlanning.ProviderPlanning> = [
        {
            title: '序号',
            dataIndex: 'serialNo',
            align: 'center',
            width: 80,
            render: (v, r, i) => i + 1,
        },
        {
            title: '主题',
            dataIndex: 'title',
            ellipsis: true,
            render: (title, rows) =>
                <a href={`/provider-planning#/id/${rows.id}`} target={'_blank'} rel="noreferrer">{title}</a>
        },
        {
            title: '特性',
            dataIndex: 'feature',
            ellipsis: true,
            width: 150,
            render: (val) => val?.name || '',
        },
        {
            title: '优先级',
            dataIndex: 'priority',
            align: 'center',
            width: 90,
            render: (val) => 'P' + val,
        },
        {
            title: '状态',
            dataIndex: 'status',
            align: 'center',
            width: 90,
            render: getTaskStatus,
        },
        {
            title: '责任人',
            dataIndex: 'assignee',
            align: 'center',
            width: 90,
        },
        {
            title: '创建日期',
            dataIndex: 'created',
            align: 'center',
            width: 100,
            render: toShortDate,
        },
    ];

    return (
        <div className={'portal-card'}>
            <div className={'header'}>
                <div className={'title'}>资源规划</div>
                <span className={'more'} onClick={() => window.open(`/provider-planning#/${productName}`, '_blank')}>
                    全部&gt;
                </span>
            </div>
            <div className={'container'}>
                <Table size={'small'}
                       columns={columns}
                       dataSource={list}
                       pagination={false}
                       rowKey={(record) => record.id}
                />
            </div>
        </div>
    );
};
export default ProviderPlanningCard;
