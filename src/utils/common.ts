import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

export const toShortDate = function (date: string | undefined): string {
    if (!date) {
        return '';
    }

    return moment(date).add(8, 'h').format('YYYY-MM-DD');
};

export const toLongDate = function (date: string | undefined): string {
    if (!date) {
        return '';
    }

    return moment(date).add(8, 'h').format('YYYY-MM-DD HH:mm:ss');
};