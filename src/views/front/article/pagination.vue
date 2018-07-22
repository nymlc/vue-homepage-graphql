<template>
    <div class="pagination-wrapper" v-if="paginationMany.length">
        <transition name="pagination" mode="out-in">
            <div v-if="on" key="on" class="pagination">
                <span class="pr05">{{currentArticleIndex+1}}</span>of
                <span class="plr05">{{totalPage}}</span>
                <svg-icon icon-class="right_arrow"></svg-icon>
            </div>
            <div v-else key="off" class="pagination">
                <span class="pr05">{{currentArticleIndex+1}}</span>of
                <span class="plr05">{{totalPage}}</span>
                <svg-icon icon-class="right_arrow"></svg-icon>
            </div>
        </transition>
        <transition name="viewer" mode="out-in">
            <div v-if="on" key="on" class="viewer">
                <svg-icon icon-class="heart"></svg-icon>
                <span class="plr1">{{paginationMany[currentArticleIndex].praises}}</span>
                <svg-icon icon-class="eye"></svg-icon>
                <span class="plr1">{{paginationMany[currentArticleIndex].views}}</span>
                <!-- <svg-icon icon-class="coment"></svg-icon>
                <span class="plr1">{{paginationMany[currentArticleIndex].comments}}</span> -->
            </div>
            <div v-else key="off" class="viewer">
                <svg-icon icon-class="heart"></svg-icon>
                <span class="plr1">{{paginationMany[nextArticleIndex].praises}}</span>
                <svg-icon icon-class="eye"></svg-icon>
                <span class="plr1">{{paginationMany[nextArticleIndex].views}}</span>
                <!-- <svg-icon icon-class="coment"></svg-icon> -->
                <!-- <span class="plr1">{{paginationMany[nextArticleIndex].comments}}</span> -->
            </div>
        </transition>
    </div>
</template>
<script>
export default {
    name: 'pagination',
    props: {
        paginationMany: {
            type: Array,
            default: []
        },
        currentArticleIndex: {
            type: Number,
            default: 0
        },
        nextArticleIndex: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            // on: this.currentArticleIndex % 2,
        };
    },
    computed: {
        on() {
            return this.currentArticleIndex % 2;
        },
        totalPage() {
            return this.paginationMany.length;
        }
    }
};
</script>
<style lang="scss" scoped>
@import "src/styles/mixin.scss";
.pagination-wrapper {
    height: 29.328622%;
    display: flex;
    flex-direction: column-reverse;
    justify-content: space-around;
    .pagination {
        align-self: flex-end;
    }
}

@media (min-width: 70rem) {
    .pagination-wrapper {
        height: auto;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .pagination {
            align-self: center;
        }
    }
}
@include slideVertical(viewer, 1.2s, 1s, 10vh, 0, 0, -20vh);
@include slideHorizontal(pagination, 1.2s, 1.8s, -10vw, 0, 0, 8vw);
</style>
