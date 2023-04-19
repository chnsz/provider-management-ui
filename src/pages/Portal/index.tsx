import React, {useState} from "react";
import {Space, Tooltip} from "antd";
import './portal.less'
import ServiceSumList from "@/pages/Portal/components/service-sum-list";
import {InfoCircleOutlined} from "@ant-design/icons";

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

const tooltip = <div className={'tooltip'}>
    <Tooltip title={<div>对接率：<br/>对接的服务数 / 已开放 API 的服务数</div>}>
        <InfoCircleOutlined/>
    </Tooltip>
</div>;

const ServiceSum: React.FC<{ data: ServiceSumData }> = ({data}) => {
    const rate = data.allApiCount > 0 ? data.allApiUsed / data.allApiCount * 100 : 0;
    const coreRate = data.coreApiCount > 0 ? data.coreApiUsed / data.coreApiCount * 100 : 0;
    const mainRate = data.mainApiCount > 0 ? data.mainApiUsed / data.mainApiCount * 100 : 0;
    const emergingRate = data.emergingApiCount > 0 ? data.emergingApiUsed / data.emergingApiCount * 100 : 0;
    const otherRate = data.otherApiCount > 0 ? data.otherApiUsed / data.otherApiCount * 100 : 0;

    return <div className={'service-sum'}>
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
                <div className={'value'}>{data.allApiUsed} / {data.allApiCount}</div>
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
                <div className={'value'}>{data.coreApiUsed} / {data.coreApiCount}</div>
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
                <div className={'value'}>{data.mainApiUsed} / {data.mainApiCount}</div>
            </div>
        </div>
        <div className={'card'}>
            {tooltip}
            <div className={'primary-desc'}>
                <div className={'label'}>
                    <img src="/icons/emerging.svg" alt="新兴服务对接率"/>
                </div>
                <div className={'value'}>{emergingRate.toFixed(2)}%</div>
            </div>
            <div className={'second-desc'}>
                <div className={'label'}>新兴服务对接率</div>
                <div className={'value'}>{data.emergingApiUsed} / {data.emergingApiCount}</div>
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
                <div className={'value'}>{data.otherApiUsed} / {data.otherApiCount}</div>
            </div>
        </div>
    </div>
}

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
        }

        data.productSumList.forEach(t => {
            sumData.totalService++;
            switch (t.level) {
                case '核心服务':
                    sumData.coreService++;
                    if (t.apiCoverage !== '0.00%') {
                        sumData.serviceUsed++;
                        sumData.coreServiceUsed++;
                    }
                    break;
                case '主力服务':
                    sumData.mainServiceCount++;
                    if (t.apiCoverage !== '0.00%') {
                        sumData.serviceUsed++;
                        sumData.mainServiceUsed++;
                    }
                    break;
                case '新兴服务':
                    sumData.emergingService++;
                    if (t.apiCoverage !== '0.00%') {
                        sumData.serviceUsed++;
                        sumData.emergingServiceUsed++;
                    }
                    break;
                default:
                    sumData.otherService++;
                    if (t.apiCoverage !== '0.00%') {
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

        /*setServiceSumData({
            allApiCount: data.allApiCount,
            allApiUsed: data.allApiUsed,
            coreApiCount: data.coreApiCount,
            coreApiUsed: data.coreApiUsed,
            emergingApiCount: data.emergingApiCount,
            emergingApiUsed: data.emergingApiUsed,
            mainApiCount: data.mainApiCount,
            mainApiUsed: data.mainApiUsed
        });*/
    }

    return <div className={'portal'}>
        <Space direction={'vertical'} style={{width: '100%'}} size={20}>
            <ServiceSum data={serviceSumData}/>
            <ServiceSumList onload={serviceSumDataLoad}/>
        </Space>
    </div>
}

export default Portal;
