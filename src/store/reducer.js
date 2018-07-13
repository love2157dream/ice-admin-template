
export const reducer = (state, action) => {
	if (!state) {
		return {
			tagsList: [],
			sortsList: [],
			loading: true
		}
	}
	switch (action.type) {
		case 'tagsList': 
			state = Object.assign(state, {loading: false});
			return {
				...state,
				tagsList: action.data
			}
			break;
		case 'sortsList': 
			state = Object.assign(state, {loading: false});
			return {
				...state,
				sortsList: action.data
			}
			break;
		case 'showToast':
			state = Object.assign(state, {loading: true});
			return {
				...state
			}
	}
}

