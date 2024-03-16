import { canSSRAuth } from "@/src/utils/canSSRAuth"

import Head from "next/head"
import { Header } from "../../components/ui/Header"

import { useState } from "react"

import { FiRefreshCcw } from "react-icons/fi"
import { toast } from "react-toastify"

import { setupAPIClient } from "@/src/services/api"

// modal
import Modal from 'react-modal'
import { ModalOrder } from "@/src/components/ui/ModalOrder"

type orderProps = {
    id: string,
    table: number,
    status: boolean,
    draft: boolean,
    name: string | null,
    created_at: Date,
    updated_at: Date
}

export type orderItemProps = {
    id: string,
    amount: number,
    order_id: string,
    product_id: string,
    product: {
        id: string,
        name: string,
        description: string,
        price: string,
        banner: string
    }
    order: {
        id: string,
        table: string | number,
        status: boolean,
        name: string | null
    }
}

interface ordersListProps{
    ordersList: orderProps[]
}


export default function Dashboard({ordersList}: ordersListProps){

    // alterar controle de visibilidade do modal
    function handleCloseModal(){
        setModalVisible(false)
    }

    // atualizar useState com a lista de orders
    async function refreshOrders(){
        const apiClient = setupAPIClient()
        const response = await apiClient.get('/order/list')
        setOrders(response.data)
    }

    // abrir modal com detalhes de um pedido
    async function handleOpenModal(id: string){
        // primeiro faz a requisicao do pedido
        // depois atualiza a useState setModalItem
        // por fim abre o modal com os detalhes atualizados
        
        const apiClient = setupAPIClient();
        const response = await apiClient.get('/order/detail', {
            //enviado dessa forma porque foi definido no backend que os parametros sao enviados pela url (query params)
            //ex: http://localhost:3000/order/detail?order_id=b5757e7d-938a-4997-ac93-872f699f5b7d
            params: {
                order_id: id
            }
        })

        setModalItem(response.data)
        setModalVisible(true)
    }
    
    // funcao para finalizar um pedido
    // é chamada no modal onde tambem é passado o id como parametro
    async function handleFinishItem(id: string){
        const apiClient = setupAPIClient();
        await apiClient.put('/order/finalize', {
            order_id: id
        })

        setModalVisible(false)

        // requisicao da rota novamente para atualizar lista de orders
        refreshOrders()

        toast.success("Pedido finalizado!")
    }

    // define como array vazio se 'ordersList' ainda nao existir ou estiver vazio
    const [orders, setOrders] = useState(ordersList || [])

    // definir que o modalItem é um array de objetos que contem todas as propriedades do type orderItemProps
    // usado para guardar a resposta do server com todos os itens
    const [modalItem, setModalItem] = useState<orderItemProps[]>()
    const [modalVisible, setModalVisible] = useState(false)

    // definir div principal do projeto
    // *que contem o conteudo principal
    // o next nomeia como __next por padrao
    Modal.setAppElement('#__next')

    return(
        <>
            <Head>
                <title>Painel - NextPizza</title>
            </Head>

            <Header />
                {/* container */}
                <div className="flex flex-col justify-center items-center max-w-xl mx-auto mt-16 px-6">

                    <div className="flex flex-col min-w-full">

                        <div className="flex items-center">
                            <h1 className="text-2xl font-medium mb-3">Últimos Pedidos</h1>

                            <button 
                            className="ml-3 mb-2 text-emerald-500 hover:cursor-pointer transform hover:scale-125 transition duration-300 ease-in-out hover:brightness-200"
                            onClick={ () => refreshOrders() }>
                            <FiRefreshCcw />
                            </button>
                        </div>

                        {orders.length === 0 && (
                            <span>Não encontramos nenhum pedido em aberto...</span>
                        )}

                        {orders.map( (item, index) => {
                            return(
                                <button
                                className="flex h-12 items-center bg-gray-950 rounded-md mb-3 overflow-hidden hover:brightness-125"
                                key={item.id}
                                onClick={ () => handleOpenModal(item.id)} >
                                    <div className="bg-emerald-500 h-full w-2"></div>
                                    <span className="pl-4">Mesa {item.table}</span>
                                </button>
                        )
                        })}    

                    </div>

                    {modalVisible && (
                        < ModalOrder 
                        isOpen={modalVisible}
                        onRequestClose={handleCloseModal}
                        handleFinishOrder={handleFinishItem}
                        order={modalItem}/>
                    )}
                </div>
        </>
    )
}

// as propriedades das fuções server side são executadas sempre que a pagina é carregada (antes de renderizar o front end), similar a um middleware
// a funcao abaixo é utilizada para conferir se o user ja está logado antes de renderizar a pagina de dashboard

export const getServerSideProps = canSSRAuth(async(ctx) => {

    const apiClient = setupAPIClient(ctx)

    const response = await apiClient.get('/order/list')

    // console.log("Resposta recebida: ", response.data)

    return{
        props: {
            ordersList: response.data
        }
    }

})