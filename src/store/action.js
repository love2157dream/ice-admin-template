import C from './../common/index';

// 初始化获取标签，保存至redux
const action = {
	tagsListFunc() {
		return dispatch => {
			C.axios(C.api('tagList')).then(res=> {
				dispatch({
					type: 'tagsList',
					data: res.data || []
				})
			})
		}
	},
	sortsListFunc() {
		return dispatch => {
			C.axios(C.api('sortList')).then(res=> {
				dispatch({
					type: 'sortsList',
					data: res.data || []
				})
			})
		}
	},
	showToastFunc() {
		return {
			type: 'showToast'
		}
	}
}

export default action;