declare namespace Portal {
    type ProviderHealthCheckSum = {
        resource: {
            success: number;
            apiFailed: number;
            other: number;
        };
        dataSource: {
            success: number;
            apiFailed: number;
            other: number;
        };
    };

    type ProductSumPanel = {
        product: {
            productIcon: string;
            productName: string;
            owner: string;
        };
        apiSum: {
            total: number;
            used: number;
            need_analysis: number;
            ignore: number;
            missing_api: number;
            planning: number;
            offline: number;
            offline_in_use: number;
            unpublished: number;
        };
        provider: {
            total: number;
            resource: number;
            dataSource: number;
            resource_deprecated: number;
            datasource_deprecated: number;
            pre_paid_support: number;
            tag_support: boolean;
            eps_support: boolean;
        };
    };

    type getResourcePlan = {
        serialNo: number;
        feature: string;
        theme: string;
        priority: string;
        state: string;
        date: string;
        operate: string;
    };

    type ProductSum = {
        productGroup: string;
        productName: string;
        productNameZh: string;
        owner: string;
        level: string;

        apiCoverage: string;
        apiCount: number;
        apiUsed: number;
        apiUseNeedAnalysis: number;
        apiUseIgnore: number;
        apiUseMissingApi: number;
        apiUsePlanning: number;

        planningNew: number;
        planningFreeze: number;
        planningProcessing: number;
        planningMerging: number;
        planningMerged: number;
        planningClosed: number;

        taskNew: number;
        taskFreeze: number;
        taskProcessing: number;
        taskMerging: number;
        taskMerged: number;
        taskClosed: number;

        providerCount: number;
        dataSourceCount: number;
    }

    type PortalSum = {
        productSumList: ProductSum[];

        allApiCount: number;
        allApiUsed: number;
        coreApiCount: number;
        coreApiUsed: number;
        mainApiCount: number;
        mainApiUsed: number;
        emergingApiCount: number;
        emergingApiUsed: number;
    }
}
