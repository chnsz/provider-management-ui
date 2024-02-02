import ReactEcharts from 'echarts-for-react';
import React from 'react';

const ProviderHealth: React.FC = () => {
    const option = {
        series: [
            {
                type: 'gauge',
                axisLine: {
                    lineStyle: {
                        width: 5,
                        color: [
                            [0.4, '#fd666d'],
                            [0.8, '#67e0e3'],
                            [1, '#37a2da'],
                        ],
                    },
                },
                pointer: {
                    itemStyle: {
                        color: 'inherit',
                    },
                },
                axisTick: {
                    show: false,
                },
                splitLine: {
                    distance: -50,
                    length: 5,
                },
                axisLabel: {
                    color: 'inherit',
                    distance: 32,
                    fontSize: 10,
                },
                detail: {
                    valueAnimation: true,
                    formatter: '{value} %',
                    color: 'inherit',
                    fontSize: 12,
                },
                data: [{value: 70}],
            },
        ],
    };

    return (
        <div style={{height: '100%', width: '100%'}}>
            <ReactEcharts option={option} style={{height: '100%'}}/>
        </div>
    );
};

export default ProviderHealth;
