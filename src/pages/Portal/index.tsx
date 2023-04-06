import ApiCoverage from '@/pages/Portal/components/api-coverage';
import Health from '@/pages/Portal/components/health';
import ProviderListCard from '@/pages/Portal/components/provider-list-card';
import ResourcePlanCard from '@/pages/Portal/components/resource-plan-card';
import ServiceNewsCard from '@/pages/Portal/components/service-news-card';
import ServiceStatisticsCard from '@/pages/Portal/components/service-statistics-card';
import { getNotice } from '@/services/notice/api';
import React from 'react';

const Portal: React.FC = () => {
    getNotice('1').then((d) => {
        console.log('getNotice', d);
    });

    return (
        <div>
            <div style={{ height: '24px' }} />
            <ServiceStatisticsCard />
            <div style={{ marginTop: '24px', display: 'flex', height: '400px' }}>
                <div style={{ width: 'calc(33.33% - 13.33px)' }}>
                    <ApiCoverage />
                </div>
                <div style={{ width: '20px' }}></div>
                <div style={{ width: 'calc(33.33% - 13.33px)' }}>
                    <Health />
                </div>
                <div style={{ width: '20px' }}></div>
                <div style={{ width: 'calc(33.33% - 13.33px)' }}>
                    <ServiceNewsCard />
                </div>
            </div>
            <div style={{ marginTop: '24px', display: 'flex', height: '400px' }}>
                <div style={{ width: 'calc(50% - 10px)' }}>
                    <ResourcePlanCard />
                </div>
                <div style={{ width: '20px' }}></div>
                <div style={{ width: 'calc(50% - 10px)' }}>
                    <ProviderListCard />
                </div>
            </div>
        </div>
    );
};

export default Portal;
