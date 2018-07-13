import  env  from "./config";

let devApi = 'http://result.eolinker.com/HxW29tE32568956b42d4d7e77fe17cfa68a6ff71d481e62?uri=',
	prdApi = 'https://api.sponing.com/restful/koa/blog/amdin',
	prefixed = '',
	api;

switch(env) {
	case 'development':
		prefixed = devApi;
		break;
	case 'production':
		prefixed = prdApi;
		break;
	default:
		prefixed = devApi;
		break;
}

api = {
	login: '/login',
	editPassword: '/editPassword',
	// 标签
	addTag: '/addTag',
	tagList: '/tagList',
	editTag: '/editTag',
	removeTag: '/removeTag',
	// 分类
	addSort: '/addSort',
	sortList: '/sortList',
	editSort: '/editSort',
	removeSort: '/removeSort',
	// 七牛云的token
	qiniuToken: '/qiniuToken',
	userBasics: '/userBasics',
	getUserBasics: '/getUserBasics',
	deleteQiniuImg: '/deleteQiniuImg',
	// 文章
	getArticle: '/getArticle',
	saveArticle: '/saveArticle',
	removeArticle: '/removeArticle',
	listArticle: '/listArticle'
}

export default (name)=> {
	return prefixed + api[name];
}