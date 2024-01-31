import React, {useEffect, useState} from 'react';
import {Button, Modal, Table, Tag} from "antd";
import type {ColumnsType} from "antd/es/table/interface";
import {getProviderByOwner} from "@/services/provider/api";

export const getUTColor = (val: number) => {
    let color = '';
    if (val < 50) {
        color = 'red';
    } else if (val >= 50 && val < 60) {
        color = '#faad14';
    } else if (val >= 60 && val < 80) {
        color = 'blue';
    } else if (val >= 80) {
        color = 'green';
    }
    return color;
}

const OwnerProviderDialog: React.FC<{ content: any, owner: string }> = ({content, owner}) => {
    const [data, setData] = useState<Provider.Provider[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        getProviderByOwner(owner).then((d) => {
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

    const columns: ColumnsType<Provider.Provider> = [
        {
            title: '序号',
            dataIndex: 'sn',
            align: 'center',
            width: 80,
            render: (v, r, i) => i + 1,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            ellipsis: true,
            width: 400,
        },
        {
            title: '资源类型',
            dataIndex: 'type',
            width: 120,
        },
        {
            title: '资源名称',
            dataIndex: 'name',
            ellipsis: true,
        },
        {
            title: 'UT覆盖率（%）',
            dataIndex: 'utCoverage',
            align: 'center',
            width: 140,
            render: v => {
                const color = getUTColor(v)
                return <span style={{color: color}}>{v}</span>
            },
        },
        {
            title: '是否基线',
            dataIndex: 'baseApiTag',
            align: 'center',
            width: 140,
            render: v => {
                switch (v) {
                    case 'yes':
                        return <Tag color="blue">已基线</Tag>;
                    case 'no':
                        return <Tag color="orange">未基线</Tag>;
                }
                return v
            }
        },
    ];

    return (
        <>
            <div style={{cursor: 'pointer'}} onClick={showModal}>{content}</div>
            <Modal title={'资源列表【' + owner + '】'}
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

export default OwnerProviderDialog;
