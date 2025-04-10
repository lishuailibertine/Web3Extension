<template>
    
</template>
<script>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
export default {
    name: 'RequestLogin',
    setup() {
        const router = useRouter();
        const goBack = () => {
            router.back(); // 返回到上一个页面
        };
        return {
            goBack
        };
    }
};
</script>
<style scoped>

</style>