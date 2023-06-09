import React, {useState} from "react";
import Provider from "@/pages/Provider";
import {getProviderApiBaseSum} from "@/services/provider/api";
import {ColumnsType} from "antd/es/table/interface";
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
            width: '14%',
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
            render: renderNum,
        },
        {
            title: '废弃字段',
            width: '7%',
            dataIndex: 'deprecated',
            render: renderNum,
        },
        {
            title: '仅类型变更',
            width: '7%',
            dataIndex: 'typeChange',
            render: renderNum,
        },
        {
            title: '仅描述变更',
            width: '7%',
            dataIndex: 'descChange',
            render: renderNum,
        },
        {
            title: '类型 & 描述变更',
            width: '7%',
            dataIndex: 'typeAndDescChange',
            render: renderNum,
        },
        {
            title: '未使用的字段',
            width: '7%',
            dataIndex: 'notUsed',
            render: renderNum,
        },
        {
            title: '已用的字段',
            width: '7%',
            dataIndex: 'used',
            render:renderNum,
        },
    ];

    return <>
        <Button type={'link'} onClick={showModal}>{props.text}</Button>
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
                size={'small'}
                pagination={false}
                rowKey={r => r.apiId + '_' + r.providerType + '_' + r.providerName}
            />
        </Modal>
    </>
}

export default ProviderBaseSumDialog;
