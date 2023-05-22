import React, {useState} from "react";
import {Button, Modal, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {toLongDate} from "@/utils/common";
import {getPrList} from "@/services/provider/api";

const PrListDialog: React.FC<{
    owner: string,
    providerType: string,
    providerName: string,
    val: string | number,
}> = (props) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [data, setData] = useState<Provider.PullRequest[]>([])

    const handleOk = () => {
        setIsDialogOpen(false);
    };
    const handleCancel = () => {
        setIsDialogOpen(false);
    };
    const openDialog = () => {
        setIsDialogOpen(true)
        getPrList(props.owner, props.providerType, props.providerName).then(data => {
            setData(data.items);
        });
    }

    const columns: ColumnsType<Provider.PullRequest> = [
        {
            title: '序号',
            dataIndex: 'sn',
            align: 'center',
            width: 80,
            render: (v, r, i) => i + 1,
        },
        {
            title: 'PR信息',
            dataIndex: 'title',
            ellipsis: true,
            render: (title, record) => <a
                href={`https://github.com/huaweicloud/terraform-provider-huaweicloud/pull/${record.prNumber}`}
                target={'_blank'} rel="noreferrer"
            >#{record.prNumber} {title}</a>,
        },
        {
            title: '合并日期',
            dataIndex: 'mergedAt',
            align: 'center',
            width: 200,
            render: toLongDate
        },
        {
            title: '创建日期',
            dataIndex: 'created',
            align: 'center',
            width: 200,
            render: toLongDate
        },
    ]
    return <>
        <a onClick={openDialog}>{props.val} </a>
        <Modal title="PR列表"
               destroyOnClose
               width={1200}
               transitionName={''}
               open={isDialogOpen}
               onOk={handleOk}
               onCancel={handleCancel}
               footer={[
                   <Button key="close" type="primary" onClick={handleOk}>关闭</Button>
               ]}>
            <Table columns={columns} dataSource={data} size={'small'} pagination={{
                defaultPageSize: 20,
                defaultCurrent: 1
            }}/>
        </Modal>
    </>
}

export default PrListDialog;


