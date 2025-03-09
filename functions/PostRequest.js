import axios from 'axios'
import Cookies from 'js-cookie'
import { serverAddress } from './ServerAddress';

const reloadToken = async () => {
    const bodyFormData = new FormData();
    bodyFormData.append('refresh', Cookies.get('refresh'));
    try {
        const response = await axios.post(`${serverAddress}/accounts/api/token/refresh/`, bodyFormData, { headers: { 'Content-Type': 'multipart/form-data' } });
        Cookies.set('access', response.data.access);
        return true;
    } catch (err) {
        Cookies.set('access', 0)
        Cookies.set('refresh', 0)
        window.location.assign('/')
        return false;

    }
};

export async function PostRequest(url, params = {}, attemptedRefresh = false) {
    const bodyFormData = new FormData();

    Object.keys(params).forEach(key => {
        bodyFormData.append(key, params[key]);
    });

    try {
        const response = await axios.post(url, bodyFormData, {
            headers: {
                Authorization: `Bearer ${Cookies.get('access')}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (err) {
        try {
            if (!attemptedRefresh && (err.response?.statusText === 'Unauthorized' || err.response?.data?.detail === 'Token is expired')) {
                const tokenRefreshed = await reloadToken();
                if (!tokenRefreshed) {
                    return err;
                } else {
                    PostRequest(url, params, true)
                }
            } else{
                throw err
            }
        } catch (error) {
            throw err
        }

    }
}