import AddProviderBaseDialog from '@/pages/Provider/provider-base/add-provider-base-dialog';
import ProviderBaseSumDialog from '@/pages/Provider/provider-base/provider-base-sum-dialog';
import { getProviderBaseAllSum } from '@/services/provider/api';
import { Space, Table, Tabs, TabsProps } from 'antd';
import type { ColumnsType } from 'antd/es/table/interface';
import React, { useEffect, useState } from 'react';
import SearchForm from "@/components/SearchForm";
import { useModel } from 'umi';

const ProviderBase: React.FC = () => {
    const [resourceData, setResourceData] = useState<Provider.ProviderBaseSum[]>([]);
    const [dataSourceData, setDataSourceData] = useState<Provider.ProviderBaseSum[]>([]);
    const [owners, setOwners] = useState<string[]>([]);

    const { initialState } = useModel('@@initialState');
    let owner: string[] = [];
    if (!['Developer', '程相栋', '牛振国', '解义超', '王泽鹏'].includes(initialState?.currentUser?.realName || '')) {
        owner = [initialState?.currentUser?.realName || '']
    }

    const loadData = () => {
        getProviderBaseAllSum().then((data) => {
            if (owners.length === 0) {
                handleData(data.items);
                return;
            }
            const arr = data.items.filter(t => {
                for (let i = 0; i < owners.length; i++) {
                    if (t.owner.includes(owners[i])) {
                        return true;
                    }
                }
                return false;
            })
            if (arr.length === 0) {
                handleData(data.items);
            } else {
                handleData(arr);
            }
        });
    };

    const handleData = (data: any) => {
        const resourceArr: Provider.ProviderBaseSum[] = [];
        const dataSourceArr: Provider.ProviderBaseSum[] = [];
        data.forEach((d) => {
            if (d.providerType === 'Resource') {
                resourceArr.push(d);
            } else if (d.providerType === 'DataSource') {
                dataSourceArr.push(d);
            }
        })
        setResourceData(resourceArr);
        setDataSourceData(dataSourceArr)
    }

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

    const items: TabsProps['items'] = [{
        key: '1',
        label: `Resource (${resourceData.length})`,
        children: <Table dataSource={resourceData}
            columns={columns} size={'small'}
            rowKey={(record) => record.providerType + '_' + record.providerName}
            pagination={false}
        />,
    }, {
        key: '2',
        label: `DataSource (${dataSourceData.length})`,
        children: <Table dataSource={dataSourceData}
            columns={columns} size={'small'}
            rowKey={(record) => record.providerType + '_' + record.providerName}
            pagination={false}
        />,
    }];


    return (
        <div>
            <Space direction={'vertical'} style={{ width: '100%' }}>
                <AddProviderBaseDialog onClosed={loadData} />
                <div style={{ padding: '5px 0 10px 5px' }}>
                    <SearchForm options={['owner']} defaultValue={{ owner: owner }}
                        onSearch={(formData) => setOwners(formData.owner)}
                    />
                </div>

                <Tabs defaultActiveKey="1" items={items} />
            </Space>
        </div>
    );
};

export default ProviderBase;
