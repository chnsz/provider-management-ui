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

    type AffectResponse = Response<{ affectedRow: number }>;
}
