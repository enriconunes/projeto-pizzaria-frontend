import Head from "next/head";
import Image from "next/image";
import logo from "../../../public/logo.png"
import Link from "next/link";

import { FormEvent, useState, useContext } from "react";

import { AuthContext } from "@/src/contexts/AuthContext";

import { toast } from "react-toastify";

import { canSSRGuest } from "@/src/utils/canSSRGuest"; 

// importar componentes
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";

export default function SignUp() {

  const { signUp } = useContext(AuthContext)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const [loading, setLoading] = useState(false)

  async function handleSignUp(event: FormEvent){
    event.preventDefault()

    if(name === '' || email === '' || password === '' || passwordConfirm === ''){
      toast.warning("Preencha todos os campos.")
      return
    }

    if(password !== passwordConfirm){
      toast.warning("As senhas não são iguais. Tente novamente.")
      return
    }

    setLoading(true)

    let data = {
      name,
      email,
      password
    }

    await signUp(data)

    setLoading(false)
  }

  return (
    <>
      {/* Alterar atributos do header */}
      <Head>
          <title>Next Pizza - SignUp</title>
      </Head>

      <main className="min-h-screen flex flex-col justify-center items-center">

        <div className="flex flex-col justify-center items-center max-w-xl">

          <Image
          src={logo}
          alt="Logo Next Pizza"
          className="w-10/12"
          />

          <form className="flex flex-col w-full p-4"
          onSubmit={handleSignUp}>

            <Input
            placeholder="Digite seu nome"
            type="text"
            value={name}
            onChange={(e) => {setName(e.target.value)}}
            />

            <Input
            placeholder="Digite seu email"
            type="email"
            value={email}
            onChange={(e) => {setEmail(e.target.value)}}
            />

            <Input
            placeholder="Digite sua senha"
            type="password"
            value={password}
            onChange={(e) => {setPassword(e.target.value)}}
            />

            <Input
            placeholder="Confirmar senha"
            type="password"
            value={passwordConfirm}
            onChange={(e) => {setPasswordConfirm(e.target.value)}}
            />

            <Button
              type="submit"
              loading={loading}
            >
              Cadastrar
            </Button>

          </form>

          <Link href="/">
            <p
            className="text-gray-200 hover:underline">Já possui uma conta? Faça o Login</p>
          </Link>
        </div>

      </main>

    </>
  );
}

export const getServerSideProps = canSSRGuest(async(ctx) => {

  // nao retorna nada, apenas executa a funcao 'canSSRGuest' criada em ./utils para redirecionar o user para a pagina de dashboard caso o cookie de autenticação exista.
  return{
    props: {}
  }

})