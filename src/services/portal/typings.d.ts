// @ts-ignore
/* eslint-disable */
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

    type ServiceNews = {
        title: string;
        created: string;
    };

    type ServiceNews = {
        title: string;
        created: string;
    };
}
