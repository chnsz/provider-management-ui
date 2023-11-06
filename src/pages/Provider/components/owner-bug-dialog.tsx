import React, {useEffect, useState} from 'react';
import {Button, Modal, Table} from "antd";
import type {ColumnsType} from "antd/es/table/interface";
import {getProviderBugs} from "@/services/provider/api";
import {toShortDate} from "@/utils/common";

const OwnerBugListDialog: React.FC<{ content: any, owner: string }> = ({content, owner}) => {
    const [data, setData] = useState<Provider.Bug[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        getProviderBugs(owner).then((d) => {
            setData(d.items);
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

    const columns: ColumnsType<Provider.Bug> = [
        {
            title: '序号',
            dataIndex: 'sn',
            align: 'center',
            width: 80,
            render: (v, r, i) => i + 1,
        },
        {
            title: '产品服务',
            ellipsis: true,
            width: 200,
            dataIndex: 'productName',
        },
        {
            title: '标题',
            ellipsis: true,
            dataIndex: 'title',
        },
        {
            title: '资源类型',
            ellipsis: true,
            width: 120,
            dataIndex: 'providerType',
        },
        {
            title: '资源名称',
            ellipsis: true,
            dataIndex: 'providerName',
        },
        {
            title: '创建时间',
            dataIndex: 'created',
            width: 120,
            align: 'center',
            render: toShortDate
        }
    ];

    return (
        <>
            <Button type={'link'} onClick={showModal} danger={content > 0}>{content}</Button>
            <Modal title={'资源问题列表【' + owner + '】'}
                   transitionName={''}
                   open={isModalOpen}
                   onOk={handleOk}
                   onCancel={handleCancel}
                   width={1500}
                   footer={[
                       <Button key="close" type="primary" onClick={handleOk}>关闭</Button>
                   ]}>
                <Table columns={columns} dataSource={data} size={'middle'} pagination={false}/>
            </Modal>
        </>
    );
};

export default OwnerBugListDialog;
