// importar tipagem dos atributos do input
import { InputHTMLAttributes, TextareaHTMLAttributes } from "react"

// Tipar atributos que podem ser recebidos ao usar o component
interface InputProps extends InputHTMLAttributes<HTMLInputElement>{}
interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>{}

export function Input({...rest}: InputProps){
    return(
        <input 
        {...rest}
        className="mb-4 h-10 border border-gray-500 rounded-lg bg-gray-950 text-white p-4 placeholder-gray-200"
        />
    )
}

export function TextArea({...rest}: TextAreaProps){
    return(
        <TextArea></TextArea>
    )
}