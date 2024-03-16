import axios, {AxiosError} from "axios";
import { parseCookies } from "nookies";

// erro criado manualmente
import { AuthTokenError } from "./errors/AuthTokenErro";

// funcao criada no context para deslogar user
import { signOut } from "../contexts/AuthContext";

// configurar a api
// recebe um context como parametro. se nao for passado, define como undefined
export function setupAPIClient(context = undefined){

    // definir cookies
    let cookies = parseCookies(context)

    const api = axios.create({
        baseURL: `http://localhost:3000`,
        headers: {
            // receber token pelo cookie caso exista
            Authorization: `Bearer ${cookies['@nextpizza.token']}`
        }
    })

    // 'middleware' que sempre sera executado ao chamar uma api
    api.interceptors.response.use(response => {
        return response
    }, (error: AxiosError) => {
        if(error.response.status === 401){
            //Erro 401: Nao autorizado
            //Deslogar user, função definida no context
            signOut();
            if(typeof window !== undefined){
                //chamar funcao para deslogar user
            } else{
                return Promise.reject(new AuthTokenError())
            }
        }

        // outros erros alem do 401
        return Promise.reject(error)
    })

    return api
}