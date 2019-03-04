function ClientException(message, code = 1) {
    this.message = message;
    /* 1 - syntax, 2 - validation/form */
    this.code = code;
}
export const userKey = 'task-app-user-data'

export const prepareError = (e, vm) => {
    /* eslint-disable */
    try {
        if (typeof e === "object")
        {
            if (e.response && e.response.data)
            {
                if (e.response.status == 401) {
                    let user = vm.$store.state.auth.user
                    if (user && user.keepLogin) {
                        return vm.$store.dispatch('busNotifyDialog', true)
                    }
                }

                let reason = e.response.data
                let kindErr = typeof reason ==="object"
                
                if (kindErr && reason.validations) {
                    let rules = {}
                    for (let key in reason.validations) {
                        rules[key] = reason.validations[key].join(', ')
                    }
                    vm.rules = rules
                    throw new ClientException("Por favor, corriga os campos com erro", 2)
                } else if (kindErr && reason.message) {
                    throw new ClientException(reason.message, 2)
                } else{
                    throw new ClientException(reason.toString(), 2)
                }
            } else if (e.message && e.stack){
                throw new ClientException(e.message)
            }
        }
        else{
            throw new ClientException(e.toString(), 2)
        }
    } catch (ex) {
        let message = ex.code == 2 ? ex.message :  "erro desconhecido"
        vm.$toasted.global.defaultError({ message })
        if(ex.code == 1){
            console.log({ e })
        }
    }
}

export const browserData = () => {
    let ua = navigator.userAgent
    let tem
    let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []
    
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return { name: 'IE', version: (tem[1] || 0) }
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR|Edge\/(\d+)/)
        if (tem != null) {
            return { name: 'Opera', version: tem[1] }
        }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?']
    
    if ((tem = ua.match(/version\/(\d+)/i)) != null) {
        M.splice(1, 1, tem[1])
    }
    return { name: M[0], version: M[1]}
}

export const statusData = [
    { "id": "1", "name": "Ativo", "class": "green" },
    { "id": "0", "name": "Inativo", "class": "grey" }
]

export const priorityData = [
    { "id": "1", "name": "Baixa", "class": "light-blue" },
    { "id": "2", "name": "Média", "class": "amber" },
    { "id": "3", "name": "Alta", "class": "red" }
]
export const situationData = [
    { "id": "1", "name": "Aberto", "class": "blue" },
    { "id": "2", "name": "Concluído", "class": "green" },
    { "id": "3", "name": "Cancelado", "class": "red" },
    { "id": "4", "name": "Em processo", "class": "amber" },
    { "id": "5", "name": "Expirado", "class": "grey" },
    { "id": "6", "name": "Em espera", "class": "light-blue" },
]