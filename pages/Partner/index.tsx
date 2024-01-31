import React, { useEffect, useState } from "react";
import './partner.less'
import './../Portal/portal.less';
import { Space } from "antd";
import ProviderDocsIssue from "@/pages/Partner/components/provider_docs_issue";
import ProviderSyncIssue from "@/pages/Partner/components/provider_sync_issue";
import SummaryCard from "@/pages/Partner/components/sum-card";
import { getProviderSyncSum } from "@/services/provider/api";
import ServiceSumList from "@/pages/Portal/components/service-sum-list";
import CustomBreadcrumb from "@/components/Breadcrumb";

const PartnerAnalysis: React.FC = () => {
    const [providerSyncSum, setProviderSyncSum] = useState<Provider.ProviderSyncSum[]>([]);

    const loadData = () => {
        getProviderSyncSum().then(t => {
            setProviderSyncSum(t.items);
        });
    }
    useEffect(() => {
        loadData()
    }, []);

    return <>
        <CustomBreadcrumb items={[{ title: '首页' }, { title: '伙伴云分析' }]} />
        <Space size={20} direction={'vertical'} style={{ width: '100%' }}>
            <SummaryCard />
            <div className={'partner'} style={{ background: '#fff' }}>
                <div className={'custom-title'}>资源文档问题</div>
                <div style={{ padding: '20px' }}>
                    <ProviderDocsIssue data={providerSyncSum} loadData={loadData} />
                </div>
            </div>
            <div className={'partner'} style={{ background: '#fff' }}>
                <div className={'custom-title'}>伙伴云同步信息</div>
                <div style={{ padding: '20px' }}>
                    <ProviderSyncIssue data={providerSyncSum} loadData={loadData} />
                </div>
            </div>
        </Space>
        {/*<Row>
            <Col flex="calc(58% - 10px)">
                <div className={'partner'} style={{background: '#fff', height: '400px'}}>
                    <div className={'custom-title'}>资源文档问题</div>
                    <div style={{padding: '20px'}}>
                        <ProviderDocsIssue data={providerSyncSum} loadData={loadData}/>
                    </div>
                </div>
            </Col>
            <Col flex="20px"></Col>
            <Col flex="calc(42% - 10px)">
                <div className={'partner'} style={{background: '#fff', height: '400px'}}>
                    <div className={'custom-title'}>伙伴云同步信息</div>
                    <div style={{padding: '20px'}}>
                        <ProviderSyncIssue data={providerSyncSum} loadData={loadData}/>
                    </div>
                </div>
            </Col>
        </Row>*/}
        <div className={'partner portal'} style={{}}>
            <ServiceSumList partner onload={() => null} />
        </div>
    </>
}

export default PartnerAnalysis;
