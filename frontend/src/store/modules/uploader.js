import axios from 'axios'

export default {
    state: {
        progress: 0,
        file: null,
        deletedKeys: []
    },
    mutations: {
        addFile(state, payload){
            let file = payload
            if(payload instanceof File)
                file = payload
            else if (payload instanceof Blob)
                file = new File([payload], state.file.name, { type: state.file.type })
            state.file = file
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
        sendFile({ state, dispatch, commit }, payload) {
            return new Promise((resolve, reject) => {
                dispatch('deleteFile', payload)
                .then(() => {
                    if (state.file){
                        let formData = new FormData();
                        formData.append('file', state.file);

                        axios.post(`upload/${payload}`, formData, {
                            headers: { 'Content-Type': 'multipart/form-data' },
                            onUploadProgress: p => state.progress = Math.round(p.loaded / p.total * 100) || 0
                        })
                        .then(response => {
                            commit('resetInstance')
                            resolve(response.data)
                        })
                        .catch(err => reject(err))
                    } else{
                        let mode = state.deletedKeys.length > 0 ? false : null
                        commit('resetInstance')
                        resolve(mode)
                    }

                })
                .catch(err => reject(err))
            })
        },
    }
}