import React, {useEffect, useState} from "react";
import {Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {getTaskList} from "@/services/task/api";
import {getTaskStatus} from "@/pages/Task/components/task-detail";
import {toShortDate} from "@/utils/common";

const TaskCard: React.FC<{ productName: string }> = ({productName}) => {
    const [data, setData] = useState<Task.Task[]>([]);

    useEffect(() => {
        getTaskList({productName: [productName]}, 10, 1)
            .then((rsp) => {
                setData(rsp.items);
            });
    }, [productName]);

    const columns: ColumnsType<Task.Task> = [
        {
            title: '序号',
            dataIndex: 'serialNo',
            align: 'center',
            width: 80,
            render: (v, r, i) => i + 1,
        },
        {
            title: '标题',
            dataIndex: 'title',
            ellipsis: true,
            render: (title, rows) =>
                <a href={`/task#/id/${rows.id}`} target={'_blank'} rel="noreferrer">{title}</a>
        },
        {
            title: '优先级',
            dataIndex: 'priority',
            align: 'center',
            width: 80,
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
            title: '截止日期',
            dataIndex: 'deadline',
            align: 'center',
            width: 100,
            render: toShortDate,
        },
    ];

    return <div className={'portal-card'}>
        <div className={'header'}>
            <div className={'title'}>待办任务</div>
            <span className={'more'} onClick={() => window.open(`/task#/${productName || ''}`, '_blank')}>
                全部&gt;
            </span>
        </div>
        <div className={'container'}>
            <Table columns={columns} dataSource={data} pagination={false} rowKey={(record) => record.id} size={'small'}/>
        </div>
    </div>
}

export default TaskCard;
