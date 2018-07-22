<template>
    <section class="article-info" v-if="infoMany.length">
        <div class="fw-ber">
            <transition name="title" mode="out-in">
                <div v-if="on" key="on">{{infoMany[currentArticleIndex].title}}</div>
                <div v-else key="off">{{infoMany[nextArticleIndex].title}}</div>
            </transition>

            <transition name="title-special" mode="out-in">
                <div v-if="on" key="on" class="title-special" :style="specialStyle[0]">
                    <span>{{titleSpecial[0]}}</span>
                    <div class="specialLine" :style="gradientSpecialStyle[0]"></div>
                </div>
                <div v-else key="0ff" class="title-special" :style="specialStyle[1]">
                    <span>{{titleSpecial[1]}}</span>
                    <div class="specialLine" :style="gradientSpecialStyle[1]"></div>
                </div>
            </transition>
        </div>
        <transition name="written" mode="out-in">
            <label v-if="on" key="on">Written by</label>
            <label v-else key="0ff">Written by</label>
        </transition>
        <transition name="belong" mode="out-in">
            <div v-if="on" key="on" class="fw-ber">
                <span>{{infoMany[currentArticleIndex].author.username}}</span>
                <span>{{infoMany[currentArticleIndex].updated_at.substring(0, 10)}}</span>
            </div>
            <div v-else key="0ff" class="fw-ber">
                <span>{{infoMany[nextArticleIndex].author.username}}</span>
                <span>{{infoMany[nextArticleIndex].updated_at.substring(0, 10)}}</span>
            </div>
        </transition>
        <transition name="play" mode="out-in">
            <svg-icon v-if="on" key="on" @on-icon-click="enterArticle" icon-class="play" class="play-btn" :style="specialStyle[0]"></svg-icon>
            <svg-icon v-else key="0ff" @on-icon-click="enterArticle" icon-class="play" class="play-btn" :style="specialStyle[1]"></svg-icon>
        </transition>
    </section>
</template>
<script>
export default {
    name: 'articleInfo',
    props: {
        infoMany: {
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
            totalPage: this.infoMany.length
        };
    },
    computed: {
        on() {
            return this.currentArticleIndex % 2;
        },
        titleSpecial() {
            return [
                this.infoMany[this.currentArticleIndex].title.slice(-1),
                this.infoMany[this.nextArticleIndex].title.slice(-1)
            ];
        },
        specialStyle() {
            return [
                {
                    color: this.infoMany[this.currentArticleIndex].title_color
                },
                {
                    color: this.infoMany[this.nextArticleIndex].title_color
                }
            ];
        },
        gradientSpecialStyle() {
            return [
                {
                    background: `linear-gradient(to right, ${
                        this.infoMany[this.currentArticleIndex].title_color
                    }, white)`
                },
                {
                    background: `linear-gradient(to right, ${
                        this.infoMany[this.nextArticleIndex].title_color
                    }, white)`
                }
            ];
        }
    },
    methods: {
        enterArticle() {
            console.log(`/articles/${this.infoMany[this.currentArticleIndex]._id}`);
            this.$router.push({
                path: `/articles/${this.infoMany[this.currentArticleIndex]._id}`
            });
        }
    }
};
</script>
<style lang="scss" scoped>
@import 'src/styles/mixin.scss';
.article-info {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    font-size: 1.2rem;
    .title-special {
        display: flex;
        align-items: center;
    }
    .specialLine {
        height: 2px;
        width: 210px;
        margin-left: 1rem;
        display: inline-block;
    }
    .play-btn {
        width: 4.4rem;
        height: 4.4rem;
        position: absolute;
        right: 3.5rem;
        top: calc(44.726562vh - 2.2rem);
    }
}

@media (min-width: 40rem) {
    .article-info {
        font-size: 1.5rem;
    }
}
@media (min-width: 70rem) {
    .article-info {
        display: flex;
        flex: 0 1 auto;
        flex-direction: column;
        justify-content: center;
        margin: auto;
        .specialLine {
            height: 2px;
            width: 210px;
            display: inline-block;
        }
        .play-btn {
            position: static;
            margin-top: 2.2rem;
        }
    }
}
@include slideVertical(title, 1s, 1.5s, 10vh, 0, 0, -50vh);
@include slideVertical(title-special, 1.2s, 1.8s, 10vh, 0, 0, -50vh);
@include slideVertical(written, 1.4s, 2s, 10vh, 0, 0, -50vh);
@include slideVertical(belong, 1.6s, 2.2s, 10vh, 0, 0, -50vh);
@include slideVertical(play, 2s, 2.4s, 10vh, 0, 0, -50vh);
</style>
