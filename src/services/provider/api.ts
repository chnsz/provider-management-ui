import {request} from '@@/exports';

const basePath = '/pms';

type queryProviderParams = {
    cloudName: 'HuaweiCloud' | 'FlexibleEngineCloud' | 'G42Cloud';
    productName?: string;
    type?: 'Resource' | 'DataSource';
    catalog?: string;
    name?: string;
}

export async function getProviderList(params: queryProviderParams, pageSize: number, pageNum: number) {
    const limit = pageSize;
    const offset = (pageNum - 1) * pageSize;

    return request<Global.List<Provider.Provider[]>>(`${basePath}/provider/list/${limit}/${offset}`, {
        method: 'GET',
        params: params,
    });
}
