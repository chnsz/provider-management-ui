
declare namespace AutoGenerate {
    type CreateOptions = {
        id: null | string;
        baseInfo: string;
        apiData: string,
        funcFormationData: string,
        funcData: string,
        docsData: string,
        templateData: string
    };

    type ProviderGenerate = {
        id: number;
        productName: string;
        providerType: string;
        providerName: string;
        apiCount: number;
        version: string;
        archiveTag: number;
        lastUpdateBy: string;
        updated: string;
        createdBy: string;
        created: string;
    }

    type queryListParams = {
        productName?: string;
        providerType?: string;
        providerName?: string;
        createdBy?: string;
    };
}
