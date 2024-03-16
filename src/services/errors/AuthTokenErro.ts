// criacao do erro que será chamado no middleware de comunicacao com a api caso tenha um erro 401 (nao autorizado - token incorreto)

export class AuthTokenError extends Error{
    constructor(){
        super('Error with authentication token.')
    }
}