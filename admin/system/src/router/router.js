import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: () => import('@/views/login.vue')
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () => import('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@//views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        { path: 'home', title: '首页', name: 'home_index', component: () => import('@/views/home/home.vue') }
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/group',
        icon: 'ios-folder',
        name: 'group',
        title: 'Group',
        component: Main,
        children: [
            {
                path: 'page1',
                icon: 'ios-paper-outline',
                name: 'page1',
                title: 'Page1',
                component: () => import('@/views/group/page1/page1.vue')
            },
            {
                path: 'page5',
                icon: 'ios-list-outline',
                name: 'page69',
                title: 'Page634234',
                component: () => import('@/views/group/page2/page2.vue')
            }
        ]
    },
    {
        path: '/page33',
        icon: 'ios-paper',
        title: 'Page33',
        name: 'page33',
        component: Main,
        children: [
            { path: 'index', title: 'Page', name: 'page_index', component: () => import('@/views/page/page.vue') }
        ]
    }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    ...appRouter,
    page500,
    page403,
    page404
];
