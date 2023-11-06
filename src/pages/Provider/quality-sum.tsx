import './provider.less'
import React, {useEffect, useState} from "react";
import {Space, Table,} from "antd";
import type {ColumnsType} from "antd/es/table/interface";
import {getOwnerSumList} from "@/services/portal/api";
import IndicatorsIntroDialog from "@/pages/Provider/indicators-dialog";
import OwnerProductDialog from "@/pages/Provider/components/owner-product-dialog";
import OwnerProviderDialog, {getUTColor} from "@/pages/Provider/components/owner-provider-dialog";
import OwnerApiDialog from "@/pages/Provider/components/owner-api-dialog";
import PrListDialog from "@/pages/Provider/pr_list_dialog";
import OwnerProviderPlanningDialog from "@/pages/Provider/components/owner-provider-planning-dialog";
import OwnerBugListDialog from "@/pages/Provider/components/owner-bug-dialog";
import OwnerUtListDialog from "@/pages/Provider/components/owner-ut-dialog";
import OwnerApiFieldChangeDialog from "@/pages/Provider/components/owner-api-field-change-dialog";
import {CloudName} from "@/global";

export const getColor = (val: number) => {
    let color = '';
    if (val < 60) {
        color = 'red';
    } else if (val >= 60 && val < 70) {
        color = 'gold';
    } else if (val >= 70 && val < 90) {
        color = 'blue';
    } else if (val >= 90) {
        color = 'green';
    }
    return color;
}

const renderCol = (r: number, val1: number, val2: number, labels: string[] = ['基线率', '已基线', '总数']) => {
    let rate = r === -1 ? 0 : Math.round(r);
    if (r === -1 && val2 > 0) {
        rate = Math.round(val1 / val2 * 100);
    }
    const color = getColor(rate);

    return <div className={'column-cell'}>
        <div className={'cell'}>
            <div className={'cell ' + color}>{rate} %</div>
            <div className={'label'}>{labels[0]}</div>
        </div>
        <div className={'cell'}>
            <div className={'cell'}>{val1}</div>
            <div className={'label'}>{labels[1]}</div>
        </div>
        <div className={'cell'}>
            <div className={'cell'}>{val2}</div>
            <div className={'label'}>{labels[2]}</div>
        </div>
    </div>
}

const renderService = (v: any, row: Portal.OwnerSum) => {
    const viewEle = renderCol(-1, row.productBasedCount, row.productCount);
    return <OwnerProductDialog content={viewEle} owner={row.owner}/>;
}

const renderProvider = (v: any, row: Portal.OwnerSum) => {
    const viewEle = renderCol(-1, row.providerBasedCount, row.providerCount);
    return <OwnerProviderDialog content={viewEle} owner={row.owner}/>;
}

const renderApi = (v: any, row: Portal.OwnerSum, onClosed: () => any) => {
    const viewEle = renderCol((row.apiCount - row.apiNeedAnalysisCount) / row.apiCount * 100, row.apiNeedAnalysisCount, row.apiCount, ['分析率', '待分析', '总数']);
    return <OwnerApiDialog content={viewEle} owner={row.owner} onClosed={onClosed} cloudName={CloudName.HuaweiCloud}/>;
}

const renderPlanning = (v: any, row: Portal.OwnerSum) => {
    return <OwnerProviderPlanningDialog content={v} owner={row.owner}/>;
}

const renderUtCoverage = (v: any, row: Portal.OwnerSum) => {
    const viewer = <div className={'column-cell'}>
        <div className={'cell'}>
            <div className={'cell ' + getUTColor(row.uTCoverageAvg)}>{row.uTCoverageAvg}</div>
            <div className={'label'}>平均</div>
        </div>
        <div className={'cell'}>
            <div className={'cell ' + getUTColor(row.uTCoverageMax)}>{row.uTCoverageMax}</div>
            <div className={'label'}>最高</div>
        </div>
        <div className={'cell ' + (row.uTCoverageMin > 0 ? 'red' : '')}>
            <div className={'cell ' + getUTColor(row.uTCoverageMin)}>{row.uTCoverageMin}</div>
            <div className={'label'}>最低</div>
        </div>
    </div>
    return <OwnerProviderDialog content={viewer} owner={row.owner}/>;
}

const renderUt = (v: any, row: Portal.OwnerSum) => {
    let rate = 100;
    if (row.utCount > 0) {
        rate = Math.round((row.utCount - row.utFailedCount) / row.utCount * 100);
    }
    const color = getColor(rate);
    const viewer = <div className={'column-cell'}>
        <div className={'cell'}>
            <div className={'cell ' + color}>{rate} %</div>
            <div className={'label'}>成功率</div>
        </div>
        <div className={'cell ' + (row.utFailedCount > 0 ? 'red' : '')}>
            <div className={'cell'}>{row.utFailedCount}</div>
            <div className={'label'}>失败</div>
        </div>
        <div className={'cell'}>
            <div className={'cell'}>{row.utCount}</div>
            <div className={'label'}>总数</div>
        </div>
    </div>
    return <OwnerUtListDialog content={viewer} owner={row.owner}/>;
}

const renderApiChange = (v: any, row: Portal.OwnerSum, onClosed: () => any) => {
    const viewer = <div className={'column-cell'}>
        <div className={'cell'}>
            <div className={'cell' + (row.apiChangeExpired > 0 ? ' red' : '')}>
                {row.apiChangeExpired}
            </div>
            <div className={'label'}>已超期</div>
        </div>
        <div className={'cell'}>
            <div className={'cell' + (row.apiChangeToExpired > 0 ? ' gold' : '')}>
                {row.apiChangeToExpired}
            </div>
            <div className={'label'}>即将超期</div>
        </div>
        <div className={'cell'}>
            <div className={'cell' + (row.apiChangeUnProcessed > 0 ? ' gold' : '')}>
                {row.apiChangeUnProcessed}
            </div>
            <div className={'label'}>待处理</div>
        </div>
        <div className={'cell'}>
            <div className={'cell blue'}>{row.apiChangePadding}</div>
            <div className={'label'}>挂起</div>
        </div>
    </div>
    return <OwnerApiFieldChangeDialog content={viewer} owner={row.owner} onClosed={onClosed}/>
}

const QualitySum: React.FC = () => {
    const [data, setData] = useState<Portal.OwnerSum[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const loadData = () => {
        getOwnerSumList().then(rsp => {
            setLoading(false);
            setData(rsp.items);
        })
    }
    useEffect(loadData, []);

    const columns: ColumnsType<Portal.OwnerSum> = [
        {
            title: '序号',
            dataIndex: 'sn',
            align: 'center',
            width: 70,
            render: (v, r, i) => i + 1,
        },
        {
            title: '责任人',
            dataIndex: 'owner',
            align: 'center',
            width: 90,
        },
        {
            title: '量化分',
            dataIndex: 'score',
            align: 'center',
            width: 90,
            render: v => <span style={{color: getColor(v)}}>{v}</span>
        },
        {
            title: '服务基线率',
            dataIndex: 'productCount',
            align: 'center',
            width: '11%',
            render: renderService,
        },
        {
            title: '资源基线率',
            dataIndex: 'providerBasedCount',
            align: 'center',
            width: '11%',
            render: renderProvider,
        },
        {
            title: 'API 分析率',
            dataIndex: 'apiCount',
            align: 'center',
            width: '11%',
            render: (v, row) => renderApi(v, row, loadData),
        },
        {
            title: '资源规划',
            dataIndex: 'providerPlanningCount',
            align: 'center',
            width: 90,
            render: renderPlanning,
        },
        {
            title: '持续优化 PR',
            dataIndex: 'prCount',
            align: 'center',
            width: 110,
            render: (v, row) => <PrListDialog val={v}
                                              owner={row.owner}
                                              prStatus={""}
                                              providerType={""}
                                              providerName={""}/>
        },
        {
            title: '单元测试质量',
            dataIndex: 'utFailedCount',
            align: 'center',
            width: '11%',
            render: renderUt,
        },
        {
            title: 'UT 覆盖率（%）',
            dataIndex: 'utFailedCount',
            align: 'center',
            width: '10%',
            render: renderUtCoverage,
        },
        {
            title: 'API 变更',
            dataIndex: 'fieldChangedDelayCount',
            align: 'center',
            width: '15%',
            // render: () => '',
            render: (v, row) => renderApiChange(v, row, loadData),
        },
        {
            title: '资源问题',
            dataIndex: 'bugCount',
            align: 'center',
            width: 100,
            render: (v, row) => <OwnerBugListDialog owner={row.owner} content={v}/>
            // render: () => '',
        },
    ];

    return <div className={'quality-sum'} style={{padding: '20px'}}>
        <div style={{textAlign: 'right', margin: '-6px 0 12px 0'}}><IndicatorsIntroDialog/></div>
        <Table columns={columns} dataSource={data} size={'middle'} pagination={false} loading={loading}
               rowKey={(record) => record.owner}/>
        <div style={{marginTop: '20px'}}>
            <Space size={20}>
                <span className={'green'}>绿色：90% ~ 100%</span>
                <span className={'blue'}>蓝色：70% ~ 90%</span>
                <span className={'gold'}>金色：60% ~ 70%</span>
                <span className={'red'}>红色：0 ~ 60%</span>
            </Space>
        </div>
    </div>
}

export default QualitySum;
