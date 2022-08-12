import config from 'config';
import { authHeader } from '../_helpers';

export const currencyService = {
    list,
    liveRate,
    periodStatis
};

function list() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    return fetch(`${config.apiUrl}/currency/list`, requestOptions)
        .then(handleResponse)

}

function liveRate(source, currencies) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };
    return fetch(`${config.apiUrl}/currency/live_rate?source=${source}&currencies=${currencies}`, requestOptions)
        .then(handleResponse)
}

function periodStatis(source, destination, period) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };
    return fetch(`${config.apiUrl}/currency/period_statis?source=${source}&destination=${destination}&period=${period}`, requestOptions)
        .then(handleResponse)
}


function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                logout();
                location.reload(true);
            }
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}
