import AddProviderBaseDialog from '@/pages/Provider/provider-base/add-provider-base-dialog';
import ProviderBaseSumDialog from '@/pages/Provider/provider-base/provider-base-sum-dialog';
import {getProviderBaseAllSum} from '@/services/provider/api';
import {Space, Table} from 'antd';
import type {ColumnsType} from 'antd/es/table/interface';
import React, {useEffect, useState} from 'react';
import SearchForm from "@/components/SearchForm";
import {useModel} from 'umi';

const ProviderBase: React.FC = () => {
    const [data, setData] = useState<Provider.ProviderBaseSum[]>([]);
    const [owners, setOwners] = useState<string[]>([]);

    const {initialState} = useModel('@@initialState');
    let owner: string[] = [];
    if (!['Developer', '程相栋', '牛振国', '解义超', '王泽鹏'].includes(initialState?.currentUser?.realName || '')) {
        owner = [initialState?.currentUser?.realName || '']
    }

    const loadData = () => {
        getProviderBaseAllSum().then((data) => {
            if (owners.length === 0) {
                setData(data.items);
                return;
            }
            const arr = data.items.filter(t => owners.includes(t.owner))
            setData(arr.length === 0 ? data.items : arr);
        });
    };

    // useEffect(() => {
    //     loadData();
    // }, []);

    useEffect(() => {
        loadData();
    }, [owners]);

    const renderNum = (v: any) => {
        if (!v) {
            return '';
        }
        return v;
    };

    const columns: ColumnsType<Provider.ProviderBaseSum> = [
        {
            title: '序号',
            dataIndex: 'sn',
            align: 'center',
            width: '3%',
            render: (v, r, i) => i + 1,
        },
        {
            title: '资源类型',
            dataIndex: 'providerType',
            width: '6%',
        },
        {
            title: '资源名称',
            dataIndex: 'providerName',
            width: '14%',
            render: (v, row) => (
                <ProviderBaseSumDialog
                    text={v}
                    providerType={row.providerType}
                    providerName={row.providerName}
                    onClosed={loadData}
                />
            ),
        },
        {
            title: '责任人',
            width: '5%',
            dataIndex: 'owner',
            align: 'center',
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


    return (
        <div>
            <Space direction={'vertical'} style={{width: '100%'}}>
                <AddProviderBaseDialog onClosed={loadData}/>
                <div style={{padding: '5px 0 10px 5px'}}>
                    <SearchForm options={['owner']} defaultValue={{owner: owner}}
                                onSearch={(formData) => setOwners(formData.owner)}
                    />
                </div>
                <Table
                    columns={columns}
                    dataSource={data}
                    size={'middle'}
                    pagination={false}
                    rowKey={(r) => r.providerType + '_' + r.providerName}
                />
            </Space>
        </div>
    );
};

export default ProviderBase;
