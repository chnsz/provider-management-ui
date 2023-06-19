import React, {useEffect, useState} from "react";
import {getProviderBaseAllSum} from "@/services/provider/api";
import {ColumnsType} from "antd/es/table/interface";
import {Breadcrumb, Space, Table} from "antd";
import Provider from "@/pages/Provider/index";
import ProviderBaseSumDialog from "@/pages/Provider/provider-base/provider-base-sum-dialog";
import AddProviderBaseDialog from "@/pages/Provider/provider-base/add-provider-base-dialog";

const ProviderBase: React.FC = () => {
    const [data, setData] = useState<Provider.ProviderBaseSum[]>([]);

    const loadData = () => {
        getProviderBaseAllSum().then(data => {
            setData(data.items);
        });
    }
    useEffect(() => {
        loadData();
    }, []);

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
            render: (v, row) => <ProviderBaseSumDialog text={v}
                                                       providerType={row.providerType}
                                                       providerName={row.providerName}
                                                       onClosed={loadData}/>
        },
        {
            title: '未分析字段',
            width: '7%',
            dataIndex: 'newField',
            align: 'center',
            render:renderNum,
        },
        {
            title: '废弃字段',
            width: '7%',
            dataIndex: 'deprecated',
            align: 'center',
            render:renderNum,
        },
        {
            title: '仅类型变更',
            width: '7%',
            dataIndex: 'typeChange',
            align: 'center',
            render:renderNum,
        },
        {
            title: '仅描述变更',
            width: '7%',
            dataIndex: 'descChange',
            align: 'center',
            render:renderNum,
        },
        {
            title: '类型 & 描述变更',
            width: '7%',
            dataIndex: 'typeAndDescChange',
            align: 'center',
            render:renderNum,
        },
        {
            title: '未使用的字段',
            width: '7%',
            dataIndex: 'notUsed',
            align: 'center',
            render:renderNum,
        },
        {
            title: '已用的字段',
            width: '7%',
            dataIndex: 'used',
            align: 'center',
            render:renderNum,
        },
    ];

    return (
        <>
            <Breadcrumb
                items={[{title: '首页'}, {title: 'Provider 基线分析'}]}
                style={{margin: '10px 0'}}
            />
            <div style={{padding: '20px', background: '#fff'}}>
                <Space direction={'vertical'} style={{width: '100%'}}>
                    <AddProviderBaseDialog onClosed={loadData}/>
                    <Table
                        columns={columns}
                        dataSource={data}
                        size={'middle'}
                        pagination={false}
                        rowKey={r => r.providerType + '_' + r.providerName}
                    />
                </Space>
            </div>
        </>
    );
}

export default ProviderBase;
