import React, { useEffect, useState } from "react";
import { Button, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { createTaskKbTask, deleteTask, getTaskList } from "@/services/task/api";
import { getTaskStatus } from "@/pages/Task/components/task-detail";
import { toShortDate } from "@/utils/common";
import DeleteBtn from "@/components/delete";
import CreateTaskDialog from "@/pages/Task/components/creation-dialog/create-task-dialog";

const TaskCard: React.FC<{ productName: string }> = ({ productName }) => {
    const [total, setTotal] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(6);
    const [pageNum, setPageNum] = useState<number>(1);
    const [data, setData] = useState<Task.Task[]>([]);

    const loadData = () => {
        getTaskList({ productName: [productName] }, pageSize, pageNum).then((d) => {
            setData(d.items);
            setTotal(d.total);
        });
    };

    useEffect(loadData, [productName, pageNum, pageSize]);

    const createKbTask = (id: number) => {
        createTaskKbTask(id).then(p => {
            if (!p.kanboardTask) {
                return
            }
            loadData()
        });
    }

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
        {
            title: '操作',
            align: 'center',
            width: 150,
            render: (v, task) => {
                return <>
                    <Button
                        size={'small'}
                        type={'link'}
                        disabled={task.cardId !== 0}
                        onClick={() => createKbTask(task.id)}
                    >
                        推送
                    </Button>
                    <DeleteBtn size={'small'}
                        type={'link'}
                        text={'删除'}
                        title={'删除任务'}
                        content={
                            <>
                                <div>确定要删除该待办任务吗？关联的卡片会被同步删除。</div>
                                <div>删除后可联系管理员恢复，请谨慎操作。</div>
                                <p>
                                    <a>
                                        #{task.id} {task.title}
                                    </a>
                                </p>
                            </>
                        }
                        onOk={() => {
                            deleteTask(task.id).then((rsp) => {
                                if (rsp.affectedRow === 0) {
                                    return;
                                }
                                loadData()
                            });
                        }}
                    />
                </>
            }
        }
    ];

    return <div className={'portal-card'}>
        <div className={'header splitter'}>
            <div className={'title'}>待办任务</div>
            <div className={'toolbar'}>
                <Space size={15}>
                    <CreateTaskDialog productName={productName} onClosed={console.log} />
                    <span className={'more'} onClick={() => window.open(`/task#/${productName}`, '_blank')}>
                        更多&gt;
                    </span>
                </Space>
            </div>
            {/*<span className={'more'} onClick={() => window.open(`/task#/${productName || ''}`, '_blank')}>*/}
            {/*    全部&gt;*/}
            {/*</span>*/}
        </div>
        <div className={'container'}>
            <Table
                columns={columns}
                dataSource={data}
                pagination={{
                    defaultCurrent: 1,
                    total: total,
                    size: 'default',
                    pageSize: pageSize,
                    current: pageNum,
                    showTotal: (total) => `总条数：${total}`,
                    onShowSizeChange: (current, size) => {
                        setPageSize(size);
                    },
                    onChange: (page: number, size: number) => {
                        setPageNum(page);
                        setPageSize(size);
                    },
                }}
                rowKey={(record) => record.id} size={'small'}
            />
        </div>
    </div>
}

export default TaskCard;
