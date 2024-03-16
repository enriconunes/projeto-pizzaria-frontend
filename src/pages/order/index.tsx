import { useRouter } from 'next/router';
import { Header } from '@/src/components/ui/Header';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import Head from 'next/head';
import { FormEvent, useState } from 'react';

import { FiTrash2 } from "react-icons/fi"
import { toast } from "react-toastify"

// metodo de verificacao de autenticação - pagina privada
import { canSSRAuth } from "@/src/utils/canSSRAuth";

import { setupAPIClient } from '@/src/services/api';


type ItemProps = {
    id: string,
    name: string
}

interface CategoriesProps{
    categoriesList: ItemProps[]
}

type ProductProps = {
    id: string,
    name: string,
    price: string,
    description: string
}

interface ProductsListProps{
    firstProducts: ProductProps[]
}

type ItemsOrder = {
    id: string;
    name: string;
    amount: number;
}

interface ItemsOrderProps{
    newItem: ItemsOrder[]
}

export default function Order({ categoriesList, firstProducts }: CategoriesProps & ProductsListProps){

    // recuperar numero e id da mesa
    const router = useRouter();
    const { table, id } = router.query;

    const [loading, setLoading] = useState(false)
    const [nextPage, setNextPage] = useState(false)
    const [categorySelected, setCategorySelected] = useState(0)
    const [categories, setCategories] = useState(categoriesList || [])
    const [products, setProducts] = useState(firstProducts || [])
    const [productSelected, setProductSelected] = useState(0)
    const [amount, setAmount] = useState(0)
    const [itemsOrder, setItemsOrder] = useState<ItemsOrder[]>([]);

    async function handleChangeCategory(e){
        setCategorySelected(e.target.value)

        // alert(categories[categories[categorySelected].id])

        const apiClient = setupAPIClient();
        const response = await apiClient.get('/listProducts', {
            params:{
                    category_id: categories[e.target.value].id
                }
            }
        )

        setProducts(response.data)        
    }
    
    function handleChangeProduct(e){
        setProductSelected(e.target.value)
    }

    function handleAddItem(id: string, name: string, amount: number, e){

        e.preventDefault();

        if(amount <= 0){
            toast.warning("Digite uma quantidade válida.")
        }

        // Verificar se já existe um item com o mesmo ID na lista
        const existingIndex = itemsOrder.findIndex(item => item.id === id);

        // A funcao retorna -1 caso nao exista nenhum index que satisfaça a condicao
        // pelo contrario, retorna o index do item que satisfaça
        if (existingIndex !== -1) {
            // Se já existir um item com o mesmo ID, atualizar apenas a quantidade do item existente
            const updatedItems = [...itemsOrder]; // cópia da lista atual
            updatedItems[existingIndex].amount += amount; // atualizar a quantidade do item existente
            setItemsOrder(updatedItems); // atualizar o estado com a nova lista

            return;
        }

        // caso nao seja um item repetido, adicionar normalmente
        const newItem: ItemsOrder = {
            'id': id,
            'name': name,
            'amount': amount
        }
        
        // adicionar item selecinado a lista de items
        setItemsOrder([...itemsOrder, newItem]);
    }

    function handleDeleteItem(id: string){
        // Crie uma nova lista excluindo o item com o ID específico
        // o filter faz uma filtragem de todos os itens que tenham o id diferente do id passado como parametro
        // os demais itens ficam salvos em updatedItems, que sera usado para atualizar a lista
        const updatedItems = itemsOrder.filter(item => item.id !== id);
        
        // Atualize o estado com a nova lista
        setItemsOrder(updatedItems);
    }

    async function handleSendOrder(e: FormEvent){
        e.preventDefault()

        if(itemsOrder.length === 0){
            toast.warning("O pedido está vazio.")
            return
        }

        setLoading(true)

        const apiClient = setupAPIClient()

        for(let x = 0; x < itemsOrder.length; x++){
            await apiClient.post('/order/addItem', {
            order_id: id,
            product_id: itemsOrder[x].id,
            amount: itemsOrder[x].amount
        })
        }
        
        const openOrder = await apiClient.put('/order/send', {
            order_id: id
        })

        setLoading(false)
        setNextPage(true)

        toast.success(`Pedido enviado à cozinha.`)
    }

    if(nextPage){
        const router = useRouter()
        router.push(`/table`)
        setNextPage(false)
    }

    return(
            <>
                <Head>
                    <title>Next Pizza - Abrir mesa</title>
                </Head>

                <Header />

                <main className="flex flex-col justify-center max-w-xl mx-auto mt-10 px-6">
                    <h1 className="text-2xl font-medium mb-3 text-left">Mesa {table}</h1>

                    <form
                    className="w-full flex flex-col"
                    onSubmit={(e) => handleSendOrder(e)}
                    >
                        <select
                        // value define qual é o option selecionado em forma de array. se o value for 1, o option selecionado será o segundo
                        value={categorySelected}
                        onChange={(e) => handleChangeCategory(e)}
                        className="text-gray-200 bg-gray-950 mb-4 px-3 py-2 border border-gray-500 rounded-lg">
                            <option disabled>Selecione a categoria do produto</option>
                            {categories.map( (item, index) => {
                                return(
                                    // index = posicao da lista [0, 1, 2...]
                                    // item = cada item do array mapeado
                                    <option value={index} key={item.id}>
                                        {item.name}
                                    </option>
                                )
                            })}
                        </select>

                        <select

                        // value define qual é o option selecionado em forma de array. se o value for 1, o option selecionado será o segundo
                        value={productSelected}
                        onChange={handleChangeProduct}
                        className="text-gray-200 bg-gray-950 mb-4 px-3 py-2 border border-gray-500 rounded-lg">
                            <option disabled>Selecione o produto</option>
                            {products.map( (item, index) => {
                                return(
                                    // index = posicao da lista [0, 1, 2...]
                                    // item = cada item do array mapeado
                                    <option value={index} key={item.id}>
                                        {item.name}
                                    </option>
                                )
                            })}
                        </select>

                        <span className='font-medium mb-4'>Quantidade do item</span>

                        <div className='flex'>
                            <Input
                            type="number"
                            placeholder="Qtd."
                            required
                            onChange={(e) => setAmount(parseInt(e.target.value))}
                            />
                            <button
                            className='bg-emerald-600 h-10 rounded-md ml-2 text-sm w-full'
                            onClick={ (e) => handleAddItem(products[productSelected].id, products[productSelected].name, amount, e)}>
                            Adicionar item
                            </button>  
                        </div>
                        
                        {/* order items */}
                        <div className='mt-2'>

                            {itemsOrder.length === 0 && (
                                <div className='w-full h-10 bg-gray-950 flex justify-between items-center px-4 border border-gray-500 text-gray-200 mb-4'>
                                        {/* name */}
                                        <span className='text-sm'>
                                            Nenhum item foi adicionado...
                                        </span>
                                    </div>
                            )}

                            {itemsOrder.map( (item, index) => {
                                return(
                                    // index = posicao da lista [0, 1, 2...]
                                    // item = cada item do array mapeado
                                    // order item
                                    <div key={item.id} className='w-full h-10 bg-gray-950 flex justify-between items-center px-4 border border-gray-500 text-gray-200 mb-4'>
                                        {/* name */}
                                        <span className='text-sm'>
                                            <span className='text-xs'>{item.amount}x </span>{item.name}
                                        </span>
                                        {/* delete icon */}
                                        <button
                                        className='text-red-500'
                                        onClick={()=> handleDeleteItem(item.id)}>
                                            <FiTrash2/>
                                        </button>
                                    </div>
                                )
                            })}

                        </div>

                        <Button
                        type="submit"
                        loading={loading}
                        >
                        Enviar pedido
                        </Button>
                    </form>
                    
                </main>
        </>
    )
}

// validar se o user está logado com o metodo canSSRAuth e receber categorias antes de renderizar
export const getServerSideProps = canSSRAuth( async(ctx) => {

    // O parâmetro context passado para a função getServerSideProps é um objeto que contém informações sobre a solicitação HTTP recebida no servidor durante a execução do lado do servidor (SSR). Ele fornece acesso a vários detalhes da solicitação, como cabeçalhos, cookies, parâmetros de rota, entre outros.
    const apiClient = setupAPIClient(ctx)

    const response = await apiClient.get('/listCategories');

    // pegar id do primeiro index da lista de categorias para ja listar os produtos referentes a ele sem ter que o selecionar
    // console.log(response.data[0].id)

    const firstProducts = await apiClient.get('/listProducts', {
        params:{
            category_id: response.data[0].id
        }
    })
    
    return{
        props: {
            categoriesList: response.data,
            firstProducts: firstProducts.data
        }
    }
})