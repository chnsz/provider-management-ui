import React, {useEffect, useState} from "react";
import './sum-card.less'
import {Space} from "antd";
import {getCloudSum, getProviderTypeSum} from "@/services/provider/api";
import {CloudName} from "@/global";

const SummaryCard: React.FC = () => {
    const [feProviderSum, setFeProviderSum] = useState<Provider.TypeSum>({resource: 0, dataSource: 0});
    const [g42ProviderSum, setG42ProviderSum] = useState<Provider.TypeSum>({resource: 0, dataSource: 0});
    const [g42CloudSum, setG42CloudSum] = useState<Provider.CloudSum>({apiCount: 0, productCount: 0});

    useEffect(() => {
        getProviderTypeSum(CloudName.FlexibleEngineCloud).then(setFeProviderSum);
        getProviderTypeSum(CloudName.G42Cloud).then(setG42ProviderSum);
        getCloudSum(CloudName.G42Cloud).then(setG42CloudSum);
    }, []);

    return <div className={'sum-card'}>
        <div className={'sum-panel'}>
            <div className={'title'}>法电</div>
            <div style={{display: 'flex', width: '100%'}}>
                <div className={'view'}>
                    <div className={'label'}>Resource</div>
                    <div className={'value'}>{feProviderSum.resource}</div>
                </div>
                <div className={'view'}>
                    <div className={'label'}>DataSource</div>
                    <div className={'value'}>{feProviderSum.dataSource}</div>
                </div>
                <div className={'view'}>
                    <div className={'label'}>服务</div>
                    <div className={'value'}>-</div>
                </div>
                <div className={'view'}>
                    <div className={'label'}>API</div>
                    <div className={'value'}>-</div>
                </div>
                <div className={'view'}>
                    <div className={'label'}>缺失API</div>
                    <div className={'value'}>-</div>
                </div>
            </div>
        </div>
        <div style={{width: '20px'}}></div>
        <div className={'sum-panel'}>
            <div className={'title'}>G42</div>
            <div style={{display: 'flex', width: '100%'}}>
                <div className={'view'}>
                    <div className={'label'}>Resource</div>
                    <div className={'value'}>{g42ProviderSum.resource}</div>
                </div>
                <div className={'view'}>
                    <div className={'label'}>DataSource</div>
                    <div className={'value'}>{g42ProviderSum.dataSource}</div>
                </div>
                <div className={'view'}>
                    <div className={'label'}>服务</div>
                    <div className={'value'}>{g42CloudSum.productCount}</div>
                </div>
                <div className={'view'}>
                    <div className={'label'}>API</div>
                    <div className={'value'}>{g42CloudSum.apiCount}</div>
                </div>
                <div className={'view'}>
                    <div className={'label'}>缺失API</div>
                    <div className={'value'}>-</div>
                </div>
            </div>
        </div>
    </div>
}

export default SummaryCard
