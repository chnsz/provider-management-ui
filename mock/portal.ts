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
            resource: { success: 100, apiFailed: 20, other: 10 },
            dataSource: { success: 200, apiFailed: 30, other: 15 },
        });
    },
};
