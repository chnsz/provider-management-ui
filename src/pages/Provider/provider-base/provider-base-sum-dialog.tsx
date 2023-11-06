import React, {useState} from "react";
import {getProviderApiBaseSum} from "@/services/provider/api";
import type {ColumnsType} from "antd/es/table/interface";
import {Button, Modal, Table} from "antd";
import ProviderBaseDialog from "@/pages/Provider/provider-base/provider-base-dialog";

const ProviderBaseSumDialog: React.FC<{
    providerType: string,
    providerName: string,
    text: any,
    onClosed?: () => any,
}> = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState<Provider.ProviderBaseSum[]>([]);

    const loadData = () => {
        getProviderApiBaseSum(props.providerType, props.providerName).then(data => {
            setData(data.items);
        });
    }
    const showModal = () => {
        setIsModalOpen(true);
        loadData()
    };

    const handleOk = () => {
        setIsModalOpen(false);
        if (props.onClosed) {
            props.onClosed();
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        if (props.onClosed) {
            props.onClosed();
        }
    };

    const renderNum = (v: any) => {
        if (!v) {
            return ''
        }
        return v
    }

    const columns: ColumnsType<Provider.ProviderBaseSum> = [
        {
            title: '资源类型',
            dataIndex: 'providerType',
            width: '6%',
        },
        {
            title: '资源名称',
            dataIndex: 'providerName',
            ellipsis: true,
            width: '15%',
        },
        {
            title: 'API名称',
            dataIndex: 'apiDetail',
            width: '18%',
            ellipsis: true,
            render: (v, row) => {
                if (row.apiDetail) {
                    return <ProviderBaseDialog
                        text={row.apiDetail.apiName + ' / ' + row.apiDetail.apiNameEn}
                        apiId={row.apiId}
                        apiName={row.apiDetail.apiName + ' / ' + row.apiDetail.apiNameEn}
                        onClosed={loadData}
                        providerType={row.providerType}
                        providerName={row.providerName}/>
                }
                return ''
            },
        },
        {
            title: '未分析字段',
            width: '7%',
            dataIndex: 'newField',
            align: 'center',
            render: renderNum,
        },
        {
            title: '废弃字段',
            width: '7%',
            dataIndex: 'deprecated',
            align: 'center',
            render: renderNum,
        },
        {
            title: '类型变更',
            width: '7%',
            dataIndex: 'typeChange',
            align: 'center',
            render: renderNum,
        },
        {
            title: '描述变更',
            width: '7%',
            dataIndex: 'descChange',
            align: 'center',
            render: renderNum,
        },
        {
            title: '类型 & 描述变更',
            width: '7%',
            dataIndex: 'typeAndDescChange',
            align: 'center',
            render: renderNum,
        },
        {
            title: '未使用的字段',
            width: '7%',
            dataIndex: 'notUsed',
            align: 'center',
            render: renderNum,
        },
        {
            title: '已用的字段',
            width: '7%',
            dataIndex: 'used',
            align: 'center',
            render: renderNum,
        },
    ];

    return <>
        <a onClick={showModal} title={props.text}>{props.text}</a>
        <Modal title="API 字段变更分析"
               open={isModalOpen}
               onOk={handleOk}
               onCancel={handleCancel}
               transitionName={''}
               destroyOnClose
               width={1600}
               footer={[
                   <Button key="save" type="primary" onClick={handleOk}>关闭</Button>
               ]}>
            <Table
                columns={columns}
                dataSource={data}
                size={'middle'}
                pagination={false}
                rowKey={r => r.apiId + '_' + r.providerType + '_' + r.providerName}
            />
        </Modal>
    </>
}

export default ProviderBaseSumDialog;
