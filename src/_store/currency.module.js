import { currencyService } from '../_services';

const state = {
    rates: {},
    currencies: {},
    periods: {}
};

const actions = {
    listCurrencies({ commit }) {
        currencyService.list()
            .then(
                res => {
                   if(res && res.data) {
                       commit('listCurrenciesSuccess', res.data)
                   }
                },
                error => commit('listCurrenciesFailure', error)
            );
    },

    liveRate({ commit }, {source, currencies}) {
        currencyService.liveRate(source, currencies)
            .then(
                res => commit('liveRateSuccess', res.data),
                error => commit('liveRateFailure', error)
            );
    },

    periodStatis({ commit }, {source, destination, period}) {
        currencyService.periodStatis(source, destination, period)
            .then(
                res => commit('periodStatisSuccess', {items:res.data, period}),
                error => commit('periodStatisFailure', error)
            );
    }
};

const mutations = {
    listCurrenciesSuccess(state, currencies) {
        state.currencies = { items: currencies };
    },
    listCurrenciesFailure(state, error) {
        state.currencies = {error};
    },

    liveRateSuccess(state, items) {
        state.rates = {items}
    },

    liveRateFailure(state, error) {
        state.rates = {error}
    },

    periodStatisSuccess(state, data) {
        state.periods = data
    },

    periodStatisFailure(state, error) {
        state.periods = {error}
    }
};

export const currency = {
    namespaced: true,
    state,
    actions,
    mutations
};
