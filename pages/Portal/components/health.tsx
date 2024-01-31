import { getProviderHealthCheckSum } from '@/services/portal/api';
import ReactEcharts from 'echarts-for-react';
import React, { useEffect, useState } from 'react';
import '../portal.less';
import { Result } from "antd";

const Health: React.FC = () => {
    const [items, setItems] = useState<Portal.ProviderHealthCheckSum>({
        dataSource: {
            apiFailed: 0,
            other: 0,
            success: 0,
        },
        resource: {
            apiFailed: 0,
            other: 0,
            success: 0,
        },
    });
    useEffect(() => {
        getProviderHealthCheckSum().then((rsp) => {
            setItems(rsp);
        });
    }, []);
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        legend: {
            x: 'center',
            y: 'bottom',
        },
        series: [
            {
                name: 'resource',
                type: 'pie',
                selectedMode: 'single',
                radius: ['15%', '30%'],
                label: {
                    show: false,
                },
                labelLine: {
                    show: false,
                },
                data: [
                    { value: items.resource.success, name: '成功' },
                    { value: items.resource.other, name: '其他原因' },
                    { value: items.resource.apiFailed, name: 'API' },
                ],
            },
            {
                name: 'dataSource',
                type: 'pie',
                radius: ['45%', '60%'],
                labelLine: {
                    length: 30,
                },
                label: {
                    show: false,
                },
                data: [
                    { value: items.dataSource.success, name: '成功' },
                    { value: items.dataSource.apiFailed, name: 'API' },
                    { value: items.dataSource.other, name: '其他原因' },
                ],
            },
        ],
        color: ['#91cc75', '#fc8452', '#ee6666'],
    };

    return (
        <div className={'portal-card'}>
            <div className={'header'}>健康度</div>
            <div className={'container'}>
                <ReactEcharts option={option} />
                <Result title="建设中..." />
            </div>
        </div>
    );
};

export default Health;
