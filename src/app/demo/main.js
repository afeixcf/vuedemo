import './main.less';
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Clear from '../../templates/clear/clear.vue';

let routes = [
    {
        path: '/',redirect:'/clear'
    },
    {
        path: '/clear', name: 'clear', component: Clear
    }
];

let router = new VueRouter({
    routes
});

// 路由切换 重新初始化分享

import Share from 'share';
Share.signature();

router.beforeEach(function (to, from, next) {
    setTitle(to.name);
    next();
});

let App = null;
let __fn = function () {
    App = new Vue({
        el: '#app',
        data:{
            showMask: false,
        },
        methods: {
        },
        mounted(){
        },
        router
    });
};

let cur_route = location.hash;
__fn();

// if (cur_route === '#/test') {
//     __fn();
// } else {
//     Page.initView({
//         needLogin: true,
//         preWechat: true
//     },function () {
//         if (User.selfInfo.status !== 2) {
//             window.location.replace(Conf.authorApi + 'userInfoInput.html?source=mood');
//             return;
//         }
//
//         __fn();
//     });
// }

function setTitle (path) {
    let title = '';

    switch (path) {
        case 'test':
            title = 'test';
            break;
        case 'clear':
            title = 'clear';
            break;
        default:
            title = 'demo';
    }

    document.title = title;
}

