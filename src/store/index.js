import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    //状态
    state: {
        loadding: false
    },
    //状态修改方法
    // 使用store.commit()来调用
    mutations: {
        // loadding
        showloadding(state, load) {
            state.loadding = load
        }
    },
    //调用mutations，可以包含异步操作
    // 可以用store.dispatch来调用
    actions: {
        setloadding(context, load) {
            context.commit("showloadding", load);
        }
    },
    getters: {
        isloading: (state) => {
            return state.loadding
        }
    }
})
