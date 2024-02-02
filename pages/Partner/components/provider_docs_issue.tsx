import React, {useEffect, useState} from "react";
import {Table} from "antd";
import type {ColumnsType} from "antd/es/table";
import {getSyncTypeName} from "@/pages/Partner/components/provider_sync_issue_dialog";
import {columnRender, getDefaultSyncSum, getProviderIssuesData} from "@/pages/Partner/components/provider_sync_issue";
import {CloudName} from "@/global";

const preDocsData: Record<string, Provider.ProviderSyncSum> = {
    DocsMissingField: getDefaultSyncSum('DocsMissingField'),
    InvalidDocsField: getDefaultSyncSum('InvalidDocsField'),
    SchemaDocsFieldConflict: getDefaultSyncSum('SchemaDocsFieldConflict'),
}

const ProviderDocsIssue: React.FC<{
    data: Provider.ProviderSyncSum[],
    loadData?: () => any,
    short?: boolean,
}> = ({data, loadData, short}) => {
    const [dataSource, setDataSource] = useState<Provider.ProviderSyncSum[]>([]);

    useEffect(() => {
        setDataSource(getProviderIssuesData(data, preDocsData));
    }, [data]);

    const columns: ColumnsType<Provider.ProviderSyncSum> = [{
        title: '类别',
        dataIndex: 'type',
        width: '10%',
        ellipsis: true,
        render: getSyncTypeName,
    }, {
        title: '华为云',
        dataIndex: 'huaweiCloud',
        width: '30%',
        align: 'center',
        render: columnRender(CloudName.HuaweiCloud, loadData, short),
    }, {
        title: '法电',
        dataIndex: 'flexibleEngineCloud',
        width: '30%',
        align: 'center',
        render: columnRender(CloudName.FlexibleEngineCloud, loadData, short),
    }, {
        title: 'G42',
        dataIndex: 'g42Cloud',
        width: '30%',
        align: 'center',
        render: columnRender(CloudName.G42Cloud, loadData, short),
    }];

    return <Table dataSource={dataSource} columns={columns} size={'middle'} pagination={false}
                  rowKey={(record) => record.type}
    />
}

export default ProviderDocsIssue;
