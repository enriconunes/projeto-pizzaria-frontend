import { createContext, ReactNode, useEffect, useState } from "react";

import { destroyCookie, setCookie, parseCookies } from "nookies";
import Router from "next/router";

import { api } from "../services/apiClient";

import { toast } from "react-toastify";

// TIPAGENS

// context é criado para que todas as paginas possam acessar os valores definidos aqui
// neste caso, os valores sao os do tipo 'AuthContextData':
// variavel 'user' do tipo UserProps
// isAuthenticated do tipo boolean
// signIn que é uma funcao assincrona q recebe parametros do tipo SignProps (email e password)

// AuthContextData sao os dados do contexto que serao compartilhados para as outras paginas
// Esses dados tem tipagens especificas (UserProps, boolean e SignProps)
// signIn: funcao que recebe 'credentials' como parametro que tem o tipo 'SignProps'.
//         é uma promise porque pode levar um tempo para se comunicar com o server e retorna void (nada)

type AuthContextData = {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignProps) => Promise<void>;
    signOut: () => void;
    signUp: (credentials: SignUpProps) => Promise<void>;
}

type UserProps = {
    id: string,
    name: string,
    email: string
}

type SignProps = {
    email: string,
    password: string
}

type SignUpProps = {
    name: string,
    email: string,
    password: string
}

type AuthProviderProps = {
    children: ReactNode
}

// variavel que será utilizada em outros arquivos para ter o valor do context acessado
export const AuthContext = createContext({} as AuthContextData)

// FUNCAO PARA DESLOGAR USER NAO AUTORIZADO
export function signOut(){
    try{
        // destruir cookie caso exista
        destroyCookie(undefined, '@nextpizza.token')
        // redirecionar para o index (tela de login)
        Router.push('/')
    } catch(err) {
         console.log("Erro ao deslogar: ", err)
    }
}

// PROVIDER DO CONTEXT

// o provider vai estar em volta de todas as paginas
// recebe um children do tipo AuthProviderProps e o renderiza
// o children é tudo o que estiver dentro das tags do provider. Exe: <AuthProvider> children </AuthProvider>

export function AuthProvider({children}: AuthProviderProps){

    // DEFINIR OS ATRIBUTOS REQUISITADOS NO TYPE AuthContextData

    // inicia como vazio e tem o tipo UserProps (deve conter todos os elementos do type)
    // usado para receber os dados do user logado
    const [user, setUser] = useState<UserProps>()

    // se user continuar vazio, entao isAuthenticated = false
    // 'user' so deixará de ser vazio se o login for efetuado
    const isAuthenticated = !!user

    // criar funcao assincrona que pode ser acessada em qualquer pagina da app
    // recebe parametros com a tipagem SignProps
    async function signIn({email, password}: SignProps){
        try{
            const response = await api.post('/session', {
                // body da requisicao enviado pelo post
                email,
                password
            })

            // dados retornados pela api
            // console.log(response.data)

            const { id, name, token } = response.data

            setCookie(undefined, '@nextpizza.token', token, {
                //expirar cookie em 1 mes
                maxAge: 60 * 60 * 24 * 30,
                path: "/" //quais caminhos tem acesso ao cookie ("/" = todos)
            })

            // atualizar valores do user com os dados recebidos
            setUser({
                id,
                name,
                email
            })

            // passar token para todas as proximas requisicoes da api
            // garante que todas as futuras solicitações feitas através da instância api terão o token JWT incluído no cabeçalho de autorização
            api.defaults.headers['Authorization'] = `Bearer ${token}`

            // exibir popup
            toast.success("Logado com sucesso!")

            // redirecionar user para a dashboard (pag de pedidos)
            Router.push('/dashboard')

        } catch(err) {
            toast.error("Erro ao efetuar o login. Tente novamente.")

            console.log("Erro ao acessar: ", err)
        }
    }

    async function signUp({ name, email, password}: SignUpProps){
        try{

            const response = await api.post('/users', {
                // body enviado para a api
                name,
                email,
                password
            })
            
            toast.success("Conta criada com sucesso. Faça o login!")

            // redirecionar user para o login
            Router.push('/')

        } catch(err){

            toast.error("Erro ao cadastrar!")

            console.log("Erro ao cadastrar: ", err)
        }
    }

    // validar token do cookie. se o token existir e tiver correto, então recupera os dados do user atraves dele. senao, faz o logout. - sempre que qualquer tela for carregada.
    useEffect(()=>{

        // tentar recuperar o cookie e o nomeia como 'token'
        const {'@nextpizza.token': token} = parseCookies();

        // a rota /userDetail recebe um token de autenticação e verifica a veracidade dele. caso seja um token valido, retorna os dados do user que estão inseridos nele e atualiza os valores do useState user. É feita essa atualização sempre para que possamos ter os dados do user em todas as paginas
        // nao precisa enviar o token para essa rota, porque se o user ja tiver feito o login, a api busca pelo token no cookie e adiciona no header no atributo 'authorization' (Authorization: `Bearer ${cookies['@nextpizza.token']}`). configurado em ./api.ts
        // *sempre que chamar uma rota que precisa de autenticacao definido no backend, será usado o Authorizarion do header automaticamente.
        if(token){
            api.get('/userDetail').then(response => {
                const { id, name, email } = response.data.user;

                setUser({
                    id,
                    name,
                    email
                })

                // alert(`${id}, ${name}, ${email}`)
            })
            .catch(()=>{
                //se a rota retornar um erro (token invalido, por exemplo), deslogar user
                toast.error("Erro de autenticação. Faça o login novamente.")
                signOut()
            })

        }
    }, [])

    return(
        // as paginas serão renderizadas dentro, no {children} e poderão acessar o value
        // AuthContext é o context criado com a tipagem 'AuthContextData' e
        // será essa a tag que será usada em (./_app.tsx)
        // em tsconfig.json, alterar strict para false
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUp}}> 
            {children}
        </AuthContext.Provider>
    )

}