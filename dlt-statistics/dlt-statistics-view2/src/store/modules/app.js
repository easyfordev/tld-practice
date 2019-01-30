/* eslint-disable */

const state = {
  hid: ''
}

const getters  = {
  __end () {
  }
}

const mutations = {
  hid ( state, payload )  {
    state.hid  = payload
  },
  end () {}
}

const actions = {
  end () {}
}

export default {
  namespaced : true,
  state,
  getters,
  actions,
  mutations
}
