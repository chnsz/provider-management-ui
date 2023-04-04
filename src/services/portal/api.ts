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

/** 查询API对接汇总数据 GET /portal/service-statistics-card-sum */
export async function getApiPanelSum() {
    return request<Portal.ProductSumPanel>('/portal/service-statistics-card-sum', {
        method: 'GET',
    });
}

/** 各服务最新动态 GET /portal/news-info */
export async function getApiNewsInfo() {
    return request<Portal.ServiceNews[]>('/portal/news-info', { method: 'GET' });
}

/** 资源信息详情 GET /portal/provider-car */
export async function getProviderCar() {
    return request<Portal.ProviderCar[]>('/portal/provider-car', { method: 'GET' });
}

export async function getResourcePlanSum() {
    return request<Portal.getResourcePlan[]>('/portal/resource-plan-sum', { method: 'GET' });
}

/** 资源信息详情 GET /pms/provider-list */
export async function getProviderList(params: {
    /** 当前的页码 */
    current: number;
    /** 页面的容量 */
    pageSize: number;
    /** 云名称 */
    cloudName?: string;
    /** 资源类型 */
    resourceType?: string;
    /** 资源名称 */
    resourceName?: string;
    /** 状态 */
    status?: string;
}) {
    return request<Portal.responseResult<Portal.ProviderList>>(
        `/pms/provider/list/${params.pageSize}/${params.current}`,
        {
            method: 'GET',
            params: {
                ...params,
            },
        },
    );
}

/** 查询Catalog列表 GET /pms/provider/catalogs */
export async function getCateType() {
    return request<Portal.responseResult<string>>(`/pms/provider/catalogs`, { method: 'GET' });
}
