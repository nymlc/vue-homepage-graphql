<template>
    <!-- <sidebar :isActive="sidebarShow" :categorys="categorys" :tags="tags" :topArticles="topArticles" @on-mouseleave="showSidebar" @on-category-click="categoryClick" @on-tag-click="tagClick"></sidebar> -->
    <main v-if="article.title" class="article-wrapper">
        <header class="article-cover-wrapper" :style="coverImgStyle">
            <section class="article-info">
                <a class="logo" href="#/articles">泠青</a>
                <section class="info-wrapper">
                    <h2 class="title">{{article.title}}</h2>
                    <div class="belong">
                        <span>{{article.updated_at}}</span>
                        <span>{{article.author.username}}</span>
                    </div>
                    <div class="tags-wrapper">
                        <el-tag @click.native="tagClick(index)" v-for="(tag, index) in article.tags" :color="article.title_color" :key="index">{{ tag.name }}</el-tag>
                    </div>
                </section>
            </section>
        </header>
        <article class="article-content markdown-body" v-html="markdownToHtml"></article>
        <footer id="gitalk-container"></footer>
    </main>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import gql from 'graphql-tag';
import Gitalk from 'gitalk';
import 'gitalk/dist/gitalk.css';
import 'github-markdown-css/github-markdown.css';
const articleQuery = gql`
    query q_articleById($articleId: MongoID!) {
        articleById(_id: $articleId) {
            _id
            title
            content
            title_color
            created_at
            updated_at
            views
            praises
            cover
            categorys {
                _id
                name
                created_at
            }
            tags {
                _id
                name
                created_at
            }
            author {
                _id
                username
                password
                role
            }
        }
    }
`;
export default {
    data() {
        return {
            article: {},
            markdownToHtml: ''
        };
    },
    async beforeMount() {
        const articleId = this.$route.params.id;
        // 从vuex取值
        this.article = this.currentArticle;
        // 若vuex未取到则根据id后端获取
        if (!this.article.content) {
            const result = await this.$apollo.query({
                query: articleQuery,
                variables: {
                    articleId: this.$route.params.id
                }
            });
            this.article = result.data.articleById;
        }
        await import('showdown').then(showdown => {
            const converter = new showdown.Converter();
            this.markdownToHtml = converter.makeHtml(this.article.content);
        });
        // if (!this.article.title) {
        //     this.$router.push({ path: '/error404' });
        this.$nextTick(() => {
            // 初始化评论
            const gitalk = new Gitalk({
                clientID: '0d5a1a93d31bc82a0393',
                clientSecret: 'a53b3482c5cd2b8744b7597e1872ce0b6e76ff50',
                repo: 'blog-comment',
                owner: 'nymlc',
                admin: ['nymlc'],
                id: articleId,
                // facebook-like distraction free mode
                distractionFreeMode: true
            });
            gitalk.render('gitalk-container');
        });
    },
    methods: {
        ...mapActions(['SetSelectedTag']),
        getArticlesByCategorys(event) {
            console.log(event);
            // this.$emit('on-mouseleave', event);
        },
        tagClick(index) {
            this.SetSelectedTag(this.article.tags[index]);
            this.$router.push({ path: '/articles' });
        }
    },
    computed: {
        ...mapGetters(['currentArticle']),
        coverImgStyle() {
            return {
                backgroundImage: `url(${this.article.cover})`
            };
        }
    }
};
</script>
<style scoped lang="scss">
.article-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.article-wrapper {
    display: flex;
    flex-direction: column;
}

header.article-cover-wrapper {
    min-height: 38.2vh;
    max-height: 61.8vh;
    width: 100%;
    overflow: auto;
    background-position: center;
    background-size: cover;
}

section.article-info {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin-left: 2rem;
    .logo {
        font-family: 'logofont';
        font-size: 1.875rem;
        color: white;
        text-decoration: none;
    }
    section.info-wrapper {
        margin: 1.5rem 0;
        color: white;
    }
    .belong {
        font-size: 0.8125rem;
        span:last-child {
            margin-left: 1rem;
        }
    }
    h2.title {
        font-size: 1.875rem;
        margin-bottom: 0.8125rem;
        text-align: left;
    }
    .tags-wrapper {
        .el-tag {
            margin-right: 0.5rem;
        }
    }
}

article.article-content {
    width: 90%;
    margin: 1.5rem 1rem;
    flex: 1 0 auto;
}

footer#gitalk-container {
    margin: 0.5rem 1rem;
}

@media (min-width: 40rem) {
    section.article-info {
        width: 74%;
        max-width: 48rem;
        margin: 0 auto;
    }
    article.article-content {
        width: 74%;
        max-width: 48rem;
    }
    footer#gitalk-container {
        width: 74%;
        max-width: 48rem;
    }
}

// @media (max-width: 70rem) {
//     .article-info {
//         width: 84%;
//         padding: 1rem 0.8rem;
//     }
//     #gitalk-container,
//     .article-content {
//         width: 100%;
//         margin: auto;
//         padding: 2.2rem 0.8rem;
//     }
// }
</style>
