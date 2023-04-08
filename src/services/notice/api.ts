import {request} from '@@/exports';

const basePath = '/pms';

/** 创建动态 POST /pms/notice */
export async function createNotice() {
    return request<Notice.Notice>(`${basePath}/notice`, {method: 'POST'});
}

/** 删除通知动态 DELETE /pms/notice/{id} */
export async function removeNotice(id: string) {
    return request<Global.AffectResponse>(`${basePath}/notice/${id}`, {method: 'DELETE'});
}

/** 查询通知动态明细 GET /pms/notice */
export async function getNotice(id: string) {
    return request<Notice.Notice>(`${basePath}/notice/${id}`, {method: 'GET'});
}

/** 查询通知动态列表 GET /pms/notice */
export async function getNoticeList(params: {
    isRead?: string, productName?: string[], owner?: string[],
}, pageSize: number, pageNum: number) {
    const limit = pageSize;
    const offset = (pageNum - 1) * pageSize;

    return request<Global.List<Notice.Notice[]>>(
        `${basePath}/notice/list/${limit}/${offset}`,
        {
            method: 'GET',
            params: {...params}
        },
    );
}

/** 修改阅读状态 POST /pms/notice */
export async function markNoticeRead(id: string) {
    return request<Global.AffectResponse>(`${basePath}/notice/state/${id}/yes`, {
        method: 'PATCH',
    });
}

/** 修改阅读状态 POST /pms/notice */
export async function markNoticeNotRead(id: string) {
    return request<Global.AffectResponse>(`${basePath}/notice/state/${id}/no`, {method: 'PATCH'});
}
