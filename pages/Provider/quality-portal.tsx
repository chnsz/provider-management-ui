import {createFromIconfontCN} from '@ant-design/icons';
import React, {useEffect, useState} from 'react';
import './provider.less';
import '../Partner/partner.less';
import QualitySum from "@/pages/Provider/quality-sum";
import ProviderBase from "@/pages/Provider/provider-base";
import ProviderDocsIssue from "@/pages/Partner/components/provider_docs_issue";
import {getProviderSyncSum} from "@/services/provider/api";
import CustomBreadcrumb from "@/components/Breadcrumb";
import QualityPersonal from './quality-personal';
import { useModel } from 'umi';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const IconFont = createFromIconfontCN({
    scriptUrl: [
        '//at.alicdn.com/t/font_1788044_0dwu4guekcwr.js', // icon-javascript, icon-java, icon-shoppingcart (overridden)
        '//at.alicdn.com/t/font_1788592_a5xf2bdic3u.js', // icon-shoppingcart, icon-python
        '//at.alicdn.com/t/c/font_4039325_co8qvh6ah1.js',
    ],
});

const ProviderDocsIssueView = () => {
    const [providerSyncSum, setProviderSyncSum] = useState<Provider.ProviderSyncSum[]>([]);

    const loadData = () => {
        getProviderSyncSum().then(t => {
            setProviderSyncSum(t.items);
        });
    }
    useEffect(() => {
        loadData()
    }, []);
    

    return <div className={'partner'} style={{background: '#fff'}}>
        <div className={'custom-title'}>资源文档问题</div>
        <div style={{padding: '20px'}}>
            <ProviderDocsIssue data={providerSyncSum} loadData={loadData} short/>
        </div>
    </div>
}

const Provider: React.FC = () => {
    const [qualityPersonData, setQualityPersonData] = useState<Portal.OwnerSum[]>([]);
    const { initialState } = useModel('@@initialState');
    const personName = initialState?.currentUser?.realName || '';
    const [reloadFlag, setReloadFlag] = useState(false);
    const onDataChange = (data: Portal.OwnerSum[]) => {
        let productList: any = [];
        data.forEach((item) => {
            item.productSumList.forEach((i) => {
                i['parOwner'] = item.owner;
            })
            productList = productList.concat(item.productSumList);
        })
        const personData = productList.filter((pro: any) => pro.owner === personName);
        setQualityPersonData([...personData]);
        setReloadFlag(false);
    };

    const onLoadData = () => {
        setReloadFlag(true);
    }

    return (
        <div className={'provider'}>
            <CustomBreadcrumb items={[{title: '首页'}, {title: '工作看板'}]}/>
            <QualityPersonal qualityData={qualityPersonData} setReloadFlag ={onLoadData}/>
            <div style={{background: '#fff', margin: '15px 0'}}>
                <QualitySum reloadFlag={reloadFlag} setQualityData={onDataChange}/>
            </div>
            <ProviderDocsIssueView/>
            <div style={{background: '#fff', marginTop: '15px'}}>
                <div className={'custom-title title'}>
                    <div className={'title'}>资源基线</div>
                </div>
                <div className={'provider-list'}>
                    <ProviderBase/>
                </div>
            </div>
        </div>
    );
};

export default Provider;
