declare namespace Api {
    type Detail = {
        id: number;
        productGroup: string;
        productName: string;
        apiGroup: string;
        apiName: string;
        apiNameEn: string;
        method: string;
        uri: string;
        uriShort: string;
        publishStatus: string;
        useRemark: string;
        definition: string;
        lastSyncDate: string;
        created: string;
        updated: string;

        providerList: null;
    };

    type Group = {
        apiGroup: string;
        usedCount: number;
        needAnalysisCount: number;
        planningCount: number;
        missingCount: number;
        ignoreCount: number;
    };

    type queryListParams = {
        productName?: string;
        apiGroup?: string;
        apiName?: string;
        uri?: string;
        useRemark?: string;
        publishStatus?: string;
        id?: number[];
    };
}
