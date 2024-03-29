// @ts-ignore
/* eslint-disable */
declare namespace Api {
    type Report = {
        label: string;
        add?: string[];
        update?: string[];
        delete?: string[];
    };
}
declare namespace Global {
    class Response<T> {
        public data: T | undefined;
        public code: number | undefined;
        public errorMsg: string | undefined;
    }

    class List<T> {
        public items: T | [];
        public total: number | 0;
    }

    type AffectResponse = { affectedRow: number };

    type User = {
        username: string;
        ip: string;
        kbUserId: number;
        githubId: string;
    }

    type CloudName = 'HuaweiCloud' | 'FlexibleEngineCloud' | 'G42Cloud' | 'CTYun';
}
declare namespace Relation {
    type ProviderRelation = {
        id: number;
        dataType: string;
        dataId: number;
        providerType: string;
        providerName: string;
        created?: string;
        updated?: string;
    }

    type ApiRelation = {
        id: number;
        dataType: string;
        dataId: number;
        apiId: number;
        created: string;
        updated: string;
    }
}
