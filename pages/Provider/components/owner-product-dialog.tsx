import React, {useEffect, useState} from 'react';
import {InfoCircleOutlined, SafetyCertificateOutlined} from "@ant-design/icons";
import {Button, Divider, Modal, Select, Table, Tag} from "antd";
import {getProductList} from "@/services/product/api";
import {ProSchemaValueEnumObj} from "@ant-design/pro-utils/es/typing";
import type {ColumnsType} from "antd/es/table/interface";

const OwnerProductDialog: React.FC<{ content: any, owner: string }> = ({content, owner}) => {
    const [data, setData] = useState<Product.Product[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        getProductList(owner).then((d) => {
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

    const columns: ColumnsType<Product.Product> = [
        {
            title: '序号',
            dataIndex: 'sn',
            align: 'center',
            width: 80,
            render: (v, r, i) => i + 1,
        },
        {
            title: '产品部',
            dataIndex: 'productGroup',
            width: '20%',
        },
        {
            title: '服务',
            dataIndex: 'productNameC',
            width: '20%',
            render: (v: any, row) => row.productNameC + ' / ' + row.productNameCZh,
        },
        {
            title: '服务（API Explorer）',
            dataIndex: 'productName',
            width: '20%',
            render: (v, row) => row.productName + ' / ' + row.productNameZh,
        },
        {
            title: '服务分级',
            dataIndex: 'level',
            align: 'center',
            width: '10%',
        },
        {
            title: 'API数量',
            dataIndex: 'apiCount',
            align: 'center',
            width: '10%',
        },
        {
            title: '状态',
            dataIndex: 'statusCode',
            align: 'center',
            render: v => {
                switch (v) {
                    case 'active':
                        return <Tag color="blue">API 监听中</Tag>;
                    case 'ignore':
                        return <Tag color="orange">不监听</Tag>;
                }
                return v
            }
        },
    ];

    return (
        <>
            <div style={{cursor: 'pointer'}} onClick={showModal}>{content}</div>
            <Modal title={'服务列表【' + owner + '】'}
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

export default OwnerProductDialog;
