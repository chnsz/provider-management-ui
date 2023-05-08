import ApiCoverage from '@/pages/Portal/components/api-coverage';
import ProviderListCard from '@/pages/Portal/components/provider-list-card';
import ProviderPlanningCard from '@/pages/Portal/components/provider-planning-card';
import ServiceNoticeCard from '@/pages/Portal/components/service-notice-card';
import ServiceStatisticsCard from '@/pages/Portal/components/service-statistics-card';
import React, {useEffect, useState} from 'react';
import {useLocation} from "@@/exports";
import FeatureCard from "@/pages/Portal/components/feature-card";
import TaskCard from "@/pages/Portal/components/task-card";

const getProductName = (hash: string) => {
    const arr = hash.split('/');
    if (arr.length < 3) {
        return 'ECS';
    }
    return arr[2]
}

const Portal: React.FC = () => {
    const location = useLocation()
    const [productName, setProductName] = useState<string>(getProductName(location.hash));

    useEffect(() => {
        const productName = getProductName(location.hash);
        setProductName(productName);
    }, [location]);

    return (
        <div style={{height: 'calc(100vh - 120px)'}}>
            <div style={{height: '24px'}}/>
            <ServiceStatisticsCard productName={productName}/>
            <div style={{marginTop: '24px', display: 'flex', height: '400px'}}>
                <div style={{width: 'calc(33.33% - 13.33px)'}}>
                    <ApiCoverage productName={productName}/>
                </div>
                <div style={{width: '20px'}}></div>
                <div style={{width: 'calc(33.33% - 13.33px)'}}>
                    <FeatureCard productName={productName}/>
                </div>
                <div style={{width: '20px'}}></div>
                <div style={{width: 'calc(33.33% - 13.33px)'}}>
                    <ServiceNoticeCard productName={productName}/>
                </div>
            </div>
            <div style={{marginTop: '24px', display: 'flex', height: '600px'}}>
                <div style={{width: 'calc(50% - 10px)'}}>
                    <ProviderPlanningCard productName={productName}/>
                </div>
                <div style={{width: '20px'}}></div>
                <div style={{width: 'calc(50% - 10px)'}}>
                    <TaskCard productName={productName}/>
                </div>
            </div>
            <div style={{marginTop: '24px', height: '540px'}}>
                <ProviderListCard productName={productName}/>
            </div>
        </div>
    );
};

export default Portal;
