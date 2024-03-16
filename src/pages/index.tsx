import Head from "next/head";
import Image from "next/image";
import logo from "../../public/logo.png"
import Link from "next/link";

// usar context
import { useContext, FormEvent, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

// importar componentes
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

// pop-up
import { toast } from "react-toastify";

// server side function
import { canSSRGuest } from "../utils/canSSRGuest"; 

export default function Home() {

  // acessar valores do contexto
  const { signIn } = useContext(AuthContext)

  // criar variaveis para receber dados do user
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)

  // FormEvent usado para nao atualizar a pagina ao fazer o submit do form
  async function handleLogin(event: FormEvent){
    event.preventDefault();

    // conferir se os dados estao preenchidos
    if(email === '' || password === ''){
      toast.warning("Preencha todos os campos!")
      return
    }

    // ativar loading do botao
    setLoading(true)

    let data = {
      email: email,
      password: password
    }

    // await porque é uma funcao assincrona
    await signIn(data)

    // desativar loading apos o final da funcao assincrona
    setLoading(false)
  }

  return (  
    <>
      {/* Alterar atributos do header */}
      <Head>
          <title>Next Pizza - Login</title>
      </Head>

      <main className="min-h-screen flex flex-col justify-center items-center">

        <div className="flex flex-col justify-center items-center max-w-xl">

          <Image
          src={logo}
          alt="Logo Next Pizza"
          className="w-10/12"
          />

          <form
          className="flex flex-col w-full p-4"
          onSubmit={handleLogin}
          >

            <Input
            placeholder="Digite seu email"
            type="email"
            value={email}
            onChange={ (e) => {setEmail(e.target.value)} }
            />

            <Input
            placeholder="Digite sua senha"
            type="password"
            value={password}
            onChange={ (e) => {setPassword(e.target.value)} }
            />

            <Button
              type="submit"
              loading={loading}
            >
              Acessar
            </Button>

          </form>

          <Link href="/signup">
            <p
            className="text-gray-200 hover:underline">Não tem uma conta? Cadastre-se</p>
          </Link>
        </div>

      </main>

    </>
  );
}

// as propriedades das fuções server side são executadas sempre que a pagina é carregada (antes de renderizar o front end), similar a um middleware
// a funcao abaixo é utilizada para conferir se o user ja está logado antes de renderizar a pagina de login

export const getServerSideProps = canSSRGuest(async(ctx) => {

  // nao retorna nada, apenas executa a funcao 'canSSRGuest' criada em ./utils para redirecionar o user caso o cookie de autenticação exista.
  return{
    props: {}
  }

})