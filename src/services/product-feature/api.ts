import {request} from 'umi';
import {PMS_PATH} from "@/services/api";

export async function getProductFeatureList(
    params: { productName?: string[]; owner?: string[]; status?: 'active' | 'ignore'; },
    pageSize: number,
    pageNum: number,
) {
    const limit = pageSize;
    const offset = (pageNum - 1) * pageSize;

    return request<Global.List<ProductFeature.ProductFeature[]>>(
        `${PMS_PATH}/product-feature/list/${limit}/${offset}`,
        {
            method: 'GET',
            params: {...params},
        },
    );
}

export async function updateProductFeature(id: number, opts: ProductFeature.UpdateOptions) {
    return request<ProductFeature.ProductFeature>(
        `${PMS_PATH}/product-feature/${id}`,
        {
            method: 'PATCH',
            data: opts,
        },
    );
}

export async function createProductFeature(opts: ProductFeature.CreateOptions) {
    return request<ProductFeature.ProductFeature>(
        `${PMS_PATH}/product-feature`,
        {
            method: 'POST',
            data: opts,
        },
    );
}

export async function removeProductFeature(id: number) {
    return request<{ affectedRow: number }>(
        `${PMS_PATH}/product-feature/${id}`,
        {
            method: 'DELETE',
        },
    );
}
