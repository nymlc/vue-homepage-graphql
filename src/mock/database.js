import { getRandomArray } from '@/utils';
import Mock from 'mockjs';

const coverMap = ['http://nymlc.com/imgs/20180222164107.jpg',
    'http://nymlc.com/imgs/20180222182457.jpg',
    'http://nymlc.com/imgs/20180222182508.jpg',
    'http://nymlc.com/imgs/20180222182520.jpg',
    'http://nymlc.com/imgs/20180222182528.jpg',
    'http://nymlc.com/imgs/20180222182537.jpg',
    'http://nymlc.com/imgs/20180222182545.jpg',
    'http://nymlc.com/imgs/20180222182554.jpg',
    'http://nymlc.com/imgs/20180222182602.jpg'];

const articles = [];
const categorys = [];
const tags = [];

for (let i = 0; i < 10; i++) {
    categorys.push(Mock.mock({
        _id: '@increment',
        name: '@name'
    }));
}
for (let i = 0; i < 10; i++) {
    tags.push(Mock.mock({
        _id: '@increment',
        name: '@name'
    }));
}
for (let i = 0; i < 10; i++) {
    articles.push(Mock.mock({
        _id: '@increment',
        title: '@ctitle',
        title_color: '@color',
        author: '@cname',
        created_at: '@date("yyyy/MM/dd")',
        updated_at: '@date("yyyy/MM/dd")',
        'views|30-80': 40,
        'praises|30-40': 36,
        'comments|3-18': 6,
        'cover|1': coverMap,
        content: '@cparagraph@cparagraph@cparagraph@cparagraph@cparagraph@cparagraph@cparagraph@cparagraph@cparagraph@cparagraph@cparagraph@cparagraph@cparagraph@cparagraph@cparagraph',
        categorys: getRandomArray(categorys),
        tags: getRandomArray(tags)
    }));
}
export {
    articles, categorys, tags
};
