import ApiChangeView from '@/pages/api/changes/components/change-view';
import { getApiChangeDetail } from '@/services/api/api';
import React, { useEffect, useState } from 'react';

const ApiChange: React.FC = () => {
    const [productClass, setProductClass] = useState<string>('');
    const [serviceName, setServiceName] = useState<string>('');
    const [apiGroup, setApiGroup] = useState<string>('');
    const [apiName, setApiName] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [apiNameEn, setApiNameEn] = useState<string>('');
    const [providers, setProviders] = useState<string>('');
    const [affectStatus, setAffectStatus] = useState<string>('');
    const [remark, setRemark] = useState<string>('');

    useEffect(() => {
        const hashArr = location.hash.split('/');
        if (hashArr.length === 3) {
            getApiChangeDetail(hashArr[2]).then((data) => {
                setProductClass(data.productGroup);
                setServiceName(data.productName);
                setApiGroup(data.apiGroup);
                setApiName(data.apiName);
                setApiNameEn(data.apiNameEn);
                setContent(data.diffContent);
                setProviders(data.providers);
                setAffectStatus(data.affectStatus);
                setRemark(data.remark);
            });
        }
    }, []);

    return (
        <>
            <div style={{ height: 'calc(100vh - 220px)', padding: '20px 0' }}>
                <ApiChangeView
                    productClass={productClass}
                    serviceName={serviceName}
                    apiName={apiName}
                    apiGroup={apiGroup}
                    content={content}
                    apiNameEn={apiNameEn}
                    affectStatus={affectStatus}
                    providers={providers}
                    remark={remark}
                />
            </div>
        </>
    );
};

export default ApiChange;
