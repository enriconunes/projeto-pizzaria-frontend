import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies, destroyCookie } from "nookies";

import { AuthTokenError } from "../services/errors/AuthTokenErro";

// Função para páginas que so podem ser acessadas por users LOGADOS
export function canSSRAuth<P>(fn: GetServerSideProps<P>){
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

        const cookies = parseCookies(ctx);

        const token = cookies['@nextpizza.token']

        // se nao tiver um token redireciona para o login
        if(!token){
            return {
                redirect: {
                    destination: '/',
                    permanent: false
                }
            }
        }

        // se tiver um token e ele tiver incorreto, entao destroi o token do cookie e redireciona para o login
        try{
            return await fn(ctx);
        } catch(err){
            if(err instanceof AuthTokenError){
                destroyCookie(ctx, '@nextpizza.token')

                return {
                redirect: {
                    destination: '/',
                    permanent: false
                }
            }
            }
        }    
    }
}

// muitas das configurações são do proprio next. focar apenas no que se concentra dentro da funcao (conferir se um cookie existe, por exemplo). 