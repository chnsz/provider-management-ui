import {request} from '@@/exports';

const basePath = '/pms';

type queryProviderParams = {
    cloudName: 'HuaweiCloud' | 'FlexibleEngineCloud' | 'G42Cloud';
    productName?: string;
    type?: 'Resource' | 'DataSource';
    catalog?: string;
    name?: string;
};

export async function getProviderList(
    params: queryProviderParams,
    pageSize: number,
    pageNum: number,
) {
    const limit = pageSize;
    const offset = (pageNum - 1) * pageSize;

    return request<Global.List<Provider.Provider[]>>(
        `${basePath}/provider/list/${limit}/${offset}`,
        {
            method: 'GET',
            params: params,
        },
    );
}

export async function getProviderScoreList(owners: string[], prStatus: string, startDate: string, endStart: string) {
    return request<Global.List<Provider.ProviderScoreDto[]>>(`${basePath}/provider/score/list`, {
        method: 'GET',
        params: {
            owner: owners,
            prStatus,
            startDate,
            endStart,
        },
    });
}

export async function changeUtFlag(id: number, state: string) {
    return request<Global.AffectResponse>(`${basePath}/provider/${id}/ut-flag/${state}`, {
        method: 'PATCH',
    });
}

export async function changeEpsSupport(id: number, state: string) {
    return request<Global.AffectResponse>(`${basePath}/provider/${id}/eps-state/${state}`, {
        method: 'PATCH',
    });
}

export async function changePrePaidSupport(id: number, state: string) {
    return request<Global.AffectResponse>(`${basePath}/provider/${id}/pre-paid-state/${state}`, {
        method: 'PATCH',
    });
}

export async function changeTagSupport(id: number, state: string) {
    return request<Global.AffectResponse>(`${basePath}/provider/${id}/tag-state/${state}`, {
        method: 'PATCH',
    });
}

export async function changeQualityStatus(id: number, state: string) {
    return request<Global.AffectResponse>(`${basePath}/provider/${id}/quality-status/${state}`, {
        method: 'PATCH',
    });
}

export async function getPrList(owner: string, prStatus: string, providerType: string, providerName: string, startDate: string, endStart: string) {
    return request<Global.List<Provider.PullRequest[]>>(`${basePath}/provider/pr/list`, {
        method: 'GET',
        params: {
            owner,
            prStatus,
            providerType,
            providerName,
            startDate,
            endStart,
        },
    });
}

export async function getProviderBaseAllSum() {
    return request<Global.List<Provider.ProviderBaseSum[]>>(`${basePath}/provider-api-base/sum`, {
        method: 'GET',
    });
}

export async function getProviderApiBaseSum(providerType: string, providerName: string) {
    return request<Global.List<Provider.ProviderBaseSum[]>>(`${basePath}/provider-api-base/${providerType}/${providerName}/sum`, {
        method: 'GET',
    });
}

export async function getProviderBaseList(apiId: number, providerType: string, providerName: string) {
    return request<Global.List<Provider.ProviderBase[]>>(`${basePath}/provider-api-base/list`, {
        method: 'GET',
        params: {
            apiId: apiId,
            providerType: providerType,
            providerName: providerName,
        },
    });
}

export async function saveProviderBase(apiId: number,
                                       providerType: string,
                                       providerName: string,
                                       inputList: Provider.ProviderBase[],
                                       outputList: Provider.ProviderBase[]
) {
    return request<Global.Response<string>>(`${basePath}/provider-api-base/${providerType}/${providerName}/${apiId}/action/save`, {
        method: 'POST',
        data: {
            inputList: inputList,
            outputList: outputList,
        },
    });
}
