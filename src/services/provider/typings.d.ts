declare namespace Provider {
    type Provider = {
        id: number;
        cloudName: string;
        type: string;
        productName: string;
        category: string;
        name: string;
        g42Name: string;
        g42RelaTag: 'reference' | 'other';
        g42SchemaSyncStatus: 'yes' | 'no';
        g42Remark: string;
        feName: string;
        feRelaTag: 'reference' | 'other';
        feSchemaSyncStatus: 'yes' | 'no';
        feRemark: string;
        activeStatus: string;
        publishStatus: string;
        releaseDate: string;
        tagSupport: string;
        prePaidSupport: string;
        epsSupport: string;
        owner: string;
        utCoverage: string;
        utFlag: string;
        qualityStatus: string;
        created: string;
        updated: string;
        baseApiTag: 'yes' | 'no';

        apiList: Api.Detail[];
        providerApiList: Api.ProviderApi[];
    };

    type ProviderScoreDto = {
        id: number;
        cloudName: string;
        type: string;
        productName: string;
        category: string;
        name: string;
        activeStatus: string;
        publishStatus: string;
        releaseDate: string;
        tagSupport: string;
        prePaidSupport: string;
        epsSupport: string;
        owner: string;
        utCoverage: string;
        utFlag: string;
        qualityStatus: string;
        created: string;
        updated: string;

        prScore: number;
        utScore: number;
        bugScore: number;
        totalScore: number;
    };

    type PullRequest = {
        id: number;
        repository: string;
        prNumber: number;
        title: string;
        state: string;
        labels: string;
        prType: string;
        userName: string;
        mergedAt: string;
        closedAt: string;
        created: string;
        updated: string;
    };

    type ProviderBaseSum = {
        providerType: string;
        providerName: string;
        owner: string;
        newField: number;
        deprecated: number;
        typeChange: number;
        descChange: number;
        typeAndDescChange: number;
        apiId: number;
        apiDetail?: Api.Detail;
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
    };

    type ProviderBase = {
        id: number;
        apiId: number;
        paramType: string;
        fieldName: string;
        fieldType: string;
        fieldRequired: string;
        fieldIn: string;
        fieldDesc: string;
        useStatus: string;
        schemaName: string;
        remark: string;
        manualTag: string;
        changeEvent?: ApiFieldChange;
    };

    type TypeSum = {
        resource: number;
        dataSource: number;
    };

    type CloudSum = {
        apiCount: number;
        productCount: number;
    };

    type Bug = {
        id: number;
        productName: string;
        title: string;
        providerType: string;
        providerName: string;
        created: string;
        updated: string;
    };

    type ProviderIssueCount = {
        expired: number;
        toExpired: number;
        open: number;
        padding: number;
        monitoring: number;
        merging: number;
        serviceMissing: number;
        apiMissing: number;
        closed: number;
        resource: number;
        dataSource: number;
    }

    type ProviderSyncSum = {
        type: string;
        huaweiCloud: ProviderIssueCount;
        g42Cloud: ProviderIssueCount;
        flexibleEngineCloud: ProviderIssueCount;
    }

    type ProviderIssueSum = {
        cloudName: string,
        type: string;
        category: string;
        providerType: string;
        providerName: string;
        count: string;

        isReference: boolean;
        feTestJobRecord: Product.TestJobRecord;
        g42TestJobRecord: Product.TestJobRecord;
    }

    type ProviderSchema = {
        id: number;
        cloudName: string;
        providerType: string;
        providerName: string;
        fieldCategory: string;
        fieldName: string;
        fieldType: string;
        forceNew: string;
        computed: string;
        requiredFlag: string;
        description: string;
        deprecated: string;
        minItems: number;
        maxItems: number;
        created: string;
        updated: string;
    }

    type ProviderSyncIssue = {
        id: number;
        cloudName: string;
        productName: string;
        providerType: string;
        providerName: string;
        schemaId: number;
        docsId: number;
        type: string;
        fieldCategory: string;
        fieldName: string;
        fieldType: string;
        forceNew: string;
        computed: string;
        requiredFlag: string;
        source: string;
        status: string;
        remark: string;
        daysUsed: number;
        created: string;
        updated: string;

        diffSchema: ProviderSchema;
        isReference: boolean;
    }

    type CategoryProductDto = {
        id: number;
        categoryName: string;
        productName: string;
        tags: string;
    }

    type ApiMonitor = {
        id?: number;
        cloudName: string;
        providerType: string;
        providerName: string;
        type: string;
        status: string;

        productName: string;
        method: string;
        uriShort: string;
        fieldIn: 'header' | 'query' | 'path' | 'body' | '';
        fieldName: string;

        relationId: number;
        relationType: string;
        groupName: string;

        created?: string;
        updated?: string;
    }

    type PartnerConvert = {
        original: string;
        modified: string;
    }
}
