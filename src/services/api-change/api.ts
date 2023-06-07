import { request } from '@@/exports';

const basePath = '/pms';

/** 搜索变更历史记录 Get change-history/list/{limit}/{offset} */
export async function getApiChangeAnalysis(
    params: ApiChange.queryListParams,
    pageSize: number,
    pageNum: number,
) {
    const limit = pageSize;
    const offset = (pageNum - 1) * pageSize;

    return request<Global.List<ApiChange.ApiChange[]>>(
        `${basePath}/api/change-history/list/${limit}/${offset}`,
        {
            method: 'GET',
            params: { ...params },
        },
    );
}
