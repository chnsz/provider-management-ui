import './provider.less'
import React, { useEffect, useState } from "react";
import { Space, Table, TableColumnsType, Tooltip, } from "antd";
import type { ColumnsType } from "antd/es/table/interface";
import { getOwnerSumList } from "@/services/portal/api";
import IndicatorsIntroDialog from "@/pages/Provider/indicators-dialog";
import OwnerProductDialog from "@/pages/Provider/components/owner-product-dialog";
import OwnerProviderDialog, { getUTColor } from "@/pages/Provider/components/owner-provider-dialog";
import OwnerApiDialog from "@/pages/Provider/components/owner-api-dialog";
import PrListDialog from "@/pages/Provider/pr_list_dialog";
import OwnerProviderPlanningDialog from "@/pages/Provider/components/owner-provider-planning-dialog";
import OwnerBugListDialog from "@/pages/Provider/components/owner-bug-dialog";
import OwnerUtListDialog from "@/pages/Provider/components/owner-ut-dialog";
import OwnerApiFieldChangeDialog from "@/pages/Provider/components/owner-api-field-change-dialog";
import { CloudName } from "@/global";
import { InfoCircleOutlined, LikeOutlined, SmileOutlined, SmileTwoTone, TrophyOutlined } from "@ant-design/icons";

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
    return <OwnerProductDialog content={viewEle} owner={row.owner} />;
}

const renderProvider = (v: any, row: Portal.OwnerSum) => {
    const viewEle = renderCol(-1, row.providerBasedCount, row.providerCount);
    return <OwnerProviderDialog content={viewEle} owner={row.owner} />;
}

const renderApi = (v: any, row: Portal.OwnerSum, onClosed: () => any) => {
    const viewEle = renderCol((row.apiCount - row.apiNeedAnalysisCount) / row.apiCount * 100, row.apiNeedAnalysisCount, row.apiCount, ['分析率', '待分析', '总数']);
    return <OwnerApiDialog content={viewEle} owner={row.owner} onClosed={onClosed} cloudName={CloudName.HuaweiCloud} />;
}

const renderPlanning = (v: any, row: Portal.OwnerSum, onClosed: () => any) => {
    return <OwnerProviderPlanningDialog content={v} owner={row.owner} onClosed={onClosed} />;
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
    return <OwnerProviderDialog content={viewer} owner={row.owner} />;
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
    return <OwnerUtListDialog content={viewer} owner={row.owner} />;
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
    return <OwnerApiFieldChangeDialog content={viewer} owner={row.owner} onClosed={onClosed} />
}

const todoTooltips = (
    <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>
        <Tooltip
            title={
                <div>
                    <p style={{ fontWeight: 'bold' }}>待办项：</p>
                    <p>（1）资源基线：如有未基线的 Resource，则算一项;</p>
                    <p>（2）API 分析：如有待分析的，即待分析个数大于0，则算一项;</p>
                    <p>（3）资源规划：如有未完成的，即未完成个数大于0，则算一项;</p>
                    <p>（4）API 变更：如有待处理的，即待处理个数大于0，则算一项;</p>
                </div>
            }
        >
            <InfoCircleOutlined />
        </Tooltip>
    </span>
);

const QualitySum: React.FC<{ setQualityData: (data: Portal.OwnerSum[]) => any, reloadFlag: any }> = ({ setQualityData, reloadFlag }) => {
    const [data, setData] = useState<Portal.OwnerSum[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const loadData = () => {
        getOwnerSumList().then(rsp => {
            setLoading(false);
            setData(rsp.items);
            setQualityData(rsp.items);
        })
    }

    const onLoadData = () => {
        loadData();
    }
    
    useEffect(loadData, []);

    useEffect(() => {
        if (reloadFlag) {
            onLoadData();
        }
    }, [reloadFlag]);

    const teamMapper = {
        '张继舒': '一组: 鲲鹏',
        '侯鹏': '二组: 天狼',
        '黄子强': '三组: 猎鹰',
        '鹿晓航': '四组: 雷霆',
        '时长阔': '五组: 战神',
        '靳杨洋': '六组: 翼龙',
        '华铭': '七组: 暗影'
    }; //
    // 鲲鹏、猎鹰、战神、朱雀、风翼、雷霆之翼、冰牙、夜影、烈焰狮、星狼、龙翔、暗影猎手、铁翼、烈焰骑士

    const columns: ColumnsType<Portal.OwnerSum> = [
        {
            title: '序号',
            dataIndex: 'sn',
            align: 'center',
            width: 70,
            render: (v, r, i) => i + 1,
        },
        {
            title: '交付小组',
            dataIndex: 'owner',
            align: 'center',
            width: 150,
            render: v => {
                return <div>
                    <div>{teamMapper[v] || v}</div>
                    <div style={{ color: '#00000073' }}>组长：{v}</div>
                </div>;
            },
        },
        {
            title: '量化分',
            dataIndex: 'score',
            align: 'center',
            width: 90,
            render: v => <span style={{ color: getColor(v) }}>{v}</span>
        },
        {
            title: '服务基线',
            dataIndex: 'productCount',
            align: 'center',
            width: '11%',
            render: renderService,
        },
        {
            title: '资源基线',
            dataIndex: 'providerBasedCount',
            align: 'center',
            width: '11%',
            render: renderProvider,
        },
        {
            title: 'API 分析',
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
            render: (v, row) => renderPlanning(v, row, loadData),
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
                providerName={""} />
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
            width: '14%',
            // render: () => '',
            render: (v, row) => renderApiChange(v, row, loadData),
        },
        {
            title: '资源问题',
            dataIndex: 'bugCount',
            align: 'center',
            width: 100,
            render: (v, row) => <OwnerBugListDialog owner={row.owner} content={v} />
            // render: () => '',
        },
    ];

    const expandedRowRender = (row) => {
        const columns: TableColumnsType<Portal.ProductSum> = [{
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
            width: 160,
        }, {
            title: <>待办项 {todoTooltips}</>,
            dataIndex: 'score',
            align: 'center',
            render: v => {
                if (v === 0) {
                    return <SmileTwoTone twoToneColor={'#40a9ff'} style={{ fontSize: '20px' }} />;
                }
                return <span className={'red'}>{v}</span>;
            },
        }, {
            title: '责任人',
            dataIndex: 'owner',
            align: 'center',
            width: 100,
        }, {
            title: '资源基线',
            dataIndex: 'providerBaseCount',
            align: 'center',
            width: '12%',
            render: (v, row) => {
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
                    <div className={'cell note'}>
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
                return view;
            }
        }, {
            title: 'API 分析',
            dataIndex: 'providerBaseCount',
            align: 'center',
            width: '14%',
            render: (v, row) => {
                let rate = 100;
                if (row.apiCount > 0) {
                    rate = Math.round(row.apiUsedCount / (row.apiCount - row.apiIgnoreCount) * 100);
                }
                const color = getColor(rate);
                const view = <div className={'column-cell'}>
                    <div className={'cell note'}>
                        <div className={'cell ' + color}>{rate} %</div>
                        <div className={'label'}>进度</div>
                    </div>
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
                return view;
            }
        }, {
            title: '资源规划',
            dataIndex: 'providerBaseCount',
            align: 'center',
            width: '12%',
            render: (v, row) => {
                const view = <div className={'column-cell'}>
                    <div className={'cell note'}>
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
                return view;
            }
        }, {
            title: '单元测试质量',
            dataIndex: 'providerBaseCount',
            align: 'center',
            width: '12%',
            render: (v, row) => {
                if (row.utTestCount === 0) {
                    return '';
                }

                let rate = 100;
                if (row.utTestCount > 0) {
                    rate = Math.round((row.utTestCount - row.utTestFailedCount) / row.utTestCount * 100);
                }
                const color = getColor(rate);
                const view = <div className={'column-cell'}>
                    <div className={'cell'}>
                        <div className={'cell ' + color}>{rate} %</div>
                        <div className={'label'}>成功率</div>
                    </div>
                    <div className={'cell'}>
                        <div className={'cell ' + getColor(row.utTestFailedCount)}>{row.utTestFailedCount}</div>
                        <div className={'label'}>失败</div>
                    </div>
                    <div className={'cell'}>
                        <div className={'cell'}>{row.utTestCount}</div>
                        <div className={'label'}>总数</div>
                    </div>
                </div>;
                return view;
            }
        }, {
            title: 'UT 覆盖率',
            dataIndex: 'utCoverageMax',
            align: 'center',
            width: '12%',
            render: (v, row) => {
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
                return view;
            }
        }, {
            title: 'API 变更',
            dataIndex: 'utCoverageMax',
            align: 'center',
            width: '10%',
            render: (v, row) => {
                const view = <div className={'column-cell note'}>
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
            render: v => {
                return <div className={v > 0 ? getColor(0) : ''}>{v}</div>
            }
        }];

        return <div style={{ marginBottom: '20px' }}>
            <Table columns={columns} dataSource={row.productSumList} pagination={false} size={'small'} />
        </div>;
    };

    return <div className={'quality-sum'} style={{ padding: '20px' }}>
        <div style={{ textAlign: 'right', margin: '-6px 0 12px 0' }}><IndicatorsIntroDialog /></div>
        <Table columns={columns}
            dataSource={data}
            size={'middle'}
            pagination={false} loading={loading}
            expandable={{ expandedRowRender }}
            rowKey={(record) => record.owner} />
        <div style={{ marginTop: '20px' }}>
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
