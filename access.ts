import {size} from "lodash";

/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
    const {currentUser} = initialState ?? {};

    let partnerRole = false;
    let settingRole = false;
    const prValidatorRole = location.host === 'pms-test.huaweicloud.plus';

    for (let i = 0; i < size(currentUser?.roleList); i++) {
        if (currentUser?.roleList[i].name === 'partner') {
            partnerRole = true;
        }
        if (currentUser?.roleList[i].name === 'settings') {
            settingRole = true;
        }
        // if (currentUser?.roleList[i].name === 'pr-validator') {
        //   prValidatorRole = true;
        // }
    }

    return {
        canAdmin: currentUser && currentUser.access === 'admin',
        partnerRole: partnerRole,
        settingRole: settingRole,
        prValidatorRole: prValidatorRole,
    };
}
