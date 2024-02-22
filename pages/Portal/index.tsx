import ServiceSumList from '@/pages/Portal/components/service-sum-list';
import {InfoCircleOutlined} from '@ant-design/icons';
import {Space, Tooltip} from 'antd';
import React, {useEffect, useState} from 'react';
import './portal.less';
import {getProviderTypeSum} from "@/services/provider/api";

interface ServiceSumData {
    allApiCount: number;
    allApiUsed: number;
    coreApiCount: number;
    coreApiUsed: number;
    mainApiCount: number;
    mainApiUsed: number;
    emergingApiCount: number;
    emergingApiUsed: number;
    otherApiCount: number;
    otherApiUsed: number;
}

const tooltip = (
    <div className={'tooltip'}>
        <Tooltip
            title={
                <div>
                    对接率：
                    <br/>
                    对接的服务数 / 已开放 API 的服务数
                </div>
            }
        >
            <InfoCircleOutlined/>
        </Tooltip>
    </div>
);

const providerSumTooltip = (
    <div className={'tooltip'}>
        <Tooltip title={'已发布的资源，即在可以通过 Terraform 官网可以查到的'}>
            <InfoCircleOutlined/>
        </Tooltip>
    </div>
);

const ServiceSum: React.FC<{ data: ServiceSumData }> = ({data}) => {
    const [providerTypeSum, setProviderTypeSum] = useState<Provider.TypeSum>({resource: 0, dataSource: 0});
    const rate = data.allApiCount > 0 ? (data.allApiUsed / data.allApiCount) * 100 : 0;
    const coreRate = data.coreApiCount > 0 ? (data.coreApiUsed / data.coreApiCount) * 100 : 0;
    const mainRate = data.mainApiCount > 0 ? (data.mainApiUsed / data.mainApiCount) * 100 : 0;
    const otherRate = data.otherApiCount > 0 ? (data.otherApiUsed / data.otherApiCount) * 100 : 0;

    useEffect(() => {
        getProviderTypeSum().then(t => {
            setProviderTypeSum(t);
        })
    }, [])

    return (
        <div className={'service-sum'}>
            <div style={{
                margin: '0 8px',
                background: '#fff',
                borderRadius: '8px',
                textAlign: 'center',
                width: '140px',
            }}>
                <div style={{
                    position: 'relative',
                    right: '-47px',
                    top: '4px',
                    display: 'inline-block',
                    color: 'rgba(0, 0, 0, 0.45)'
                }}>
                    {providerSumTooltip}
                </div>
                <div style={{marginTop: '-16px'}}>
                    <div style={{fontSize: '14px', paddingBottom: '4px'}}>Resource</div>
                    <div style={{fontSize: '20px', fontWeight: '400', color: '#1677ff'}}>
                        {providerTypeSum.resource}
                    </div>
                </div>
                <div style={{marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #f0f0f0'}}>
                    <div style={{fontSize: '14px', paddingBottom: '6px'}}>DataSource</div>
                    <div style={{fontSize: '20px', fontWeight: '400', color: '#1677ff'}}>
                        {providerTypeSum.dataSource}
                    </div>
                </div>
            </div>

            <div className={'card'}>
                {tooltip}
                <div className={'primary-desc'}>
                    <div className={'label'}>
                        <img src="/icons/all.svg" alt="服务总对接率"/>
                    </div>
                    <div className={'value'}>{rate.toFixed(2)}%</div>
                </div>
                <div className={'second-desc'}>
                    <div className={'label'}>服务总对接率</div>
                    <div className={'value'}>
                        {data.allApiUsed} / {data.allApiCount}
                    </div>
                </div>
            </div>
            <div className={'card'}>
                {tooltip}
                <div className={'primary-desc'}>
                    <div className={'label'}>
                        <img src="/icons/core.svg" alt="核心服务对接率"/>
                    </div>
                    <div className={'value'}>{coreRate.toFixed(2)}%</div>
                </div>
                <div className={'second-desc'}>
                    <div className={'label'}>核心服务对接率</div>
                    <div className={'value'}>
                        {data.coreApiUsed} / {data.coreApiCount}
                    </div>
                </div>
            </div>
            <div className={'card'}>
                {tooltip}
                <div className={'primary-desc'}>
                    <div className={'label'}>
                        <img src="/icons/main.svg" alt="核心服务对接率"/>
                    </div>
                    <div className={'value'}>{mainRate.toFixed(2)}%</div>
                </div>
                <div className={'second-desc'}>
                    <div className={'label'}>主力服务对接率</div>
                    <div className={'value'}>
                        {data.mainApiUsed} / {data.mainApiCount}
                    </div>
                </div>
            </div>
            <div className={'card'}>
                {tooltip}
                <div className={'primary-desc'}>
                    <div className={'label'}>
                        <img src="/icons/other.svg" alt="其他服务对接率"/>
                    </div>
                    <div className={'value'}>{otherRate.toFixed(2)}%</div>
                </div>
                <div className={'second-desc'}>
                    <div className={'label'}>其他服务对接率</div>
                    <div className={'value'}>
                        {data.otherApiUsed} / {data.otherApiCount}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Portal: React.FC = () => {
    const [serviceSumData, setServiceSumData] = useState<ServiceSumData>({
        allApiCount: 0,
        allApiUsed: 0,
        coreApiCount: 0,
        coreApiUsed: 0,
        emergingApiCount: 0,
        emergingApiUsed: 0,
        mainApiCount: 0,
        mainApiUsed: 0,
        otherApiCount: 0,
        otherApiUsed: 0,
    });

    const serviceSumDataLoad = (data: Portal.PortalSum) => {
        const sumData = {
            totalService: 0,
            serviceUsed: 0,
            coreService: 0,
            coreServiceUsed: 0,
            emergingService: 0,
            emergingServiceUsed: 0,
            mainServiceCount: 0,
            mainServiceUsed: 0,
            otherService: 0,
            otherServiceUsed: 0,
        };

        data.productSumList.forEach((t) => {
            sumData.totalService++;
            switch (t.level) {
                case '核心服务':
                    sumData.coreService++;
                    if (t.huaweiCloudProviderCount + t.huaweiCloudDataSourceCount > 0) {
                        sumData.serviceUsed++;
                        sumData.coreServiceUsed++;
                    } else {
                        console.log(t)
                    }
                    break;
                case '主力服务':
                    sumData.mainServiceCount++;
                    if (t.huaweiCloudProviderCount + t.huaweiCloudDataSourceCount > 0) {
                        sumData.serviceUsed++;
                        sumData.mainServiceUsed++;
                    }
                    break;
                case '新兴服务':
                    sumData.emergingService++;
                    if (t.huaweiCloudProviderCount + t.huaweiCloudDataSourceCount > 0) {
                        sumData.serviceUsed++;
                        sumData.emergingServiceUsed++;
                    }
                    break;
                default:
                    sumData.otherService++;
                    if (t.huaweiCloudProviderCount + t.huaweiCloudDataSourceCount > 0) {
                        sumData.serviceUsed++;
                        sumData.otherServiceUsed++;
                    }
            }
        });
        setServiceSumData({
            allApiCount: sumData.totalService,
            allApiUsed: sumData.serviceUsed,
            coreApiCount: sumData.coreService,
            coreApiUsed: sumData.coreServiceUsed,
            emergingApiCount: sumData.emergingService,
            emergingApiUsed: sumData.emergingServiceUsed,
            mainApiCount: sumData.mainServiceCount,
            mainApiUsed: sumData.mainServiceUsed,
            otherApiCount: sumData.otherService,
            otherApiUsed: sumData.otherServiceUsed,
        });
    };

    return (
        <div className={'portal'}>
            <Space direction={'vertical'} style={{width: '100%'}} size={20}>
                <ServiceSum data={serviceSumData}/>

                <ServiceSumList onload={serviceSumDataLoad}/>
            </Space>
        </div>
    );
};

export default Portal;

export const openApiExplorer = (
    productName: string,
    apiNameEn: string,
    uri: string,
    text?: string,
) => {
    const innerText = text || 'API Explorer';
    const title = text ? text + '（点击跳转 API Explorer）' : '（点击跳转 API Explorer）';

    let version = uri.split('/')[1] || '';
    if (version.toLowerCase().indexOf('v') !== 0) {
        version = '';
    }

    let href = `https://apiexplorer.developer.huaweicloud.com/apiexplorer/doc?product=${productName}&api=${apiNameEn}`;
    if (version) {
        href += `&version=${version}`;
    }
    return (
        <a title={title} href={href} target={'_blank'} rel="noreferrer">
            {innerText}
        </a>
    );
};
