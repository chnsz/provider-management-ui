import { Request, Response } from 'express';

export default {
    'GET /portal/api-coverage-sum': (req: Request, res: Response) => {
        res.send({
            covered: 123,
            planned: 12,
            notAnalyzed: 23,
            failing: 34,
            notSuitable: 45,
        });
    },

    'GET /portal/provider-health-check-sum': (req: Request, res: Response) => {
        res.send({
            resource: {
                success: 83,
                apiFailed: 10,
                other: 7,
            },
            dataSource: {
                success: 84,
                apiFailed: 10,
                other: 7,
            },
        });
    },

    'GET /portal/news-info': (req: Request, res: Response) => {
        res.send([
            {
                title: '【API 动态】2021-03-10 ECS API "五个一百"见证奋进的中囯走进中俄元首大范围会谈现场 用时代正能量引领大流量 动态: 新增 5',
                created: '2023-02-21',
            },
            {
                title: '【API 动态】2021-03-10 ECS API 动态: 新增 5',
                created: '2023-03-21',
            },
            {
                title: '【API 动态】2021-03-10 ECS API 见证奋进的中囯走进中俄元首大范围会谈现场 用时代正能量引领大流量 动态: 新增 5',
                created: '2023-08-21',
            },
            {
                title: '【API 动态】2021-03-10 ECS API 见证奋进的中囯走进中俄元首大范围会谈现场 用时代正能量引领大流量 动态: 新增 5',
                created: '2023-03-21',
            },
            {
                title: '【API 动态】2021-03-10 ECS API 动态: 新增 5',
                created: '2023-03-21',
            },
            {
                title: '【API 动态】2021-03-10 ECS API 动态: 新增 5',
                created: '2023-03-21',
            },
            {
                title: '【API 动态】2021-03-10 ECS API 动态: 新增 5',
                created: '2023-03-21',
            },
            {
                title: '【API 动态】2021-03-10 ECS API 见证奋进的中囯走进中俄元首大范围会谈现场 用时代正能量引领大流量 动态: 新增 5',
                created: '2023-04-21',
            },
            {
                title: '【API 动态】2021-03-10 ECS API 见证奋进的中囯走进中俄元首大范围会谈现场 用时代正能量引领大流量 动态: 新增 5',
                created: '2023-03-28',
            },
            {
                title: '【API 动态】2021-03-10 ECS API 见证奋进的中囯走进中俄元首大范围会谈现场 用时代正能量引领大流量 动态: 新增 5',
                created: '2023-03-21',
            },
        ]);
    },

    'GET /portal/service-statistics-card-sum': (req: Request, res: Response) => {
        res.send({
            product: {
                product_img: 'http://xxxx',
                product_short: 'ECS',
                owner: '张三',
            },
            api_sum: {
                total: 117,
                used: 89,
                planed: 12,
                need_publish: 2,
                not_analyzed: 6,
                not_suitable: 8,
                offline_used: 1,
                offline: 5,
                unpublished: 5,
            },
            provider: {
                total: 11,
                resource: 7,
                data_source: 4,
                tag_support: true,
                pre_paid_support: true,
                eps_support: true,
            },
        });
    },
};
