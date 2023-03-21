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
};
