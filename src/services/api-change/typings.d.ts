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

    type ApiFieldChange = {
        id: number;
        apiId: number;
        changeEvent: string;
        providerType: string;
        providerName: string;
        paramType: string;
        fieldName: string;
        fieldType: string;
        fieldIn: string;
        fieldDesc: string;
        status: string;
        remark: string;
        daysUsed: number;
        created: string;
        updated: string;

        api: Api.Detail;
    }

    type ApiFieldChangeQuery = {
        owner: string;
        providerType?: string;
        providerName?: string;
        fieldName?: string;
        changeEvent?: string;
        status?: string;
    }
}
