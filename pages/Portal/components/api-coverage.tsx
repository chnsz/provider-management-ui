import {getApiPanelSum} from '@/services/portal/api';
import ReactEcharts from 'echarts-for-react';
import React, {useEffect, useState} from 'react';
import '../portal.less';

const defaultVal = {
    apiSum: {
        ignore: 0,
        missing_api: 0,
        need_analysis: 0,
        offline: 0,
        offline_in_use: 0,
        planning: 0,
        total: 0,
        used: 0,
        unpublished: 0,
    },
    product: {owner: '', productIcon: '', productName: ''},
    provider: {
        dataSource: 0,
        datasource_deprecated: 0,
        eps_support: false,
        pre_paid_support: 0,
        resource: 0,
        resource_deprecated: 0,
        tag_support: false,
        total: 0,
    },
};

const ApiCoverage: React.FC<{ productName: string }> = ({productName}) => {
    const [data, setData] = useState<Portal.ProductSumPanel>(defaultVal);

    useEffect(() => {
        getApiPanelSum(productName).then((data) => {
            setData(data);
        });
    }, [productName]);

    function toPercent(point: number) {
        let str = Number(point * 100).toFixed(2);
        str += '%';
        return str;
    }

    const option = {
        tooltip: {
            trigger: 'item',
        },
        legend: {
            top: '60',
            left: '58%',
            orient: 'vertical',
            icon: 'circle',
            textStyle: {
                lineHeight: 22,
                rich: {
                    name: {
                        color: '#5a5a5a',
                        width: 50,
                        fontSize: 16,
                    },
                    percent: {
                        color: '#929292',
                        fontSize: 16,
                        width: 50,
                        padding: [0, 0, 0, 35],
                    },
                    value: {
                        color: '#5a5a5a',
                        fontSize: 16,
                        width: 50,
                        padding: [0, 0, 0, 35],
                    },
                },
            },
            formatter: (name: string) => {
                const item = option.series[0].data.filter((d) => d.name === name)[0];
                const percent = ((item.value / data.apiSum.total) * 100).toFixed(2) + '%';
                const arr = [`{name|${name}}`, `{percent|${percent}}`, `{value|${item.value}}`];
                return arr.join('');
            },
        },
        series: [
            {
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                center: ['160', '140'],
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
                data: [
                    {name: '已对接', value: data.apiSum.used, itemStyle: {color: '#5470c6'}},
                    {
                        name: '规划中',
                        value: data.apiSum.planning,
                        itemStyle: {color: '#36cbcb'},
                    },
                    {
                        name: '待分析',
                        value: data.apiSum.need_analysis,
                        itemStyle: {color: '#fac858'},
                    },
                    {
                        name: '缺   失',
                        value: data.apiSum.missing_api,
                        itemStyle: {color: '#ee6666'},
                    },
                    {name: '不适合', value: data.apiSum.ignore, itemStyle: {color: '#975fe4'}},
                ],
            },
        ],
        graphic: [
            {
                type: 'text',
                left: '112',
                top: '110',
                style: {
                    text: [
                        '{label|对接率}',
                        '{value|' +
                        toPercent(data.apiSum.used / (data.apiSum.total - data.apiSum.ignore)) +
                        '}',
                    ].join('\n'),
                    rich: {
                        label: {
                            fontSize: 16,
                            padding: [0, 0, 5, 22],
                            fill: '#929292',
                            lineHeight: 40,
                        },
                        value: {
                            fontSize: 30,
                            fill: '#272727',
                            fontWeight: 'bold',
                            lineHeight: 20,
                        },
                    },
                },
            },
        ],
    };
    return (
        <div className={'portal-card'}>
            <div className={'header'}>API 对接</div>
            <div className={'container'}>
                <ReactEcharts option={option}/>
                {/*<div className={'coverage-card-percent'}>对接率： {toPercent(data.apiSum.used / data.apiSum.total)}</div>*/}
            </div>
        </div>
    );
};

export default ApiCoverage;
