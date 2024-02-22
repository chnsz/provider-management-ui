import React, { useEffect, useState } from 'react';
import { Button, Modal, Space, Table, Tag } from "antd";
import { getOwnerUtRecordList } from "@/services/product/api";
import type { ColumnsType } from "antd/es/table/interface";
// @ts-ignore
import { Scrollbars } from 'react-custom-scrollbars';
import CodeEditor from "@/components/CodeEditor";

const OwnerUtListDialog: React.FC<{ content: any, owner: string, productName?: string }> = ({ content, owner, productName }) => {
    const [data, setData] = useState<Product.TestJobRecord[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);
    const [logContent, setLogContent] = useState<string>('');
    const [pageNum, setPageNum] = useState<number>(1);

    const showModal = () => {
        getOwnerUtRecordList(owner).then((d) => {
            if (productName) {
                const personalData = d.items.filter((item: any) => item.productName === productName);
                setData(personalData);
            } else {
                setData(d.items);
            }
        });
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {

    }, []);

    const columns: ColumnsType<Product.TestJobRecord> = [
        {
            title: '序号',
            dataIndex: 'sn',
            align: 'center',
            width: 80,
            render: (v, r, i) => i + 1 + (pageNum - 1) * 20,
        },
        {
            title: '产品服务',
            ellipsis: true,
            width: 180,
            dataIndex: 'productName',
        },
        {
            title: '名称',
            ellipsis: true,
            dataIndex: 'name',
            render: (v, row) => <span title={v + ', LogID: ' + row.id + ', JobID: ' + row.jobId}>
                {v} <span style={{ color: '#d5d5d5' }}>LogID: {row.id} JobID: {row.jobId}</span>
            </span>,
        },
        {
            title: '运行结果',
            width: 150,
            align: 'center',
            dataIndex: 'status',
            render: v => {
                switch (v) {
                    case 'InProgress':
                        return <Tag color="green">运行中</Tag>;
                    case 'Completed':
                        return <Tag color="blue">成功</Tag>;
                    case 'Failed':
                        return <Tag color="orange">失败</Tag>;
                }
                return v
            }
        },
        {
            title: '耗时',
            width: 150,
            align: 'center',
            dataIndex: 'timeCost',
        },
        {
            title: '开始时间',
            align: 'center',
            width: 220,
            dataIndex: 'startTime',
        },
        {
            title: '操作',
            dataIndex: 'operation',
            width: 200,
            align: 'center',
            render: (v, row) => {
                return <Space size={15}>
                    <a onClick={() => {
                        setLogContent(row.output);
                        setIsLogModalOpen(true);
                    }}>
                        日志
                    </a>
                    <a href={'/pgs/download/log/' + row.id} rel="noreferrer">下载文件</a>
                </Space>
            },
        }
    ];

    let title = '单元测试列表';
    if (owner && !productName) {
        title = '单元测试列表【' + owner + '】';
    }

    return (
        <>
            <div onClick={showModal} style={{ cursor: 'pointer' }}>{content}</div>
            <Modal title={title}
                destroyOnClose
                transitionName={''}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={1500}
                footer={[
                    <Button key="close" type="primary" onClick={handleOk}>关闭</Button>
                ]}>
                <Table
                    columns={columns}
                    dataSource={data}
                    size={'middle'}
                    pagination={{
                        defaultCurrent: 1,
                        total: data.length,
                        size: 'default',
                        pageSize: 20,
                        onChange: setPageNum,
                    }}
                    rowKey={r => r.id} />
            </Modal>

            <Modal title={'控制台日志'}
                destroyOnClose
                transitionName={''}
                open={isLogModalOpen}
                onOk={() => setIsLogModalOpen(false)}
                onCancel={() => setIsLogModalOpen(false)}
                width={'80%'}
                footer={[]}>
                <div style={{ height: '60vh' }}>
                    <CodeEditor language={'shell'} height={'60vh'} value={logContent} />
                </div>
            </Modal>
        </>
    );
}
    ;

export default OwnerUtListDialog;
