import { createStore } from 'vuex';

import createPersistedState from 'vuex-persistedstate';

export default createStore({
  plugins: [
    createPersistedState({
      key: 'store',
      reducer(val: any) {
        if (!localStorage.getItem('token')) return {};
        return val;
      },
    }),
  ],
  state: {
    user: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {},
  modules: {},
});
