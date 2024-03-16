import Head from "next/head"
import { Header } from "@/src/components/ui/Header"
import { Input } from "@/src/components/ui/Input"
import { Button } from "@/src/components/ui/Button"

import { FormEvent } from "react"
import { useState } from "react"
import { useRouter } from 'next/router';

import { toast } from 'react-toastify'

import { setupAPIClient } from "@/src/services/api"

export default function Table(){

    const [table, setTable] = useState('')
    const [idTable, setIdTable] = useState('')
    const [name, setName] = useState('')
    const [nextPage, setNextPage] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleOpenTable = async (table: string, name: string, e:FormEvent) => {
        e.preventDefault()

        
        if(table === ''){
            toast.warning('Digite o número da mesa.')
            return
        }
        
        setLoading(true)
        
        // abrir mesa na base de dados
        const apiClient = setupAPIClient()
        const response = await apiClient.post('/order/open',
        {
            'table': parseInt(table),
            'name': name
        })

        // id passado como parametro na url
        const { id } = response.data
        setIdTable(id)

        setNextPage(true)
    }
    
    if(nextPage){
        const router = useRouter()
        router.push(`/order?table=${table}&id=${idTable}`)
        setNextPage(false)
        setLoading(false)
    }

    return(
        <>
            <Head>
                <title>Next Pizza - Abrir mesa</title>
            </Head>

            <Header />

            <main className="flex flex-col justify-center items-center max-w-xl mx-auto mt-20 px-6">
                <h1 className="text-2xl font-medium mb-3">Novo Pedido</h1>

                <form
                className="w-full flex flex-col"
                onSubmit={(e)=> handleOpenTable(table, name, e)}>
                    <Input
                    type="number"
                    placeholder="Número da mesa"
                    onChange={(e)=>{setTable(e.target.value)}}
                    />

                    <Input
                    type="text"
                    placeholder="Nome do cliente (opcional)"
                    onChange={(e)=>{setName(e.target.value)}}
                    />  

                    <Button
                    loading={loading}
                    type="submit"
                    >
                    Abrir mesa
                    </Button>
                </form>
                
            </main>
        </>
    )
}