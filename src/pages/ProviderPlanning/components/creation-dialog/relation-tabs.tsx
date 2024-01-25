import React, { useRef } from "react";
import type { TabsProps } from "antd";
import { Tabs } from "antd";
import RelationApi from "@/pages/ProviderPlanning/components/creation-dialog/relation-api";
import RelationProvider from "@/pages/ProviderPlanning/components/creation-dialog/relation-provider";
import type { CreateOptions } from "@/pages/ProviderPlanning/components/creation-dialog/provider-planning-editor";

const RelationTabs: React.FC<{
    createOptions: CreateOptions,
    onApiRelationChange: (list: Api.Detail[]) => any,
    onProviderRelationChange: (list: Relation.ProviderRelation[]) => any,
}> = (props) => {
    const apiRef = useRef<HTMLDivElement>(null);
    const providerRef = useRef<HTMLDivElement>(null);

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: <span ref={apiRef}>关联的 API（{props.createOptions.apiList.length}）</span>,
            children: (
                <RelationApi
                    productName={props.createOptions.productName}
                    data={props.createOptions.apiList}
                    onChange={props.onApiRelationChange}
                />
            ),
        },
        {
            key: '2',
            label: <span
                ref={providerRef}>预计创建的 Provider（{(props.createOptions.providerList || []).length})</span>,
            children: (
                <RelationProvider
                    providerList={props.createOptions.providerList}
                    onChange={props.onProviderRelationChange}
                />
            ),
        },
    ];

    return (
        <>
            <Tabs
                // className={props.className}
                // style={props.style}
                defaultActiveKey={'1'}
                items={items}
            />
        </>
    );
};

export default RelationTabs;
