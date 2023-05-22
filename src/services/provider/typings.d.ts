declare namespace Provider {
    type Provider = {
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
        "id": number;
        "repository": string;
        "prNumber": number;
        "title": string;
        "state": string;
        "labels": string;
        "prType": string;
        "userName": string;
        "mergedAt": string;
        "closedAt": string;
        "created": string;
        "updated": string;
    }
}
