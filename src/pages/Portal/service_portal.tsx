import ApiCoverage from '@/pages/Portal/components/api-coverage';
import FeatureCard from '@/pages/Portal/components/feature-card';
import ProviderListCard from '@/pages/Portal/components/provider-list-card';
import ProviderPlanningCard from '@/pages/Portal/components/provider-planning-card';
import ServiceNoticeCard from '@/pages/Portal/components/service-notice-card';
import ServiceStatisticsCard from '@/pages/Portal/components/service-statistics-card';
import {useLocation} from 'umi';
import React, {useEffect, useState} from 'react';

const getProductName = (hash: string) => {
    const arr = hash.split('/');
    if (arr.length < 3) {
        return 'ECS';
    }
    return arr[2];
};

const Portal: React.FC = () => {
    const location = useLocation();
    const [productName, setProductName] = useState<string>(getProductName(location.hash));

    useEffect(() => {
        const productName = getProductName(location.hash);
        setProductName(productName);
    }, [location]);

    return (
        <div style={{height: 'calc(100vh - 120px)'}}>
            <div style={{height: '24px'}}/>
            <ServiceStatisticsCard productName={productName}/>
            <div style={{marginTop: '24px', display: 'flex', height: '1200px'}}>
                <div style={{width: 'calc(66.66% - 10px)'}}>
                    <div style={{height: '600px'}}>
                        <ProviderListCard productName={productName}/>
                    </div>
                    <div style={{height: '600px', marginTop: '24px'}}>
                        <ProviderPlanningCard productName={productName}/>
                    </div>
                </div>
                <div style={{width: '20px'}}/>
                <div style={{width: 'calc(33.33% - 10px)'}}>
                    <div style={{height: '376px'}}>
                        <ApiCoverage productName={productName}/>
                    </div>
                    <div style={{height: '400px', marginTop: '24px'}}>
                        <FeatureCard productName={productName}/>
                    </div>
                    <div style={{height: '400px', marginTop: '24px'}}>
                        <ServiceNoticeCard productName={productName}/>
                    </div>
                </div>
            </div>
            {/*<div style={{marginTop: '24px', display: 'flex', height: '600px'}}>
                <div style={{width: 'calc(66.66% - 10px)'}}>
                    <ProviderListCard productName={productName}/>
                </div>
                <div style={{width: '20px'}}></div>
                <div style={{width: 'calc(33.33% - 10px)'}}>
                    <FeatureCard productName={productName}/>
                </div>
            </div>
            <div style={{marginTop: '24px', display: 'flex', height: '600px'}}>
                <div style={{width: 'calc(66.66% - 10px)'}}>
                    <ProviderPlanningCard productName={productName}/>
                </div>
                <div style={{width: '20px'}}></div>
                <div style={{width: 'calc(33.33% - 10px)'}}>
                    <ServiceNoticeCard productName={productName}/>
                </div>
            </div>
            <div style={{marginTop: '24px', display: 'flex', height: '420px'}}>
                <div style={{width: 'calc(33.33% - 13.33px)'}}>
                    <ApiCoverage productName={productName}/>
                </div>
                <div style={{width: '20px'}}></div>
                <div style={{width: 'calc(33.33% - 13.33px)'}}>
                    <FeatureCard productName={productName}/>
                </div>
                <div style={{width: '20px'}}></div>
                <div style={{width: 'calc(33.33% - 13.33px)'}}>
                    <TaskCard productName={productName}/>
                </div>
            </div>*/}
        </div>
    );
};

export default Portal;
