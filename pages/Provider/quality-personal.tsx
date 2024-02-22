import React, { useEffect, useState } from 'react';
import './provider.less';
import '../Partner/partner.less';
import { Table, TableColumnsType } from 'antd';
import OwnerApiDialog from './components/owner-api-dialog';
import { CloudName } from '@/global';
import OwnerProviderPlanningDialog from './components/owner-provider-planning-dialog';
import OwnerUtListDialog from './components/owner-ut-dialog';
import OwnerProviderDialog from './components/owner-provider-dialog';
import OwnerApiFieldChangeDialog from './components/owner-api-field-change-dialog';
import OwnerBugListDialog from './components/owner-bug-dialog';


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

const renderApi = (v: any, row: any, onClosed: () => any) => {
    const dashBoardType = "personal";
    const view = <div className={'column-cell'}>
        <div className={'cell'}>
            <div className={'cell gold'}>{row.apiNeedAnalysisCount}</div>
            <div className={'label'}>待分析</div>
        </div>
        <div className={'cell'}>
            <div className={'cell ' + (row.apiDeprecatedUsed > 0 ? 'red' : '')}>
                {row.apiDeprecatedUsed}
            </div>
            <div className={'label'}>使用废弃</div>
        </div>
        <div className={'cell'}>
            <div className={'cell'}>{row.apiCount}</div>
            <div className={'label'}>总数</div>
        </div>
    </div>
        ;
    return <OwnerApiDialog
        content={view}
        owner={row.parOwner}
        productName={row.productName}
        dashBoardType={dashBoardType}
        onClosed={onClosed}
        cloudName={CloudName.HuaweiCloud} />;
}

const renderPlanning = (v: any, row: any, onClosed: () => any) => {
    const dashBoardType = "personal";
    const view = <div className={'column-cell'}>
        <div className={'cell'}>
            <div className={'cell'}>{(row.planningCount - row.planningClosedCount) || 0}</div>
            <div className={'label'}>进行中</div>
        </div>
        <div className={'cell'}>
            <div className={'cell'}>{row.planningClosedCount || 0}</div>
            <div className={'label'}>已完成</div>
        </div>
        <div className={'cell'}>
            <div className={'cell'}>{row.planningCount || 0}</div>
            <div className={'label'}>总数</div>
        </div>
    </div>;
    return <OwnerProviderPlanningDialog
        content={view}
        owner={row.parOwner}
        dashBoardType={dashBoardType}
        productName={row.productName}
        onClosed={onClosed} />;
}

const renderUt = (v: any, row: any) => {
    if (row.utTestCount === 0) {
        return '';
    }

    const view = <div className={'column-cell'}>
        <div className={'cell'}>
            <div className={'cell ' + getColor(row.utTestFailedCount)}>{row.utTestFailedCount}</div>
            <div className={'label'}>失败</div>
        </div>
        <div className={'cell'}>
            <div className={'cell'}>{row.utTestCount}</div>
            <div className={'label'}>总数</div>
        </div>
    </div>;
    return <OwnerUtListDialog content={view} owner={row.parOwner} productName={row.productName} />;
}

const renderUtCoverage = (v: any, row: any) => {
    if (row.utCoverageAvg === 0) {
        return '';
    }

    const view = <div className={'column-cell'}>
        <div className={'cell'}>
            <div className={'cell ' + getColor(row.utCoverageAvg)}>{row.utCoverageAvg} %</div>
            <div className={'label'}>平均</div>
        </div>
        <div className={'cell'}>
            <div className={'cell ' + getColor(row.utCoverageAvg)}>{row.utCoverageMax} %</div>
            <div className={'label'}>最高</div>
        </div>
        <div className={'cell'}>
            <div className={'cell ' + getColor(row.utCoverageAvg)}>{row.utCoverageMin} %</div>
            <div className={'label'}>最低</div>
        </div>
    </div>;
    return <OwnerProviderDialog content={view} owner={row.parOwner} productName={row.productName} />;
}

const renderProvider = (v: any, row: any) => {
    let rate = 100;
    if (row.resourceCount > 0) {
        rate = Math.round(row.providerBaseCount / (row.resourceCount) * 100);
    }
    const color = getColor(rate);
    let resource = <span className={'gold'}>{row.providerBaseCount} / {row.resourceCount}</span>
    if (row.providerBaseCount === row.resourceCount) {
        resource = <span className={'green'}>{row.resourceCount || '-'}</span>;
    }
    const view = <div className={'column-cell'}>
        <div className={'cell'}>
            <div className={'cell ' + color}>{rate} %</div>
            <div className={'label'}>基线率</div>
        </div>
        <div className={'cell'}>
            <div className={'cell'}>{resource}</div>
            <div className={'label'}>R</div>
        </div>
        <div className={'cell'}>
            <div className={'cell'}>{row.dataSourceCount || '-'}</div>
            <div className={'label'}>D</div>
        </div>
    </div>;
    return <OwnerProviderDialog content={view} owner={row.parOwner} productName={row.productName} />;
}

const renderApiChange = (v: any, row: any, onClosed: () => any) => {
    const view = <div className={'column-cell'}>
        <div className={'cell'}>
            <div className={'cell ' + (row.apiChangeOpenCount > 0 ? ' gold' : '')}>
                {row.apiChangeOpenCount}
            </div>
            <div className={'label'}>待处理</div>
        </div>
        <div className={'cell'}>
            <div className={'cell'}>{row.apiChangePendingCount}</div>
            <div className={'label'}>挂起</div>
        </div>
    </div>;
    return <OwnerApiFieldChangeDialog content={view} owner={row.parOwner} onClosed={onClosed} />
}


const QualityPersonal: React.FC<{ qualityData: Portal.OwnerSum[], setReloadFlag: () => any }> = ({ qualityData, setReloadFlag }) => {
    const columns: TableColumnsType<any> = [{
        title: '序号',
        dataIndex: 'sn',
        align: 'center',
        width: 70,
        render: (v, r, i) => i + 1,
    }, {
        title: '服务名称',
        dataIndex: 'productName',
        align: 'center',
        ellipsis: true,
        width: 100,
        render: (val, record) => {
            return <a href={`/service#/productName/${val}`} target={'_blank'} rel="noreferrer">
                {val}
            </a>
        },
    }, {
        title: '资源基线',
        dataIndex: 'providerBaseCount',
        align: 'center',
        width: '15%',
        render: renderProvider,
    }, {
        title: 'API 分析',
        dataIndex: 'providerBaseCount',
        align: 'center',
        width: '15%',
        render: (v, row) => renderApi(v, row, setReloadFlag),
    }, {
        title: '资源规划',
        dataIndex: 'providerBaseCount',
        align: 'center',
        width: '15%',
        render: (v, row) => renderPlanning(v, row, setReloadFlag),
    }, {
        title: '单元测试质量',
        dataIndex: 'providerBaseCount',
        align: 'center',
        width: '10%',
        render: renderUt,
    }, {
        title: 'UT 覆盖率',
        dataIndex: 'utCoverageMax',
        align: 'center',
        width: '15%',
        render: renderUtCoverage,
    }, {
        title: 'API 变更',
        dataIndex: 'utCoverageMax',
        align: 'center',
        width: '10%',
        // render: (v, row) => renderApiChange(v, row, setReloadFlag)
        render: (v, row) => {
            const view = <div className={'column-cell'}>
                <div className={'cell'}>
                    <div className={'cell ' + (row.apiChangeOpenCount > 0 ? ' gold' : '')}>
                        {row.apiChangeOpenCount}
                    </div>
                    <div className={'label'}>待处理</div>
                </div>
                <div className={'cell'}>
                    <div className={'cell'}>{row.apiChangePendingCount}</div>
                    <div className={'label'}>挂起</div>
                </div>
            </div>;
            return view;
        }
    }, {
        title: '资源问题',
        dataIndex: 'bugCount',
        align: 'center',
        width: 100,
        render: (v, row) => <OwnerBugListDialog owner={row.parOwner} content={v} productName={row.productName}/>
        // render: v => {
        //     return <div className={v > 0 ? getColor(0) : ''}>{v}</div>
        // }
    }];

    return (
        <div className={'provider'}>
            <div style={{ background: '#fff', marginTop: '15px' }}>
                <div className={'custom-title title'}>
                    <div className={'title'}>个人看板</div>
                </div>
                <div className={'provider-list quality-sum'}>
                    <Table columns={columns}
                        dataSource={qualityData}
                        size={'middle'}
                        pagination={false}
                        rowKey={(record) => record.owner + '_' + record.productName} />
                </div>
            </div>
        </div>
    );
};

export default QualityPersonal;
