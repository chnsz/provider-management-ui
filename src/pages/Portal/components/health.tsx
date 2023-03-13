import { getApiHealthCheckSum } from '@/services/portal/api';
import ReactEcharts from 'echarts-for-react';
import React, { useEffect, useState } from 'react';
import '../portal.less';

const Health: React.FC = () => {
    const [resourceSuccess, setResourceSuccess] = useState<number>();
    const [resourceApiFailed, setResourceApiFailed] = useState<number>();
    const [resourceOther, setResourceOther] = useState<number>();
    const [dataSuccess, setDataSuccess] = useState<number>();
    const [dataApiFailed, setDataApiFailed] = useState<number>();
    const [dataOther, setDataOther] = useState<number>();
    useEffect(() => {
        getApiHealthCheckSum().then((rsp) => {
            const dataSuccess = rsp.dataSource.success;
            const dataApiFailed = rsp.dataSource.apiFailed;
            const dataOther = rsp.dataSource.other;
            const resourceSuccess = rsp.resource.success;
            const resourceApiFailed = rsp.resource.apiFailed;
            const resourceOther = rsp.resource.other;
            setResourceSuccess(resourceSuccess);
            setResourceApiFailed(resourceApiFailed);
            setResourceOther(resourceOther);
            setDataSuccess(dataSuccess);
            setDataApiFailed(dataApiFailed);
            setDataOther(dataOther);
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
                name: 'Health',
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
                    { value: resourceSuccess, name: '成功' },
                    { value: resourceOther, name: '其他原因' },
                    { value: resourceApiFailed, name: 'API' },
                ],
            },
            {
                name: 'Health',
                type: 'pie',
                radius: ['45%', '60%'],
                labelLine: {
                    length: 30,
                },
                label: {
                    show: false,
                },
                data: [
                    { value: dataSuccess, name: '成功' },
                    { value: dataApiFailed, name: 'API' },
                    { value: dataOther, name: '其他原因' },
                ],
            },
        ],
        color: ['#91cc75', '#fc8452', '#ee6666'],
    };

    return (
        <div className={'portal-card'}>
            <div className={'header title'}>健康度</div>
            <ReactEcharts
                option={option}
                // @ts-ignore
                resourceSuccess={resourceSuccess}
                resourceApiFailed={resourceApiFailed}
                resourceOther={resourceOther}
                dataSuccess={dataSuccess}
                dataApiFailed={dataApiFailed}
                dataOther={dataOther}
                style={{ height: '100%', width: '100%' }}
            />
        </div>
    );
};

export default Health;
