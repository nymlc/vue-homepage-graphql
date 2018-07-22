<template>
    <v-touch class="app-touch-wrapper" @swipeleft="onSwipeLeft" @swiperight="onSwipeRight">
        <div class="app-wrapper" @wheel="mousewheel">
            <sidebar :isActive="sidebarShow" :categorys="categoryManyClone" :tags="tagManyClone" @on-mouseleave="showSidebar" @on-category-click="categoryClick" @on-tag-click="tagClick"></sidebar>
            <div class="app-header-wrapper">
                <svg-icon class="hamburger-container" icon-class="bread_crumb" @on-icon-click="showSidebar"></svg-icon>
                <span class="logo">泠青</span>
                <svg-icon icon-class="search" class="play-btn"></svg-icon>
            </div>
            <cover @on-click="enterArticle" :currentArticleIndex="currentArticleIndex" :nextArticleIndex="nextArticleIndex" :coverMany="coverMany" :coverTransitionMode="coverTransitionMode">
            </cover>
            <div class="article-wrapper">
                <header>
                    <span class="logo">泠青</span>
                    <svg-icon class="hamburger-container" icon-class="bread_crumb" @on-icon-click="showSidebar"></svg-icon>
                    <search-box></search-box>
                </header>
                <article-info :currentArticleIndex="currentArticleIndex" :nextArticleIndex="nextArticleIndex" :infoMany="infoMany">
                </article-info>
                <pagination :currentArticleIndex="currentArticleIndex" :nextArticleIndex="nextArticleIndex" :paginationMany="paginationMany">
                </pagination>
            </div>
            <div class="app-contact"></div>
        </div>
    </v-touch>
</template>
<script>
import SearchBox from '@/components/search-box';
import Sidebar from './sidebar';
import Cover from './cover';
import Pagination from './pagination';
import ArticleInfo from './info';
import { deepClone } from '@/utils';
import { mapActions, mapGetters } from 'vuex';
import _ from 'lodash';
import gql from 'graphql-tag';
export default {
    apollo: {
        articleMany() {
            const self = this;
            return {
                query: gql`
                    query q_articleMany(
                        $articleFilter: FilterFindManyArticleInput
                    ) {
                        articleMany(filter: $articleFilter) {
                            _id
                            title
                            content
                            title_color
                            created_at
                            updated_at
                            praises
                            views
                            cover
                            author {
                                _id
                                username
                                password
                                role
                            }
                            categorys {
                                name
                                created_at
                            }
                            tags {
                                name
                                created_at
                            }
                        }
                    }
                `,
                variables() {
                    return {
                        articleFilter: {
                            tagsIn: this.tagsIn,
                            categorysIn: this.categorysIn
                        }
                    };
                },
                fetchPolicy: 'cache-and-network',
                update: data => data.articleMany,
                result(data) {
                    // 设置当前显示文章于vuex
                    if (data && data.data && data.data.articleMany) {
                        self.SetCurrentArticle(data.data.articleMany[self.currentArticleIndex]);
                    }
                }
            };
        },
        categoryMany: {
            query: gql`
                query q_categoryMany {
                    categoryMany {
                        _id
                        name
                    }
                }
            `,
            fetchPolicy: 'cache-and-network',
            update: data => data.categoryMany
        },
        tagMany: {
            query: gql`
                query q_tagMany {
                    tagMany {
                        _id
                        name
                    }
                }
            `,
            fetchPolicy: 'cache-and-network',
            update: data => data.tagMany
        }
    },
    components: {
        Sidebar,
        SearchBox,
        Cover,
        Pagination,
        ArticleInfo
    },
    methods: {
        ...mapActions(['SetCurrentArticle']),
        showSidebar(event) {
            this.sidebarShow = !this.sidebarShow;
        },
        enterArticle() {
            const self = this;
            this.$router.push({
                path: `/articles/${self.articleMany[self.currentArticleIndex]._id}`
            });
        },
        categoryClick(category) {
            if (category.isActive) {
                this.selectedCategorys.add(category._id);
            } else {
                this.selectedCategorys.delete(category._id);
            }
            if (this.selectedCategorys.size) {
                this.categorysIn = Array.from(this.selectedCategorys);
            } else {
                this.categorysIn = undefined;
            }
            // this.$apollo.queries.articleMany.refetch();
        },
        tagClick(tag) {
            if (tag.isActive) {
                this.selectedTags.add(tag._id);
            } else {
                this.selectedTags.delete(tag._id);
            }
            if (this.selectedTags.size) {
                this.tagsIn = Array.from(this.selectedTags);
            } else {
                this.tagsIn = undefined;
            }
        },
        // async getArticlesByParams(params) {
        //     const articles = await getArticles(params);
        //     this.articles = articles.data;
        //     this.totalPage = this.articles.length;
        //     this.upIndex = 0;
        //     this.downIndex = 0;
        //     this.wheelCurl = 1;
        //     // 设置当前显示文章于vuex
        //     this.SetCurrentArticle(this.articles[this.wheelCurl - 1]);
        //     preloadImages(this.articles[1] && this.articles[1].cover, this.articles[2] && this.articles[2].cover);
        // },
        nextArticle(isNext) {
            if (isNext) {
                this.currentArticleIndex++;
                this.nextArticleIndex = this.currentArticleIndex + 1;
                if (this.nextArticleIndex > this.articleMany.length - 1) {
                    this.currentArticleIndex = this.nextArticleIndex =
                        this.articleMany.length - 1;
                }
            } else {
                this.currentArticleIndex--;
                this.nextArticleIndex = this.currentArticleIndex - 1;
                if (this.nextArticleIndex < 0) {
                    this.currentArticleIndex = this.nextArticleIndex = 0;
                }
            }
            this.SetCurrentArticle(this.articleMany[this.currentArticleIndex]);
        },
        mousewheel(e) {
            // if (!hasScrolled(document.body)) {
            //     // this.nextArticle(isNext);
            // }
            if (e.deltaY > 0) {
                this.coverTransitionMode = 'cover-down';
            } else {
                this.coverTransitionMode = 'cover-up';
            }
            this.nextArticle(e.deltaY > 0);
        },
        onSwipeLeft() {
            this.nextArticle(true);
        },
        onSwipeRight() {
            this.nextArticle(false);
        }
    },
    mounted() {
        /* func (Function): 要防抖动的函数。
        [wait=0] (number): 需要延迟的毫秒数。
        [options={}] (Object): 选项对象。
        [options.leading=false] (boolean): 指定在延迟开始前调用。
        [options.maxWait] (number): 设置 func 允许被延迟的最大值。
        [options.trailing=true] (boolean): 指定在延迟结束后调用。 */
        this.mousewheel = _.debounce(this.mousewheel, 1000, {
            leading: true,
            trailing: false
        });
    },
    async beforeMount() {
        const self = this;
        // 判断当前是否有选中标签
        if (this.selectedTag._id) {
            this.selectedTags.add(this.selectedTag._id);
        }

        if (this.selectedTags.size) {
            this.tagsIn = Array.from(this.selectedTags);
        } else {
            this.tagsIn = undefined;
        }
        // // 标色当前选中的tag
        if (this.selectedTag.name) {
            this.tagManyClone.forEach((tag, index) => {
                if (tag.name === this.selectedTag.name) {
                    self.tagManyClone[index].isActive = true;
                }
            });
        }
    },
    data() {
        return {
            currentArticleIndex: 0,
            nextArticleIndex: 0,
            articleMany: [],
            tagMany: [],
            categoryMany: [],
            coverTransitionMode: 'cover-up',
            sidebarShow: false,
            selectedCategorys: new Set(),
            selectedTags: new Set(),
            tagsIn: undefined,
            categorysIn: undefined
        };
    },
    computed: {
        ...mapGetters(['selectedTag']),
        coverMany() {
            return this.articleMany.map(value => value.cover);
        },
        paginationMany() {
            return this.articleMany.map(value => ({
                praises: value.praises || 0,
                views: value.views || 0,
                comments: value.comments || 0
            }));
        },
        categoryManyClone() {
            return deepClone(this.categoryMany);
        },
        tagManyClone() {
            return deepClone(this.tagMany);
        },
        infoMany() {
            return this.articleMany.map(value => ({
                _id: value._id,
                title: value.title,
                author: value.author,
                updated_at: value.updated_at,
                title_color: value.title_color
            }));
        }
    }
};
</script>
<style lang="scss" scoped>
@import "src/styles/mixin.scss";
.app-touch-wrapper {
    height: 100%;
}

.app-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.app-header-wrapper {
    height: 8.59375%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .logo {
        font-family: "logofont";
        font-size: 1.2rem;
    }
}

.article-wrapper {
    height: 55.273438%;
    padding: 0 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    overflow: hidden;
    header {
        display: none;
        .logo {
            font-family: "logofont";
            font-size: 1.2rem;
        }
    }
}

.app-contact {
    display: none;
}

@media (min-width: 40rem) {
    .app-header-wrapper {
        .logo {
            font-size: 1.5rem;
        }
    }
    .article-wrapper {
        header {
            .logo {
                font-size: 1.5rem;
            }
        }
    }
}

@media (min-width: 70rem) {
    .app-wrapper {
        flex-direction: row-reverse;
        height: 100%;
    }

    .app-header-wrapper {
        display: none;
    }
    .app-contact {
        display: block;
        width: 2.08333333%;
    }

    .article-wrapper {
        height: 100%;
        width: 45.833333%;
        padding: 2rem 4rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        header {
            width: 80%;
            display: flex;
            align-items: center;
            .hamburger-container {
                margin: 0 2rem;
            }
        }
    }
}
</style>
