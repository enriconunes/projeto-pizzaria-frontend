import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies";

// Função para páginas que so podem ser acessadas por visitantes (nao logados)
export function canSSRGuest<P>(fn: GetServerSideProps<P>){
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

        const cookies = parseCookies(ctx);

        // Se o user tentar acessar a pagina que chamar essa funcao ja tiver logado (existe o cookie de token), entao redireciona para a pagina de dashboard.
        if(cookies['@nextpizza.token']){
            return {
                redirect: {
                    destination: '/dashboard',
                    permanent: false
                }
            }
        }

        return await fn(ctx);
    }
}

// muitas das configurações são do proprio next. focar apenas no que se concentra dentro da funcao (conferir se um cookie existe, por exemplo). 