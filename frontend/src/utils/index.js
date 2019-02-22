export const userKey = 'task-app-user-data'

export const prepareError = (e) => {
    if (e.response.data)
    {
        let reason = e.response.data
        if (typeof reason === "string"){
            return reason
        } else if (reason.validations) {
            let rules = {}
            for (let key in reason.validations) {
                rules[key] = reason.validations[key].join(', ')
            }
            return rules
        } else{
            return "Erro desconhecido"
        }
    }
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