import { Fragment, useContext } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Bars3Icon } from '@heroicons/react/20/solid'
import Link from "next/link"
import { AuthContext } from '@/src/contexts/AuthContext'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Dropdown() {

  const { signOut } = useContext(AuthContext)

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="px-3 py-2 transform hover:scale-125 transition duration-300 ease-in-out hover:brightness-200">
          <Bars3Icon className="h-7 w-7 md:h-9 md:w-9 text-gray-200" aria-hidden="true"/>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-md overflow-hidden bg-black text-gray-200 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="">

            <Menu.Item>
              {({ active }) => (
                <p
                  className={classNames(
                    active ? 'bg-amber-600 text-gray-200' : 'text-gray-200',
                    'block px-4 py-2 text-xs font-medium bg-emerald-700 text-center hover:cursor-default'
                  )}
                >
                  Cardápio
                </p>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <Link
                  href={'/category'}
                  className={classNames(
                    active ? 'bg-gray-200 text-gray-900' : 'text-gray-300',
                    'block px-4 py-2 text-sm'
                  )}
                >
                  Cadastrar nova categoria
                </Link>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <Link
                  href={'/product'}
                  className={classNames(
                    active ? 'bg-gray-200 text-gray-900' : 'text-gray-300',
                    'block px-4 py-2 text-sm'
                  )}
                >
                  Cadastrar novo produto
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <p
                  className={classNames(
                    active ? 'bg-amber-600 text-gray-200' : 'text-gray-200',
                    'block px-4 py-2 text-xs font-medium bg-emerald-700 text-center hover:cursor-default'
                  )}
                >
                  Pedidos
                </p>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <Link
                  href={'/table'}
                  className={classNames(
                    active ? 'bg-gray-200 text-gray-900' : 'text-gray-300',
                    'block px-4 py-2 text-sm'
                  )}
                >
                  Abrir novo pedido
                </Link>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <Link
                  href={'/dashboard'}
                  className={classNames(
                    active ? 'bg-gray-200 text-gray-900' : 'text-gray-300',
                    'block px-4 py-2 text-sm'
                  )}
                >
                  Pedidos abertos
                </Link>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <p
                  className={classNames(
                    active ? 'bg-amber-600 text-gray-200' : 'text-gray-200',
                    'block px-4 py-2 text-xs font-medium bg-emerald-700 text-center hover:cursor-default'
                  )}
                >
                  Perfil
                </p>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={signOut}
                  className={classNames(
                    active ? 'bg-gray-200 text-gray-900' : 'text-gray-300',
                    'block px-4 py-2 text-sm w-full text-left'
                  )}
                >
                  Sair
                </button>
              )}
            </Menu.Item>

          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
