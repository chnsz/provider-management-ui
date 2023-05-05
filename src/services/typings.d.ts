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

    type AffectResponse = Response<{ affectedRow: number }>;
}

declare namespace Relation {
    type ProviderRelation = {
        id: number;
        dataType: string;
        providerType: string;
        providerName: string;
    };

    type ApiRelation = {
        dataType: string;
        dataId: number;
        apiId: number;
    };
}