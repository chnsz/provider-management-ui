import React, {useEffect, useState} from "react";
import {Table} from "antd";
import type {ColumnsType} from "antd/es/table";
import ProviderSyncIssueDialog, {getSyncTypeName} from "@/pages/Partner/components/provider_sync_issue_dialog";
import {CloudName} from "@/global";

export const getProviderIssuesData = (
    data: Provider.ProviderSyncSum[],
    preData: Record<string, Provider.ProviderSyncSum>
) => {
    data.forEach(t => {
        if (!preData.hasOwnProperty(t.type)) {
            return
        }
        preData[t.type] = t
    });

    const arr: Provider.ProviderSyncSum[] = [];
    for (const key in preData) {
        if (!preData.hasOwnProperty(key)) {
            continue;
        }
        arr.push(preData[key]);
    }
    return arr
}

export const getDefaultProviderIssueCount = () => {
    return {
        open: 0,
        padding: 0,
        monitoring: 0,
        merging: 0,
        serviceMissing: 0,
        apiMissing: 0,
        closed: 0,
        expired: 0,
        toExpired: 0,
        resource: 0,
        dataSource: 0
    }
}

export const getDefaultSyncSum = (typeName: string) => {
    return {
        type: typeName,
        huaweiCloud: getDefaultProviderIssueCount(),
        g42Cloud: getDefaultProviderIssueCount(),
        flexibleEngineCloud: getDefaultProviderIssueCount(),
        ctYun: getDefaultProviderIssueCount(),
    }
}

export const columnRender = (cloudName: Global.CloudName, loadData?: () => any, short?: boolean) => {
    return (v: any, row: Provider.ProviderSyncSum) => {
        let sumData: Provider.ProviderIssueCount = getDefaultProviderIssueCount();

        switch (cloudName) {
            case CloudName.HuaweiCloud:
                sumData = row.huaweiCloud;
                break
            case CloudName.FlexibleEngineCloud:
                sumData = row.flexibleEngineCloud;
                break
            case CloudName.G42Cloud:
                sumData = row.g42Cloud;
                break
            case CloudName.CTYun:
                sumData = row.ctYun || getDefaultProviderIssueCount();
                break
        }
        return <ProviderSyncIssueDialog sumData={sumData} cloudName={cloudName} syncType={row.type}
                                        onClosed={loadData} short={short}/>;
    }
}

const preSyncData: Record<string, Provider.ProviderSyncSum> = {
    PartnerMissingField: getDefaultSyncSum('PartnerMissingField'),
    PartnerFieldOutNum: getDefaultSyncSum('PartnerFieldOutNum'),
    PartnerFieldConflict: getDefaultSyncSum('PartnerFieldConflict'),
    PartnerMissingResource: getDefaultSyncSum('PartnerMissingResource'),
}

const ProviderSyncIssue: React.FC<{ data: Provider.ProviderSyncSum[], loadData?: () => any }> = ({data, loadData}) => {
    const [dataSource, setDataSource] = useState<Provider.ProviderSyncSum[]>([]);

    useEffect(() => {
        setDataSource(getProviderIssuesData(data, preSyncData));
    }, [data]);

    const columns: ColumnsType<Provider.ProviderSyncSum> = [
        {
            title: '类别',
            dataIndex: 'type',
            width: '10%',
            ellipsis: true,
            render: getSyncTypeName,
        },
        {
            title: '法电',
            dataIndex: 'flexibleEngineCloud',
            width: '30%',
            align: 'center',
            render: columnRender(CloudName.FlexibleEngineCloud, loadData),
        },
        {
            title: 'G42',
            dataIndex: 'g42Cloud',
            width: '30%',
            align: 'center',
            render: columnRender(CloudName.G42Cloud, loadData),
        },
        {
            title: '天翼云',
            dataIndex: 'ctYun',
            width: '30%',
            align: 'center',
            render: columnRender(CloudName.CTYun, loadData),
        },
    ];

    return <Table dataSource={dataSource}
                  columns={columns}
                  size={'middle'}
                  pagination={false}
                  rowKey={(record) => record.type}
    />
}

export default ProviderSyncIssue;
