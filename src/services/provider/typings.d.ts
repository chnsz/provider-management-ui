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
        created: string;
        updated: string;

        apiList: Api.Detail[];
    }
}
