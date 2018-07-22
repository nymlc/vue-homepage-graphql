<template>
    <div class="article-cover-wrapper" @click="click">
        <transition :name="coverTransitionMode">
            <div class="article-cover" v-if="currentArticleIndex%2" key="on" :style="coverImgStyle[0]"></div>
            <div class="article-cover" v-else key="off" :style="coverImgStyle[1]"></div>
        </transition>
    </div>
</template>
<script>
export default {
    name: 'cover',
    props: {
        currentArticleIndex: {
            type: Number,
            default: 0
        },
        nextArticleIndex: {
            type: Number,
            default: 0
        },
        coverMany: {
            type: Array,
            default: []
        },
        coverTransitionMode: {
            type: String,
            default: 'cover-up'
        }
    },
    computed: {
        coverImgStyle() {
            return [
                {
                    backgroundImage: `url(${
                        this.coverMany[this.currentArticleIndex]
                    })`
                },
                {
                    backgroundImage: `url(${
                        this.coverMany[this.nextArticleIndex]
                    })`
                }
            ];
        }
    },
    methods: {
        click(event) {
            this.$emit('on-click', event);
        }
    }
};
</script>
<style lang="scss" scoped>
@import 'src/styles/mixin.scss';
@mixin cover {
    div.article-cover {
        background-position: center;
        background-size: cover;
        width: 100%;
        height: 100%;
    }
}
.article-cover-wrapper {
    height: 36.132812%;
    overflow: hidden;
    @include cover;
}

@media (min-width: 70rem) {
    .article-cover-wrapper {
        width: 52.083333%;
        height: 100%;
        @include cover;
    }
}
@include slideVertical(cover-up);
@include slideVertical(cover-down, 1s, 1s, -200%, -100%, -100%, 100%);
</style>

