// tipagem dos atributos
import { ReactNode, ButtonHTMLAttributes } from "react"
// icone de carregamento do botao
import { FaSpinner } from "react-icons/fa"


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    loading?:boolean //? indica que nao é obrigatorio
    children:ReactNode //valor passado dentro das tags (nome)
}

// valores passados como parametro ao usar o componente
export function Button({ loading, children, ...rest}: ButtonProps){

    return(
        <button
        className="h-10 bg-amber-500 p-2 rounded-lg text-white border-none hover:bg-amber-400 transition-all disabled:cursor-not-allowed flex justify-center items-center font-medium"
        disabled={loading}
        {...rest}
        >
            {loading ? (
            <FaSpinner className="animate-spin" color="#FFF" size={20}/>
            ) : (
            <a>
                {children}
            </a>
        )} 
        </button>
    )

}   