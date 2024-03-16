import Head from "next/head";
import { useState, FormEvent } from "react";

import { toast } from "react-toastify";

// componentes
import { Header } from "@/src/components/ui/Header";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";

// icone
import { FiUpload, FiImage } from "react-icons/fi";

// lidar com o envio do input file
import { ChangeEvent } from "react";

// metodo de verificacao de autenticação - pagina privada
import { canSSRAuth } from "@/src/utils/canSSRAuth";

// conexao com a base de dados
import { setupAPIClient } from "@/src/services/api";

// criar tipagem e interface para o valor retornado n GetServerSideProps (lista de categorias recebida da requisicao). o parametro tem a interface CategoriesProps que possui uma lista de elementos do tipo ItemProps
type ItemProps = {
    id: string,
    name: string
}

interface CategoriesProps{
    categoriesList: ItemProps[]
}

export default function Product({categoriesList}: CategoriesProps){

    // valor retornado pelo GetServerSideProps
    // console.log(categoriesList)

    // valores dos inputs
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')

    const [loading, setLoading] = useState(false)

    // preview temporario
    const [imageURL, setImageURL] = useState('')
    // file para enviar para a rota
    const [image, setImage] = useState(null)

    // define como array vazio se 'cateogriesList' ainda nao existir ou estiver vazio
    const [categories, setCategories] = useState(categoriesList || [])

    // categoria selecionada no input select
    const [categorySelected, setCategorySelected] = useState(0)

    // funcao para receber imagem do formulario
    // recebe um event 'e' do tipo HTMLInputElement
    function handleFile(e: ChangeEvent<HTMLInputElement>){
        if(!e.target.files){
            return;
        }

        const imageFile = e.target.files[0]

        if(!imageFile){
            return;
        }

        if(imageFile.type === 'image/png' || imageFile.type === 'image/jpeg'){

            // file para enviar para API
            setImage(imageFile)

            // definir url do file para preview temporário
            setImageURL(URL.createObjectURL(e.target.files[0]))

        } else{
            toast.warning("Insira uma imagem com formato válido (jpeg ou png).")
            return;
        }
    }

    // funcao chamada ao selecionar uma categoria no input select
    function handleChangeCategory(e){
        // console.log("Posicao da categoria selecionada: ", e.target.value)
        // console.log("Categoria selecionada: ", categories[e.target.value])

        // variavel que controla o valor/option selecionado. ao alterar, altera tambem o value do select
        setCategorySelected(e.target.value)
    }

    // funcao chamada no submit do form para cadastar produto na db
    // async pois leva um tempo para a comunicacao com o servidor
    async function handleRegister(event: FormEvent){
        event.preventDefault();

        try{

            const data = new FormData();

            if(name === '' || price === '' || description === '' || image === ''){
                toast.warning("Preencha todos os campos!")
                return;
            }

            setLoading(true)

            // configuracao do multipartform
            // metodo de envio definido no backend para fazer a requisicao da rota de cadastro de produto
            data.append('name', name)
            data.append('price', price)
            data.append('description', description)
            data.append('category_id', categories[categorySelected].id)
            data.append('file', image)

            const apiClient = setupAPIClient();
            await apiClient.post('/createProduct', data);

            toast.success("Produto cadastrado com sucesso!")

            setLoading(false)

        } catch(erro){
            console.log("Erro ao cadastrar: ", erro)
            toast.error("Oops! Erro ao cadastrar produto: " + erro)
        }

        setName('')
        setPrice('')
        setDescription('')
        setImage(null)
        setImageURL('')
    }

    return(
        <>
            <Head>
                <title>Novo Produto - Next Pizza</title>
            </Head>

            <div>
                <Header />
                
                <main className="flex flex-col justify-center items-center max-w-xl mx-auto mt-8 px-6">

                    <form
                    className="flex flex-col min-w-full"
                    onSubmit={handleRegister}>
                        <h1 className="text-2xl font-medium mb-3 text-gray-100">Cadastrar Produto</h1>

                        <label className="h-32 text-gray-200 bg-gray-950 mb-4 border border-gray-500 rounded-lg flex flex-col justify-center items-center hover:cursor-pointer overflow-hidden">

                            <div className="flex flex-col items-center z-50 absolute">
                                {/* icone */}
                                <span><FiImage></FiImage></span>

                                <span
                                className="text-xs text-gray-400"
                                >
                                Adicionar imagem
                                </span>
                            </div>   

                            <input type="file" accept="image/png image/jpeg" onChange={handleFile} className="hidden"/>

                            {/* so exibe se imageURL deixar de ser null */}
                            {imageURL && (
                                <img
                                src={imageURL}
                                alt="Imagem do produto"
                                className="w-full"
                                />
                            )}
                            
                        </label>

                        <select
                        // value define qual é o option selecionado em forma de array. se o value for 1, o option selecionado será o segundo
                        value={categorySelected}
                        onChange={handleChangeCategory}
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

                        <Input
                        type="text"
                        placeholder="Digite o nome do produto"
                        value={name}
                        onChange={(e)=>{setName(e.target.value)}}
                        />

                        <Input
                        type="text"
                        placeholder="Digite o preço do produto. Ex: (15.99)"
                        value={price}
                        onChange={(e)=>{setPrice(e.target.value)}}
                        />
                        
                        <textarea
                        placeholder="Descreva seu produto..."
                        className="mb-4 border border-gray-500 rounded-lg bg-gray-950 text-white py-2 px-4 placeholder-gray-200 resize-none"
                        value={description}
                        onChange={(e)=>{setDescription(e.target.value)}}
                        />

                        <Button
                        type="submit"
                        loading={loading}>
                            Cadastrar
                        </Button>

                    </form>
                </main>
            </div>
        </>
    )
}

// validar se o user está logado com o metodo canSSRAuth e receber categorias antes de renderizar
export const getServerSideProps = canSSRAuth( async(ctx) => {

    // O parâmetro context passado para a função getServerSideProps é um objeto que contém informações sobre a solicitação HTTP recebida no servidor durante a execução do lado do servidor (SSR). Ele fornece acesso a vários detalhes da solicitação, como cabeçalhos, cookies, parâmetros de rota, entre outros.
    const apiClient = setupAPIClient(ctx)

    const response = await apiClient.get('/listCategories');

    // console.log(response.data)

    return{
        props: {
            categoriesList: response.data
        }
    }
})