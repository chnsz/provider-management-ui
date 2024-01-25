import React, { useEffect, useState } from "react";
import { getCloudName } from "@/global";
import { Modal, Space, Table, Tooltip, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { closeApiMonitor, deleteApiMonitor, getApiMonitorList, openApiMonitor } from "@/services/provider/api";
import { toShortDate } from "@/utils/common";
import DeleteBtn from "@/components/delete";

const MonitorListDialog: React.FC<{
    content: any,
    cloudName: string,
    relationType: string,
    providerType: string,
    providerName: string,
    onClose: () => any,
}> = ({ content, cloudName, providerType, providerName, relationType, onClose }) => {
    const [dataSource, setDataSource] = useState<Provider.ApiMonitor[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const [total, setTotal] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(20);
    const [pageNum, setPageNum] = useState<number>(1);

    const loadData = (pageSize: number, pageNum: number) => {
        getApiMonitorList({ cloudName, providerType, providerName, relationType }, pageSize, pageNum).then(t => {
            setDataSource(t.items);
            setTotal(t.total);
        });
    }

    useEffect(() => {
        if (isModalOpen) {
            loadData(pageSize, pageNum);
        }
    }, [pageSize, pageNum]);

    const onOpenMonitor = (row: Provider.ApiMonitor) => {
        if (!row.id) {
            return
        }
        openApiMonitor(row.id).then(() => loadData(pageSize, pageNum));
    }

    const onCloseMonitor = (row: Provider.ApiMonitor) => {
        if (!row.id) {
            return
        }
        closeApiMonitor(row.id).then(() => loadData(pageSize, pageNum));
    }

    const onDeleteMonitor = (row: Provider.ApiMonitor) => {
        if (!row.id) {
            return
        }
        deleteApiMonitor(row.id).then(() => loadData(pageSize, pageNum));
    }

    const showModal = () => {
        loadData(pageSize, pageNum);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        if (onClose) {
            onClose();
        }
    };

    const columns: ColumnsType<Provider.ApiMonitor> = [
        {
            title: '序号',
            dataIndex: 'id',
            width: 70,
            align: 'center',
            render: (v, r, i) => (pageNum - 1) * pageSize + i + 1,
        },
        {
            title: '监控类型',
            dataIndex: 'type',
            width: 100,
            align: 'center',
            ellipsis: true,
        },
        {
            title: '资源类型',
            width: 100,
            dataIndex: 'providerType',
        },
        {
            title: '资源名称',
            dataIndex: 'providerName',
            width: '15%',
            ellipsis: true,
        },
        {
            title: '服务名称',
            width: 90,
            ellipsis: true,
            align: 'center',
            dataIndex: 'productName',
        },
        {
            title: 'URI',
            ellipsis: true,
            width: '20%',
            dataIndex: 'uriShort',
            render: (v, row) => {
                if (row.type === 'Service') {
                    return '';
                }
                return <span>[{row.method}] {v}</span>;
            },
        },
        {
            title: '字段位置',
            width: 100,
            ellipsis: true,
            align: 'center',
            dataIndex: 'fieldIn',
        },
        {
            title: '字段名称',
            width: '15%',
            ellipsis: true,
            dataIndex: 'fieldName',
        },
        {
            title: '监控分组',
            width: '10%',
            ellipsis: true,
            dataIndex: 'groupName',
        },
        {
            title: '状态',
            width: 90,
            align: 'center',
            dataIndex: 'status',
            render: (v) => {
                if (v === 'open') {
                    return <Tag color="purple">监控中</Tag>;
                } else if (v === 'closed') {
                    return <Tag color="green">已上线</Tag>;
                } else if (v === 'manually-closed') {
                    return <Tag color="blue">关闭</Tag>;
                }
                return v

            },
        },
        {
            title: '创建日期',
            width: 100,
            align: 'center',
            dataIndex: 'created',
            render: toShortDate
        },
        {
            title: '操作',
            width: 120,
            align: 'center',
            dataIndex: 'count',
            render: (v, row) => {
                let btn1 = <></>
                if (row.status === 'open' || row.status === 'monitoring') {
                    btn1 = <a onClick={() => onCloseMonitor(row)}>关闭</a>
                } else if (row.status === 'closed') {
                    btn1 = <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                } else if (row.status === 'manually-closed') {
                    btn1 = <a onClick={() => onOpenMonitor(row)}>开启</a>
                }

                return <Space size={15}>
                    {btn1}
                    <DeleteBtn text={'删除'}
                        title={'删除确认'}
                        link
                        content={<div>确定要删除吗？删除后不可恢复</div>}
                        onOk={() => onDeleteMonitor(row)}
                    />
                </Space>;
            },
        }
    ];

    return (
        <>
            <Tooltip title={content}>
                <a onClick={showModal} style={{ cursor: 'pointer' }}>{content}</a>
            </Tooltip>
            <Modal title={`查看监听列表【${getCloudName(cloudName)}】`}
                destroyOnClose
                transitionName={''}
                open={isModalOpen}
                onOk={handleCancel}
                onCancel={handleCancel}
                width={'85%'}
                footer={[]}>
                <Space size={20} direction={'vertical'} style={{ width: '100%' }}>
                    <Table dataSource={dataSource} columns={columns} size={'middle'}
                        rowKey={(record) => record.id + ''}
                        pagination={{
                            defaultCurrent: 1,
                            total: total,
                            size: 'default',
                            pageSize: pageSize,
                            current: pageNum,
                            showTotal: (total) => `总条数: ${total}`,
                            onShowSizeChange: (current, size) => {
                                setPageSize(size);
                            },
                            onChange: (page, size) => {
                                setPageSize(size);
                                setPageNum(page);
                            },
                        }}
                    />
                </Space>
            </Modal>
        </>
    );
}

export default MonitorListDialog;
