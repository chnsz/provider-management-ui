import { request } from '@@/exports';

const basePath = '/pms';

export async function getProductFeatureList(
    params: {
        productName?: string;
        status?: 'active' | 'ignore';
    },
    pageSize: number,
    pageNum: number,
) {
    const limit = pageSize;
    const offset = (pageNum - 1) * pageSize;

    return request<Global.List<ProductFeature.ProductFeature[]>>(
        `${basePath}/product-feature/list/${limit}/${offset}`,
        {
            method: 'GET',
            params: { ...params },
        },
    );
}
