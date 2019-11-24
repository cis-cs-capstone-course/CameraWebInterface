import Vue from "vue";
import Vuex from "vuex";
const fb = require('./firebaseConfig.js')
Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    user: {
      loggedIn: false,
      data: null,
      cameraIds: []
    }
  },
  getters: {
    user(state) {
      return state.user;
    },
    cameraIds(state) {
      return state.user.cameraIds;
    }
  },
  mutations: {
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
    },
    SET_USER(state, data) {
      state.user.data = data;

      if (data != null) {
        fb.db.collection("users")
          .doc(state.user.data.uid)
          .get()
          .then(function(doc) {
            if (doc.exists) {
                state.user.cameraIds = doc.data().cameraIds;
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
      }
    }

  },
  actions: {
    fetchUser({ commit }, user) {
      // console.log(user);
      commit("SET_LOGGED_IN", user !== null);
      if (user) {
        commit("SET_USER", {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email
        });
      } else {
        commit("SET_USER", null);
      }
    }
  }
});