declare namespace Portal {
    type ApiCoverage = {
        covered: number;
        planned: number;
        notAnalyzed: number;
        failing: number;
        notSuitable: number;
    };

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
            product_img: string;
            product_short: string;
            owner: string;
        };
        api_sum: {
            total: number;
            used: number;
            planed: number;
            need_publish: number;
            not_analyzed: number;
            not_suitable: number;
            offline_used: number;
            offline: number;
            unpublished: number;
        };
        provider: {
            total: number;
            resource: number;
            data_source: number;
            tag_support: boolean;
            pre_paid_support: boolean;
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

    type ServiceNews = {
        title: string;
        created: string;
    };

    type ProviderCar = {
        key: number;
        title: string;
        resourceType: string;
        apiCount: number;
        name: string;
        flexible_engine_status: string;
        g42_status: string;
        flexible_engine_param: string;
        g42_status_param: string;
        eps_support: string;
    };
}
