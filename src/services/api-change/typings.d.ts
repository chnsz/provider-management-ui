declare namespace ApiChange {
    type ApiChange = {
        affectStatus: string;
        apiGroup: string;
        apiId: number;
        apiName: string;
        apiNameEn: string;
        created: string;
        diffContent: string;
        id: number;
        lastVersionDate: string;
        method: string;
        productGroup: string;
        productName: string;
        providers: string;
        remark: string;
        updated: string;
        uri: string;
        uriShort: string;
    };

    type queryListParams = {
        productGroup?: string;
        productName?: string;
        apiGroup?: string;
        apiName?: string;
        affectStatus?: string;
    };
}
