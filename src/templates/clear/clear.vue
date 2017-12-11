<template>
    <div>
        <div class="pub-footer btn normal">
            <button type="button" @click="clear">清除缓存</button>
        </div>

        <div id="slide" class="_slide_box" style="height: 140px;">
            <ul class="_slide_item_wrap">
                <li class="_item">
                    <img src="./images/Dinghuo_home_banner.png" style="width:100%;"/>
                </li>
                <li class="_item">
                    <img src="./images/Dingqi_home_banner.png" style="width:100%;"/>
                </li>
                <!--<li class="_slide_item">-->
                <!--<img src="./images/Huobi_home_banner.png" style="width:100%;"/>-->
                <!--</li>-->
                <!--<li class="_slide_item">-->
                <!--<img src="./images/Home_banner.png" style="width:100%;"/>-->
                <!--</li>-->
            </ul>
        </div>

    </div>
</template>

<script>
    import './clear.less';
    import User from 'user';
    import Slide from 'swipe-slide';

    export default {

        mounted() {
            test();

            Slide({
                ele: document.getElementById('slide'),
                item: document.querySelectorAll('._item')
            })
        },

        methods: {
            clear(){
                User.clearBaiscAuth();
                localStorage.clear();
                alert('清除成功');
            }
        }
    }


    function awaitEvent(fn) {
        return new Promise((resolve, reject) => {
            fn(resolve)
        });
    }

    async function test() {
        console.log(111);
        await awaitEvent(resolve => {
            setTimeout(resolve,3000)
        });

        console.log(333);
    }


</script>