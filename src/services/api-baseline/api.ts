import { request } from '@@/exports';

const basePath = '/pms';

/** 查询API对接汇总数据 GET /portal/service-statistics-card-sum */
export async function getApiBaseline(apiID: number, providerType: string, providerName: string) {
    return request<ApiBaseline.inputList[]>(`${basePath}/provider-api-base/list`, {
        method: 'GET',
        params: { apiID: apiID, providerType: providerType, providerName: providerName },
    });
}
