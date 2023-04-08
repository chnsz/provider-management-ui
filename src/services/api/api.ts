import { request } from '@@/exports';

const basePath = '/pms';

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
