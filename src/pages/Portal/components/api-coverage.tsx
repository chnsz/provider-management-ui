import { getApiCoverageSum } from '@/services/portal/api';
import ReactEcharts from 'echarts-for-react';
import React, { useEffect, useState } from 'react';
import '../portal.less';

const ApiCoverage: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [coveredRate, setCoveredRate] = useState<number>(0);
    let covereCount = 0;
    let totalCount = 0;
    useEffect(() => {
        getApiCoverageSum().then((cover) => {
            setData([
                {
                    name: '已对接',
                    value: cover.covered,
                },
                {
                    name: '规划中',
                    value: cover.planned,
                },
                {
                    name: '待分析',
                    value: cover.notAnalyzed,
                },
                {
                    name: '缺   失',
                    value: cover.failing,
                },
                {
                    name: '不合适',
                    value: cover.notSuitable,
                },
            ]);
            covereCount = cover.covered;
            totalCount =
                cover.covered +
                cover.planned +
                cover.notAnalyzed +
                cover.failing +
                cover.notSuitable;
            if (covereCount > 0 && totalCount > 0) {
                setCoveredRate(covereCount / totalCount);
            }
        });
    }, []);

    function toPercent(point: number) {
        let str = Number(point * 100).toFixed(2);
        str += '%';
        return str;
    }

    const option = {
        tooltip: {
            trigger: 'item',
        },
        color: ['#5470c6', '#36cbcb', '#fac858', '#ee6666', '#975fe4'],
        legend: {
            top: '20%',
            left: '60%',
            orient: 'vertical',
            icon: 'circle',
            textStyle: {
                rich: {
                    orgname: {
                        color: '#5a5a5a',
                        width: 50,
                    },
                    dpercent: {
                        color: '#929292',
                        width: 50,
                    },
                    value: {
                        color: '#5a5a5a',
                        width: 50,
                    },
                },
            },
            formatter: function (name: string) {
                let total = 0;
                for (let i = 0; i < option.series[0].data.length; i++) {
                    total += option.series[0].data[i].value;
                }
                for (let i = 0; i < option.series[0].data.length; i++) {
                    let dpercent =
                        ((option.series[0].data[i].value / total) * 100).toFixed(2) + '%';
                    if (option.series[0].data[i].name === name) {
                        const arr = [
                            `{orgname|${name}}`,
                            `{dpercent|${dpercent}}`,
                            `{value|${option.series[0].data[i].value}}`,
                        ];
                        return arr.join('    ');
                    }
                }
            },
        },
        series: [
            {
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                center: ['30%', '38%'],
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2,
                },
                label: {
                    show: false,
                    position: 'center',
                },
                emphasis: {
                    label: {
                        show: false,
                        fontSize: 40,
                        formatter: '{d}%\n{b}',
                        fontWeight: 'bold',
                    },
                },
                labelLine: {
                    show: false,
                },
                data: data,
            },
        ],
    };
    return (
        <div className={'portal-card'}>
            <div className={'header'}>API对接</div>
            <div className={'container'}>
                <ReactEcharts option={option} />
                <div className={'coverage-card-percent'}>对接率： {toPercent(coveredRate)}</div>
            </div>
        </div>
    );
};

export default ApiCoverage;
