import axios from 'axios';

const setAuthToken = (token) => {
	if (token) {
		axios.defaults.headers.common['x-auth-token'] = token;
	} else {
		delete axios.dafaults.headers.common['x-auth-token'];
	}
};

export default setAuthToken;
