import {request} from 'umi';
import {PMS_PATH} from "@/services/api";

export async function createProviderPlanning(createOpts: ProviderPlanning.CreateOption) {
    return request<ProviderPlanning.ProviderPlanning>(`${PMS_PATH}/provider-planning`, {
        method: 'POST',
        data: createOpts,
    });
}

export async function updateProviderPlanning(id: number, opts: ProviderPlanning.UpdateOption) {
    return request<ProviderPlanning.ProviderPlanning>(`${PMS_PATH}/provider-planning/${id}`, {
        method: 'PATCH',
        data: opts,
    });
}

export async function deleteProviderPlanning(id: number) {
    return request<{ affectedRow: number }>(`${PMS_PATH}/provider-planning/${id}`, {
        method: 'DELETE',
    });
}

/** 查询规划列表 GET /pms/provider-planning/list/{limit}/{offset} */
export async function getProviderPlanningList(
    queryParams: {
        productName?: string[];
        owner?: string[];
        title?: string;
        status?: string[];
        assignee?: string;
    },
    pageSize: number,
    pageNum: number,
) {
    const limit = pageSize;
    const offset = (pageNum - 1) * pageSize;

    return request<Global.List<ProviderPlanning.ProviderPlanning[]>>(
        `${PMS_PATH}/provider-planning/list/${limit}/${offset}`,
        {
            method: 'GET',
            params: {...queryParams},
        },
    );
}

/** 查询规划详情 GET /pms/provider-planning/{id} */
export async function getProviderPlanning(id: number | string) {
    return request<ProviderPlanning.ProviderPlanning>(`${PMS_PATH}/provider-planning/${id}`, {
        method: 'GET',
    });
}

/** 绑定provider到规划 */
export async function bindProviderPlanningProvider(
    id: number,
    providerType: string,
    providerName: string,
) {
    return request<Global.AffectResponse>(`${PMS_PATH}/provider-planning/provider/${id}`, {
        method: 'PUT',
        data: {
            providerList: [{type: providerType, name: providerName}],
        },
    });
}

/** 移除绑定到规划的provider  */
export async function unbindProviderPlanningProvider(
    id: number,
    providerType: string,
    providerName: string,
) {
    return request<Global.AffectResponse>(`${PMS_PATH}/provider-planning/provider/${id}`, {
        method: 'PATCH',
        data: {
            providerList: [{type: providerType, name: providerName}],
        },
    });
}

/** 绑定API到规划 */
export async function bindProviderPlanningApi(id: number, apiIdList: number[]) {
    return request<Global.AffectResponse>(`${PMS_PATH}/provider-planning/api/${id}`, {
        method: 'PUT',
        data: {
            apiIdList: apiIdList,
        },
    });
}

/** 移除绑定到规划的API  */
export async function unbindProviderPlanningApi(id: number, apiIdList: number[]) {
    return request<Global.AffectResponse>(`${PMS_PATH}/provider-planning/api/${id}`, {
        method: 'PATCH',
        data: {
            apiIdList: apiIdList,
        },
    });
}

export async function createPlanningKbTask(id: number) {
    return request<ProviderPlanning.ProviderPlanning>(`${PMS_PATH}/provider-planning/kanboard-task/${id}`, {method: 'PUT'});
}

export async function getProviderPlanningListByOwner(owner: string) {
    return request<Global.List<ProviderPlanning.ProviderPlanning[]>>(
        `${PMS_PATH}/provider-planning/owner/list`,
        {
            method: 'GET',
            params: {owner: owner},
        },
    );
}
