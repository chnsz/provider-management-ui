import RelationApi from '@/pages/ProviderPlanning/components/relation-api';
import RelationProvider from '@/pages/ProviderPlanning/components/relation-provider';
import type { TabsProps } from 'antd';
import { Tabs } from 'antd';
import React, { useRef } from 'react';

type RelationTabsProps = {
    planning: ProviderPlanning.ProviderPlanning;

    style?: React.CSSProperties;
    className?: string;
};

const getIdList = (apiList: Relation.ApiRelation[]): number[] => {
    return apiList.map((t) => t.apiId).filter((v, i, arr) => arr.indexOf(v) === i);
};

const RelationTabs: React.FC<RelationTabsProps> = (props) => {
    const apiIdList = getIdList(props.planning.apiList || []);
    const apiRef = useRef<HTMLDivElement>(null);
    const providerRef = useRef<HTMLDivElement>(null);

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: <span ref={apiRef}>关联的 API（{apiIdList.length}）</span>,
            children: (
                <RelationApi
                    planningId={props.planning.id}
                    idList={apiIdList}
                    onChange={(a) => {
                        if (apiRef.current) {
                            apiRef.current.innerHTML = `关联的 API（${a.length})`;
                        }
                    }}
                />
            ),
        },
        {
            key: '2',
            label: <span ref={providerRef}>预计创建的 Provider（{(props.planning.providerList || []).length})</span>,
            children: (
                <RelationProvider
                    planningId={props.planning.id}
                    providerList={props.planning.providerList || []}
                    onChange={(a) => {
                        if (providerRef.current) {
                            providerRef.current.innerHTML = `预计创建的 Provider（${a.length})`;
                        }
                    }}
                />
            ),
        },
    ];

    return (
        <>
            <Tabs
                className={props.className}
                style={props.style}
                defaultActiveKey={'1'}
                items={items}
            />
        </>
    );
};

export default RelationTabs;
