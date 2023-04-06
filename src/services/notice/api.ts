import { request } from '@@/exports';

const basePath = '/pms';
/** 创建动态 POST /pms/notice */
export async function createNotice() {
    return request<Notice.Notice>(`${basePath}/notice`, { method: 'POST' });
}

/** 删除通知动态 DELETE /pms/notice/{id} */
export async function removeNotice(id: string) {
    return request<Global.AffectResponse>(`${basePath}/notice/${id}`, { method: 'DELETE' });
}

/** 查询通知动态明细 GET /pms/notice */
export async function getNotice(id: string) {
    return request<Notice.Notice>(`${basePath}/notice/${id}`, { method: 'GET' });
}

/** 查询通知动态列表 GET /pms/notice */
export async function getNoticeList(
    readState: string,
    productNameArr: string[],
    ownerNameArr: string[],
    limit: number,
    offset: number,
) {
    let params = 'isRead=' + readState;
    if (productNameArr.length > 0) {
        params += '&productName=' + productNameArr.join('&productName=');
    }
    if (ownerNameArr.length > 0) {
        params += '&owner=' + ownerNameArr.join('&owner=');
    }
    return request<Global.List<Notice.Notice[]>>(
        `${basePath}/notice/list/${limit}/${offset}?${params}`,
        {
            method: 'GET',
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
    return request<Global.AffectResponse>(`${basePath}/notice/state/${id}/no`, { method: 'PATCH' });
}
