declare namespace ProductFeature {
    type ProductFeature = {
        // 主键
        id: number;
        // 服务名称
        productName: string;
        // 名称，最大长度：200
        name: string;
        // 来源，api：扫描 API 获得，doc：扫描文档获取，manual：手动录入
        source: 'api' | 'doc' | 'manual';
        // 状态：active：活动状态，ignore：忽略
        state: 'active' | 'ignore';
        apiCount: number,
        apiUsed: number,
        coverageStatus: 'covered' | 'partially_covered' | 'not_covered',
        actualCoverage: 'covered' | 'partially_covered' | 'not_covered',
        // 创建日期
        created: string;
        // 修改日期
        updated: string;

        // 关联的 Provider
        providerList?: Relation.ProviderRelation[];
        // 关联的 API
        apiList?: Relation.ApiRelation[];
    };

    type UpdateOptions = {
        productName?: string;
        name?: string;
        state?: string;
        actualCoverage?: string;
    }

    type CreateOptions = {
        productName?: string;
        name?: string;
        actualCoverage?: string;
    }
}
