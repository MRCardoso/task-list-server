import axios from 'axios'

export default {
    state: {
        progress: 0,
        file: null
    },
    mutations: {
        addFile(state, payload){
            state.file = payload
        }
    },
    actions: {
        deleteFile(_, payload){
            return axios.post(`remove/${payload.id}`, {Keys: payload.Keys})
        },
        sendFile({ state }, payload) {
            if (state.file){
                let formData = new FormData();
                formData.append('file', state.file);
    
                return axios.post(`upload/${payload}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: p => state.progress = Math.round(p.loaded / p.total * 100) || 0
                })
            }
            return Promise.resolve()
        },
    }
}