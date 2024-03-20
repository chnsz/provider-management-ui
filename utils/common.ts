import moment from 'moment';
import 'moment/locale/zh-cn';
import * as crypto from 'crypto-js';

moment.locale('zh-cn');

export const toShortDate = function (date: string | undefined): string {
    if (!date || date === '0001-01-01T00:00:00Z') {
        return '';
    }

    return moment(date).add(8, 'h').format('YYYY-MM-DD');
}

export const toLongDate = function (date: string | undefined): string {
    if (!date || date === '0001-01-01T00:00:00Z') {
        return '';
    }
    return moment(date).add(8, 'h').format('YYYY-MM-DD HH:mm:ss');
}

export const toHash = function (str: string): string {
    return crypto.SHA256(str).toString(crypto.enc.Hex);
}


export const camelToSnake = (camelCase: string): string => {
    const mapper = {
        IPv4: "ipv4",
        IPv6: "ipv6",
        IP: "ip",
        CIDR: "cidr",
        ID: "id",
    }
    for (let k in mapper) {
        camelCase = camelCase.replaceAll(k, `_${mapper[k]}_`)
    }
    let name = camelCase.replace(/[A-Z]/g, (match) => "_" + match.toLowerCase());
    if (name.endsWith("_")) {
        name = name.substring(0, name.length - 1)
    }
    name = name.replaceAll("__", "_")
    return name;
}

window.toHash = toHash
