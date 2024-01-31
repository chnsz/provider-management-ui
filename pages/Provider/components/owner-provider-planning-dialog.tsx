import React, {useEffect, useState} from 'react';
import {InfoCircleOutlined, SafetyCertificateOutlined} from "@ant-design/icons";
import {Button, Divider, Modal, Select, Table, Tag} from "antd";
import {getProductList} from "@/services/product/api";
import {ProSchemaValueEnumObj} from "@ant-design/pro-utils/es/typing";
import type {ColumnsType} from "antd/es/table/interface";
import ApiDialogList from "@/pages/Portal/components/api-dialog-list";
import {getProviderByOwner} from "@/services/provider/api";
import {getProviderPlanningListByOwner} from "@/services/provider-planning/api";
import {toShortDate} from "@/utils/common";
import {getTaskStatus} from "@/pages/Task/components/task-detail";

const OwnerProviderPlanningDialog: React.FC<{ content: any, owner: string }> = ({content, owner}) => {
    const [data, setData] = useState<ProviderPlanning.ProviderPlanning[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        getProviderPlanningListByOwner(owner).then((d) => {
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

    const columns: ColumnsType<ProviderPlanning.ProviderPlanning> = [
        {
            title: '序号',
            dataIndex: 'sn',
            align: 'center',
            width: 80,
            render: (v, r, i) => i + 1,
        },
        {
            title: '标题',
            dataIndex: 'title',
            render: (v, row) => {
                return <a href={'/provider-planning#/id/' + row.id} target="_blank" rel="noopener noreferrer">{v}</a>
            }
        },
        {
            title: '状态',
            dataIndex: 'status',
            render: v => getTaskStatus(v),
            align: 'center',
            width: 100,
        },
        {
            title: '创建时间',
            dataIndex: 'created',
            width: 150,
            align: 'center',
            render: toShortDate
        }
    ];

    return (
        <>
            <div style={{cursor: 'pointer'}} onClick={showModal}>
                <Button type={'link'}>{content}</Button>
            </div>
            <Modal title={'资源规划列表【' + owner + '】'}
                   transitionName={''}
                   open={isModalOpen}
                   onOk={handleOk}
                   onCancel={handleCancel}
                   width={1000}
                   footer={[
                       <Button key="close" type="primary" onClick={handleOk}>关闭</Button>
                   ]}>
                <Table columns={columns} dataSource={data} size={'middle'} pagination={false}/>
            </Modal>
        </>
    );
};

export default OwnerProviderPlanningDialog;
