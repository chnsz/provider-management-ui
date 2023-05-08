import Footer from '@/components/Footer';
import type {Settings as LayoutSettings} from '@ant-design/pro-components';
import type {RunTimeLayoutConfig} from '@umijs/max';
import {history} from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import {errorConfig} from './requestErrorConfig';
// @ts-ignore
import {Scrollbars} from 'react-custom-scrollbars';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
    settings?: Partial<LayoutSettings>;
    currentUser?: API.CurrentUser;
    loading?: boolean;
    fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
    console.log('render app');
    const fetchUserInfo = async () => {
        try {
            const msg = {
                success: true,
                data: {
                    name: 'Serati Ma',
                    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
                    userid: '00000001',
                    email: 'antdesign@alipay.com',
                    signature: '海纳百川，有容乃大',
                    title: '交互专家',
                    group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
                    tags: [],
                    notifyCount: 12,
                    unreadCount: 11,
                    country: 'China',
                    access: 'admin',
                    geographic: {
                        province: {
                            label: '浙江省',
                            key: '330000',
                        },
                        city: {
                            label: '杭州市',
                            key: '330100',
                        },
                    },
                    address: '西湖区工专路 77 号',
                    phone: '0752-268888888',
                },
            };

            return msg.data;
        } catch (error) {
            history.push(loginPath);
        }
        return undefined;
    };
    // 如果不是登录页面，执行
    const {location} = history;
    if (location.pathname !== loginPath) {
        const currentUser = await fetchUserInfo();
        return {
            fetchUserInfo,
            currentUser,
            settings: defaultSettings as Partial<LayoutSettings>,
        };
    }
    return {
        fetchUserInfo,
        settings: defaultSettings as Partial<LayoutSettings>,
    };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({initialState}) => {
    return {
        actionsRender: () => [],
        /*avatarProps: {
          src: initialState?.currentUser?.avatar,
          title: <AvatarName />,
          render: (_, avatarChildren) => {
            return (
              <AvatarDropdown>
                <div style={{ color: '#dfdfdf' }}>{avatarChildren}</div>
              </AvatarDropdown>
            );
          },
        },*/
        waterMarkProps: {
            content: initialState?.currentUser?.name,
        },
        footerRender: () => <Footer/>,
        // footerRender: false,
        // headerRender: false,
        menuHeaderRender: undefined,
        onPageChange: () => {
            const {location} = history;
            // 如果没有登录，重定向到 login
            if (!initialState?.currentUser && location.pathname !== loginPath) {
                history.push(loginPath);
            }
        },
        links: [],
        // 自定义 403 页面
        // unAccessible: <div>unAccessible</div>,
        // 增加一个 loading 的状态
        childrenRender: (children) => {
            // if (initialState?.loading) return <PageLoading />;
            return (
                <div style={{height: 'calc(100vh - 116px)'}}>
                    <Scrollbars>
                        <div style={{padding: '0 20px'}}>
                    {children}
                        </div>
                    </Scrollbars>
                </div>
            );
        },
        ...initialState?.settings,
    };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
    ...errorConfig,
};
