import axios from 'axios'

export default {
    state: {
        progress: 0,
        file: null,
        deletedKeys: []
    },
    mutations: {
        addFile(state, payload){
            state.file = payload
        },
        removeUploadedFile(state, payload){
            state.deletedKeys = payload
        },
        resetInstance(state){
            state.deletedKeys = []
            state.file = null
            state.progress = 0
        }
    },
    actions: {
        deleteFile({ state }, payload){
            let Keys = state.deletedKeys.map(e => e)
            if (Keys.length > 0){
                return axios.post(`remove/${payload}`, {Keys})
            }
            return Promise.resolve()
        },
        sendFile({ state, dispatch }, payload) {
            return dispatch('deleteFile', payload)
                .then(() => {
                    if (state.file){
                        let formData = new FormData();
                        formData.append('file', state.file);
            
                        return axios.post(`upload/${payload}`, formData, {
                            headers: { 'Content-Type': 'multipart/form-data' },
                            onUploadProgress: p => state.progress = Math.round(p.loaded / p.total * 100) || 0
                        })
                    }
                    return Promise.resolve(null)

                })
                .catch(err => Promise.reject(err))
        },
    }
}