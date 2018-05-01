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
        { path: 'home', title: '首页', name: 'home_index', component: () => import('@/views/home/home.vue') },
        { path: 'company_create', title: '创建公司', name: 'company_create', component: () => import('@/views/page/company_create.vue') },
        { path: 'device_create', title: '设备注册', name: 'device_create', component: () => import('@/views/page/device_create.vue') },
        { path: 'wechat_create', title: '创建公众号', name: 'wechat_create', component: () => import('@/views/page/wechat_create.vue') },
        { path: 'product_create', title: '创建产品', name: 'product_create', component: () => import('@/views/page/product_create.vue') },
        { path: 'firmware_create', title: '创建固件', name: 'firmware_create', component: () => import('@/views/page/firmware_create.vue') },
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/group',
        icon: 'ios-folder',
        name: 'group',
        title: '管理',
        component: Main,
        children: [
            {
                path: 'company_list',
                icon: 'pound',
                name: 'company_list',
                title: '公司管理',
                component: () => import('@/views/page/company_list.vue')
            },
            {
                path: 'device_list',
                icon: 'ios-paper-outline',
                name: 'device_list',
                title: '设备管理',
                component: () => import('@/views/page/device_list.vue')
            },

          
         
            {
                path: 'wechat_list',
                icon: 'pound',
                name: 'wechat_list',
                title: '公众号管理',
                component: () => import('@/views/page/wechat_list.vue')
            },
            // {
            //     path: 'wechat_create',
            //     icon: 'arrow-graph-up-right',
            //     name: 'wechat_create',
            //     title: '创建公众号',
            //     component: () => import('@/views/page/wechat_create.vue')
            // },
            {
                path: 'product_list',
                icon: 'crop',
                name: 'product_list',
                title: '产品管理',
                component: () => import('@/views/page/product_list.vue')
            },
            // {
            //     path: 'product_create',
            //     icon: 'arrow-graph-up-right',
            //     name: 'product_create',
            //     title: '创建产品',
            //     component: () => import('@/views/page/product_create.vue')
            // },
            {
                path: 'firmware_list',
                icon: 'android-upload',
                name: 'firmware_list',
                title: '固件管理',
                component: () => import('@/views/page/firmware_list.vue')
            },
            // {
            //     path: 'firmware_create',
            //     icon: 'android-upload',
            //     name: 'firmware_create',
            //     title: '创建固件',
            //     component: () => import('@/views/page/firmware_create.vue')
            // }
           
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
