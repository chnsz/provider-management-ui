import {request} from '@@/exports';

const basePath = '/pms';

/** 查询API对接汇总数据 GET /portal/provider-health-check-sum */
export async function getProviderHealthCheckSum() {
    return request<Portal.ProviderHealthCheckSum>('/portal/provider-health-check-sum', {
        method: 'GET',
    });
}

/** 查询API对接汇总数据 GET /portal/service-statistics-card-sum */
export async function getApiPanelSum(productName: string) {
    return request<Portal.ProductSumPanel>(`${basePath}/portal/product/sum/${productName}`, {
        method: 'GET',
    });
}

export async function getServiceSumList(ownerArr: string[], levelArr: string[]) {
    return request<Portal.PortalSum>(`${basePath}/portal/product/sum`, {
        method: 'GET',
        params: {owner: ownerArr, level: levelArr}
    });
}
