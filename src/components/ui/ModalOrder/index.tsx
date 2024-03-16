import Modal from 'react-modal'
import { FiX } from 'react-icons/fi'
import { orderItemProps } from '@/src/pages/dashboard';
import { useState, useEffect } from 'react';

interface ModalOrderProps{
    isOpen: boolean;
    onRequestClose: () => void;
    handleFinishOrder: (id: string) => void;
    order: orderItemProps[] //interface exportada no ./dashboard
}


export function ModalOrder({isOpen, onRequestClose, order, handleFinishOrder}: ModalOrderProps){

    const [price, setPrice] = useState(0)

    function makeSum(){
        let sum = 0
        for(let x = 0; x < order.length; x++){
            sum += (parseFloat(order[x].product.price) * order[x].amount)
        }

        // Limitar a soma a duas casas decimais
        sum = parseFloat(sum.toFixed(2));
        setPrice(sum)   
    }

    useEffect(() => {
        makeSum();
    }, [order]);

    return(
            <Modal
            // propriedades requisitadas da cocumentacao da biblioteca
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className={'max-w-xl w-11/12 bg-gray-950 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md shadow-xl'}>
        
                {/* MODAL CONTENT */}
                <div className='h-full w-full pt-4 pb-4'>

                    {/* header - close button */}
                    <div className='flex justify-end items-center pr-4'>
                        <button
                        type='button'
                        onClick={onRequestClose} //ao clicar, chama a funcao recebida como parametro desse componente. a funcao apenas troca o 'visibleModal' para false
                                                //o 'visibleModal' é usado para controlar o parametro 'isOpen' que é um parametro padrao da biblioteca
                        className='react-modal-close bg-transparent border-none' //'react-modal-close' é uma classe padrao exigida pela biblioteca
                        >
                            <FiX className='text-4xl text-orange-600'></FiX>
                        </button>
                    </div>

                    {/* content */}
                    <div className='px-4 py-4 md:px-8'>

                        <h2 className='text-2xl font-medium'>Detalhes do pedido</h2>

                        <span>
                            Mesa: <span className='font-medium'>{order[0].order.table}</span>
                        </span>

                        <div className='mt-4 font-thin text-gray-100'>
                            {order.map( item => (
                                <section key={item.id}>
                                    <span className='text-sm'>{item.amount}x</span>
                                    <span className='ml-2'>{item.product.name}</span>
                                </section>
                            ))}
                        </div>

                        <div className='mt-4 flex flex-col'>
                            <span className='text-orange-600 font-medium text-xl'>Total</span>
                            <span className='text-sm text-gray-100'>R$ {price}</span>
                        </div>

                        <button
                        className='text-sm bg-black border border-emerald-800 text-emerald-400 p-2 mt-5 w-full hover:brightness-150'
                        onClick={ ()=> { handleFinishOrder(order[0].order_id) }}>
                            Concluir pedido
                        </button>

                    </div>

                </div>

        </Modal>
        
    )
}