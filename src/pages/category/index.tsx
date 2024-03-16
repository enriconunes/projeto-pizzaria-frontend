import Head from "next/head"
import { Header } from "@/src/components/ui/Header"
import { Input } from "@/src/components/ui/Input"
import { Button } from "@/src/components/ui/Button"

import { setupAPIClient } from "@/src/services/api"

import { toast } from "react-toastify";

import { FormEvent, useState } from "react"

// metodo de verificacao de autenticacao
import { canSSRAuth } from "@/src/utils/canSSRAuth"

export default function Category(){

    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('')

    async function handleRegister(event: FormEvent){
        event.preventDefault();
        
        if(name === ''){
            toast.warning("Digite o nome da categoria para realizar o cadastro.")
            return
        }

        setLoading(true)

        const apiClient = setupAPIClient()

        await apiClient.post('/createCategory', {
            name: name
        })

        toast.success("Categoria cadastrada com sucesso!")
        setName('')

        setLoading(false)
    }

    return(
        <>
            <Head>
                <title>Nova categoria - NextPizza</title>
            </Head>

            <div>
                <Header />

                {/* main content */}
                <div className="flex flex-col justify-center items-center max-w-xl mx-auto mt-36 px-6">

                    <form className="flex flex-col min-w-full"
                    onSubmit={handleRegister}>

                        <h1 className="text-2xl font-medium mb-3">Cadastrar categoria</h1>
                        
                        <Input
                        placeholder="Digite o nome da nova categoria"
                        value={name}
                        onChange={(e)=>{setName(e.target.value)}}/>

                        <Button
                        type="submit"
                        loading={loading}
                        >
                        Cadastrar
                        </Button>
                    </form>
                </div>
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    return {
        props: {}
    }
})