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

    type ServiceNews = {
        title: string;
        created: string;
    };
}
