import { request } from '@@/exports';

/** 查询API对接汇总数据 GET /portal/api-coverage-sum */
export async function getApiCoverageSum() {
    return request<Portal.ApiCoverage>('/portal/api-coverage-sum', { method: 'GET' });
}

/** 查询API对接汇总数据 GET /portal/provider-health-check-sum */
export async function getProviderHealthCheckSum() {
    return request<Portal.ProviderHealthCheckSum>('/portal/provider-health-check-sum', {
        method: 'GET',
    });
}

/** 查询服务动态信息 GET /portal/news-info */
export async function getApiNewsInfo() {
    return request<Portal.ServiceNews[]>('/portal/news-info', { method: 'GET' });
}

/** 查询API对接汇总数据 GET /portal/service-statistics-card-sum */
export async function getApiPanelSum() {
    return request<Portal.ProductSumPanel>('/portal/service-statistics-card-sum', {
        method: 'GET',
    });
}

export async function getResourcePlanSum() {
    return request<Portal.getResourcePlan[]>('/portal/resource-plan-sum', { method: 'GET' });
}
