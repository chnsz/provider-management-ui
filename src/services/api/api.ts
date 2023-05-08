import { request } from '@@/exports';

const basePath: string = '/pms';

/** 查询api列表 Get /api/list/{limit}/{offset} */
export async function getApiListSum(
    queryParams: {
        productName?: string;
        title?: string;
        status?: string;
        assignee?: string;
    },
    pageSize: number,
    pageNum: number,
) {
    const limit = pageSize;
    const offset = (pageNum - 1) * pageSize;

    return request<Global.List<Api.ApiList[]>>(`${basePath}/api/list/${limit}/${offset}`, {
        method: 'GET',
        params: queryParams,
    });
}

/** 查询api列表 Get /api/{id}/change-history */
export async function getApiChangeSum(
    queryParams: {
        productName?: string;
        title?: string;
        status?: string;
        assignee?: string;
    },
    id: number,
) {
    return request<Global.List<Api.ApiChange[]>>(`${basePath}/api/${id}/change-history`, {
        method: 'GET',
        params: { ...queryParams },
    });
}

/** 查询api分组列表 Get /api/groups/list */
export async function getApiGroupsSum() {
    return request<Api.ApiGroups[]>(`${basePath}/api/groups/list/?productName=ECS`, {
        method: 'GET',
    });
}

/** 查询API列表 GET /pms/api/list/{limit}/{offset} */
export async function getApiDetailList(
    params: Api.queryListParams,
    pageSize: number,
    pageNum: number,
) {
    const limit = pageSize;
    const offset = (pageNum - 1) * pageSize;

    return request<Global.List<Api.Detail[]>>(`${basePath}/api/list/${limit}/${offset}`, {
        method: 'GET',
        params: { ...params },
    });
}

export async function getApiGroupList(productName: string) {
    return request<Api.Group[]>(`${basePath}/api/groups/list`, {
        method: 'GET',
        params: { productName: productName },
    });
}

export async function getApiChangeDetail(id: number | string) {
    return request<Api.ChangeDetail>(`${basePath}/api/change-detail/${id}`, {
        method: 'GET',
    });
}

export async function getApiChangeHistory(id: number | string) {
    return request<Global.List<Api.ChangeHistory[]>>(`${basePath}/api/${id}/change-history`, {
        method: 'GET',
    });
}
