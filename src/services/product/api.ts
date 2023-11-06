import {request} from 'umi';
import {PGS_PATH, PMS_PATH} from "@/services/api";

/** 查询服务 GET /pms/product/list */
export async function getProductList(owner?: string) {
    return request<Global.List<Product.Product[]>>(
        `${PMS_PATH}/product/list`,
        {
            method: 'GET',
            params: {owner: owner}
        }
    );
}

/** 查询服务 GET /pms/product/list/page/limit/offset */
export async function getProductListPaged(params: {
                                              productName?: string,
                                              productGroup?: string,
                                              owner?: string,
                                          },
                                          pageSize: number,
                                          pageNum: number,
) {
    const limit = pageSize;
    const offset = (pageNum - 1) * pageSize;

    return request<Global.List<Product.Product[]>>(
        `${PMS_PATH}/product/list/page/${limit}/${offset}`,
        {
            method: 'GET',
            params: params,
        }
    );
}

let userListCache;
let isFetching = false;

/** 查询全部田主 GET /pms/product */
export async function getUserList() {
    if (!userListCache && !isFetching) {
        isFetching = true;

        try {
            userListCache = request<Global.List<Product.User[]>>(`${PMS_PATH}/product/owner/list`, {method: 'GET'});
        } finally {
            isFetching = false;
        }
    }
    return userListCache;
}

export async function updateProduct(id: number, product: Product.Product) {
    return request<Global.List<Product.Product[]>>(
        `${PMS_PATH}/product/${id}`,
        {
            method: 'PATCH',
            data: product,
        }
    );
}

export async function getOwnerUtRecordList(owner: string) {
    return request<Global.List<Product.TestJobRecord[]>>(
        `${PGS_PATH}/test-job/list`,
        {
            method: 'GET',
            params: {owner: owner}
        }
    );
}
