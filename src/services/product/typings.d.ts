declare namespace Product {
    type Product = {
        // 主键
        id: string;
        // 领域
        productGroup: string;
        // 归属服务
        productName: string;
        // 标题
        productIcon?: string;
        // 页面地址
        owner?: string;
        // 创建日期
        created: string;
        // 更新日期
        updated: string;
    };
}
