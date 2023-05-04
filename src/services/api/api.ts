import { request } from '@@/exports';

const servicePath: string = '/pms';

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

    return request<Global.List<Api.ApiList[]>>(`${servicePath}/api/list/${limit}/${offset}`, {
        method: 'GET',
        params: { ...queryParams },
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
    return request<Global.List<Api.ApiChange[]>>(`${servicePath}/api/${id}/change-history`, {
        method: 'GET',
        params: { ...queryParams },
    });
}

/** 查询api分组列表 Get /api/groups/list */
export async function getApiGroupsSum(productName: string) {
    return request<Api.ApiGroups[]>(`${servicePath}/api/groups/list/?productName=${productName}`, {
        method: 'GET',
    });
}
