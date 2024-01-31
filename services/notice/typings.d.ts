declare namespace Notice {
    type NotRead = 'no';
    type HasRead = 'yes';
    type CreateOption = {
        // 归属服务
        productName: string;
        // 标题
        title: string;
        // 详细内容
        content?: string;
        // 页面地址
        pagePath?: string;
        // api_news: API 动态；health_check：健康检查消息；normal: 普通消息; tip: 微通知
        type: 'api_news' | 'health_check' | 'normal' | 'tips';
    };

    type Notice = {
        id: string;
        // api_news: API 动态；health_check：健康检查消息；normal: 普通消息; tip: 微通知
        type: 'api_news' | 'health_check' | 'normal' | 'tips';
        // 归属服务
        productName: string;
        // 标题
        title: string;
        // 页面地址
        pagePath?: string;
        // 详细内容
        content?: string;
        // 阅读状态
        isRead: 'yes' | 'no';
        // 创建日期
        created: string;
        // 更新日期
        updated: string;

        productDetail?: Product.Product;
    };
}
