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
        apiOfflineInUse: number;

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

        featureCoverage: string;
        featureCovered: number;
        featurePartCovered: number;
        featureNotCovered: number;

        huaweiCloudProviderCount: number;
        huaweiCloudDataSourceCount: number;
        g42ProviderCount: number;
        g42DataSourceCount: number;
        feProviderCount: number;
        feDataSourceCount: number;
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

    type OwnerSum = {
        owner: string;
        productCount: number;
        productBasedCount: number;
        apiCount: number;
        apiNeedAnalysisCount: number;
        providerCount: number;
        providerBasedCount: number;
        fieldChangedCount: number;
        fieldChangedDelayCount: number;
        prCount: number;
        utCount: number;
        utFailedCount: number;
        uTCoverageAvg: number;
        uTCoverageMax: number;
        uTCoverageMin: number;
        bugCount: number;
        providerPlanningCount: number;
        score: number;
        apiChangeDelayCount: number;
        apiChangeExpired: number;
        apiChangePadding: number;
        apiChangeToExpired: number;
        apiChangeUnProcessed: number;

        productSumList: ProductSum[];
    }

    type ProductSum = {
        productName: string;
        owner: string;
        providerCount: number;
        resourceCount: number;
        dataSourceCount: number;
        providerBaseCount: number;
        apiCount: number;
        apiUsedCount: number;
        apiIgnoreCount: number;
        apiNeedAnalysisCount: number;
        apiDeprecatedUsed: number;
        utTestCount: number;
        utTestFailedCount: number;
        utCoverageMax: number;
        utCoverageAvg: number;
        utCoverageMin: number;
        apiChangeCount: number;
        apiChangeOpenCount: number;
        apiChangePendingCount: number;
        planningCount: number;
        planningClosedCount: number;
        bugCount: number;
        score: number;
    }

    type PartnerSum = Record<string, number>
}
