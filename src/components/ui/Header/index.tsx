import Link from "next/link"
import { FiLogOut } from "react-icons/fi"

import { useContext } from "react"
import { AuthContext } from "@/src/contexts/AuthContext"

import Dropdown from "../Dropdown"

export function Header(){

    const { signOut, user } = useContext(AuthContext)

    return(
        <header className="flex justify-between items-center h-24 px-6 mt-2 md:px-16 text-gray-200">

            {/* Logo image */}
            <div className="max-w-[140px] sm:max-w-[200px] md:max-w-[300px]">
                <Link href={'/dashboard'}>
                    <img className="" src="/logo.png" alt="logo NextPizza" />
                </Link>
                {/* exemplo visualizacao dados user */}
                {/* <h1>{user?.name}</h1> */}
            </div>

            {/* Menu items */}
            <nav className="">
                <ul className="flex gap-x-2 md:gap-x-6 items-center">
                    {/* <li className="hover:text-white">
                        <Link href={'/category'}>
                            Categoria
                        </Link>
                    </li>

                    <li className="hover:text-white">
                        <Link href={'/product'}>
                            Cardapio
                        </Link>
                    </li>

                    <li className="hover:text-white">
                        <button className="pt-2" onClick={ signOut }>
                            <FiLogOut size={22}/>
                        </button>
                    </li> */}

                    <li>
                        < Dropdown />
                    </li>
                </ul>         
            </nav>

        </header>
    )
}