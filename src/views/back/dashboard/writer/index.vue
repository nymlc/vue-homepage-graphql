<template>
    <div class="writer-container">
        <article-list class="article-list-container" :articleMany="articleMany" @on-article-click="articleListClick"></article-list>
        <div class="components-container">
            <el-button @click="sendToServer">Save</el-button>
            <el-input v-model="currentArticle._id" placeholder="文章id"></el-input>
            <el-input v-model="currentArticle.title" placeholder="文章标题"></el-input>
            <el-input v-model="currentArticle.title_color" placeholder="文章标题颜色"></el-input>
            <el-input v-model="currentArticle.cover" placeholder="文章封面"></el-input>
            <el-input v-model="currentArticle.praises" placeholder="文章赞"></el-input>
            <el-input v-model="currentArticle.views" placeholder="文章访问量"></el-input>
            <el-input v-model="authorFormat" placeholder="文章作者"></el-input>
            <el-input v-model="tagsFormat" placeholder="文章类别id"></el-input>
            <el-input v-model="categorysFormat" placeholder="文章标签id"></el-input>
            <div class="editor-container">
                <markdown-editor id="contentEditor" ref="contentEditor" v-model="contentFormat" :height="300" :zIndex="20"></markdown-editor>
            </div>
            <!-- <el-button @click="markdown2Html" style="margin-top:80px;" type="primary" icon="el-icon-document">To HTML</el-button> -->
        </div>
    </div>
</template>

<script>
import gql from 'graphql-tag';
import MarkdownEditor from '@/components/simple-markdown';
import ArticleList from '../article';
import { getAccessToken } from '@/utils/auth';
import { deepClone } from '@/utils';
import { Base64 } from 'js-base64';
const articleUpdateByIdMutation = gql`
    mutation m_articleUpdateById($record: UpdateByIdArticleInput!) {
        articleUpdateById(record: $record) {
            recordId
            record {
                title
                content
                title_color
                author {
                    username
                    password
                    role
                }
                created_at
                updated_at
                views
                praises
                cover
            }
        }
    }
`;
const articleCreateMutation = gql`
    mutation m_articleCreate($record: CreateOneArticleInput!) {
        articleCreate(record: $record) {
            recordId
            record {
                title
                title_color
                author {
                    username
                    password
                    role
                }
                created_at
                updated_at
                views
                cover
            }
        }
    }
`;
export default {
    name: 'markdown-writer',
    components: { MarkdownEditor, ArticleList },
    apollo: {
        articleMany() {
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
                                _id
                                name
                                created_at
                            }
                            tags {
                                _id
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
                update: data => data.articleMany
            };
        }
    },
    data() {
        return {
            articleMany: [],
            currentArticle: {
                content: '',
                _id: '',
                title: '',
                title_color: '',
                cover: '',
                praises: 0,
                views: 0,
                author: '',
                categorys: [],
                tags: []
            },
            html: ''
        };
    },
    computed: {
        contentFormat: {
            get() {
                return this.currentArticle.content;
            },
            // eslint-disable-next-line
            set(val) {
                this.currentArticle.content = val;
            }
        },
        authorFormat() {
            return this.currentArticle.author
                ? this.currentArticle.author.username
                : '';
        },
        categorysFormat() {
            return this.currentArticle.categorys.map(item => item.name).join();
        },
        tagsFormat() {
            return this.currentArticle.tags.map(item => item.name).join();
        }
    },
    methods: {
        articleListClick(index) {
            this.currentArticle = deepClone(this.articleMany[index]);
        },
        markdown2Html() {
            import('showdown').then(showdown => {
                const converter = new showdown.Converter();
                this.html = converter.makeHtml(this.currentArticle.content);
            });
        },
        async sendToServer() {
            let mutation;
            const record = deepClone(this.currentArticle);
            const categorys = this.currentArticle.categorys.map(item => item._id);
            const tags = this.currentArticle.tags.map(item => item._id);
            if (this.currentArticle._id && this.currentArticle._id.trim()) {
                mutation = articleUpdateByIdMutation;
                record.author = record.author._id;
                delete record.__typename;
                record.categorys = categorys;
                record.tags = tags;
            } else {
                mutation = articleCreateMutation;
                delete record._id;
                record.author = await Base64.decode(getAccessToken()).match(
                    /"userId":"(\w+)/
                )[1];
            }
            console.log(record);
            this.$apollo.mutate({
                mutation,
                variables: {
                    record
                }
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.writer-container {
    display: flex;
    flex-direction: row;
}
.article-list-container {
    width: 20%;
}
.components-container {
    width: 80%;
}
</style>
