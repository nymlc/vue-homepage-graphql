<template>
    <ul>
        <li v-for="(item, index) in articleMany" :key="index" @click="click(index)">{{item.title}}</li>
    </ul>
</template>
<script>
export default {
    props: {
        articleMany: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            // articleMany: []
        };
    },
    methods: {
        click(index) {
            this.$emit('on-article-click', index);
        }
    }
};
</script>
<style lang="scss" scoped>
ul * {
    display: flex;
    justify-content: center;
}
li {
    height: 3rem;
    border-bottom: 1px solid #ccc;
    list-style: none;
    align-items: center;
    &:last-child {
        border-bottom: 0;
    }
    &:nth-child(odd) {
        background-color:beige;
    }
}
</style>
