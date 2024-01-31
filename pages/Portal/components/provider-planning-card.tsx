import { Button, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table/interface';
import React, { useEffect, useState } from 'react';
import { createPlanningKbTask, deleteProviderPlanning, getProviderPlanningList } from "@/services/provider-planning/api";
import { getTaskStatus } from "@/pages/Task/components/task-detail";
import { toShortDate } from "@/utils/common";
import AddFeaturePlanningDialog from "@/pages/ProviderPlanning/components/creation-dialog/add-feature-planning-dialog";
import PlanningViewDialog from "@/pages/ProviderPlanning/components/creation-dialog/planning-view-dialog";
import DeleteBtn from "@/components/delete";

const ProviderPlanningCard: React.FC<{ productName: string }> = ({ productName }) => {
    const [total, setTotal] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const [pageNum, setPageNum] = useState<number>(1);
    const [list, setList] = useState<ProviderPlanning.ProviderPlanning[]>([]);

    const loadData = () => {
        getProviderPlanningList({ productName: [productName] }, pageSize, pageNum).then((d) => {
            setList(d.items);
            setTotal(d.total);
        });
    };

    useEffect(() => {
        loadData()
    }, [pageNum, pageSize]);

    useEffect(loadData, [productName]);

    const createKbTask = (id: number) => {
        createPlanningKbTask(id).then(p => {
            if (!p.kanboardTask) {
                return
            }
            loadData()
        });
    }

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
        {
            title: '操作',
            align: 'center',
            width: 150,
            render: (v, record) => {
                return <>
                    <PlanningViewDialog planning={record} onClosed={loadData} />
                    <Button
                        size={'small'}
                        type={'link'}
                        disabled={record.cardId !== 0}
                        onClick={() => createKbTask(record.id)}
                    >
                        推送
                    </Button>
                    <DeleteBtn size={'small'}
                        type={'link'}
                        text={'删除'}
                        title={'删除资源规划'}
                        content={
                            <>
                                <div>确定要删除该资源规划吗？关联的卡片会被同步删除。</div>
                                <div>删除后可联系管理员恢复，请谨慎操作。</div>
                                <p>
                                    <a>
                                        #{record.id} {record.title}
                                    </a>
                                </p>
                            </>
                        }
                        onOk={() => {
                            deleteProviderPlanning(record.id).then(rsp => {
                                if (rsp.affectedRow === 0) {
                                    return
                                }
                                loadData()
                            });
                        }}
                    />
                </>
            }
        }
    ];

    return (
        <div className={'portal-card'}>
            <div className={'header splitter'}>
                <div className={'title'}>资源规划</div>
                <div className={'toolbar'}>
                    <Space size={15}>
                        <AddFeaturePlanningDialog productName={productName} onClosed={loadData} />
                        <span className={'more'}
                            onClick={() => window.open(`/provider-planning#/${productName}`, '_blank')}
                        > 更多&gt;</span>
                    </Space>
                </div>
            </div>
            <div className={'container'}>
                <Table size={'small'}
                    columns={columns}
                    dataSource={list}
                    rowKey={(record) => record.id}
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
                />
            </div>
        </div>
    );
};
export default ProviderPlanningCard;
