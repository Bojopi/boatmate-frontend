import Layout from "@/components/layout"
import MenuBar from "@/components/menuBar"
import { Checkbox } from "@/components/react-hook-form/checkbox"
import { SelectTwo } from "@/components/react-hook-form/select-two"
import Link from "next/link"
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"

const serviceJson = require('../../sql/services.json')

export type FormProps = {
    services: any;
}

const FormService: React.FC = () => {

    const [isCheckAll, setIsCheckAll] = useState<boolean>(false);
    const [isCheck, setIsCheck] = useState<any[]>([]);
    const [list, setList] = useState<any[]>([]);

    useEffect(() => {
        setList(serviceJson);
      }, [list]);

    const methods = useForm<FormProps>({
        defaultValues: {
            services: []
        },
    });

    const {
        handleSubmit,
        setError,
        formState: {errors},
    } = methods;

    const onSubmit = () => {}
    
    const onErrors = () => {}

    const selectAll = () => {
        setIsCheckAll(!isCheckAll);
        setIsCheck(list.map((li: any) => li.id));
        if (isCheckAll) {
            setIsCheck([]);
        }
    }

    const handleClick = (e: any) => {
        const { id, checked } = e.target;
        console.log(isCheck)
        if(!checked) {
            console.log('esta tickeado')
            if(isCheck.length != 0) {
                const filtro = isCheck.filter((item: any) => item != Number(id))
                setIsCheck(filtro);
            } else {
                return
            }

        } else {
            console.log('no esta tickeado')
            if(isCheck.length != 0) setIsCheck([...isCheck, Number(id)]);
            else setIsCheck([Number(id)]);
        }
      };

  return (
    <>
        <Layout>
            <MenuBar linkMenu='Sign In' urlMenu='/login' menuItem={false}/>
            <div className="w-full flex justify-center py-3 mt-20 lg:mt-24">
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit, onErrors)} className="w-11/12 lg:w-1/3 shadow-lg py-5 px-5 lg:px-10 rounded-md border">
                        <p className="font-bold mb-3 lg:mb-5 text-sm lg:text-base">Select any other services you do.</p>
                        <p className="text-xs lg:text-sm mb-3 lg:mb-5">You'll show up in search results and get jobs for all services you select:</p>
                        <div className="flex justify-start mb-3 lg:mb-5">
                            <p onClick={selectAll} className="text-xs lg:text-sm font-medium text-[#109EDA] cursor-pointer hover:text-[#27aee8]">Select all</p>
                        </div>
                        <div className="max-h-72 lg:max-h-80 overflow-y-auto">
                            {
                                list.map((service: any, i: number) => (
                                    <div key={i} className="py-2 flex items-center gap-2 border-b border-b-gray-300">
                                        <input 
                                        type="checkbox"
                                        key={service.id}
                                        id={service.id}
                                        name={service.name}
                                        onChange={handleClick}
                                        checked={isCheck.includes(Number(service.id))}
                                        className="w-3 lg:w-4 h-3 lg:h-4 text-blue-600 border-gray-300 rounded form-checkbox focus:ring-blue-500"
                                        />
                                        <label htmlFor={service.id} className="shrink-0 block text-gray-700 whitespace-nowrap text-xs lg:text-base">{service.name}</label>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="flex flex-row items-center justify-around mt-5 mb-3">
                            <Link href={'/pro/list'} className="border-2 border-[#373A85] text-[#373A85] font-bold px-10 py-1 rounded-md hover:bg-[#c6c7ee43] text-sm lg:text-base">Back</Link>
                            <Link href={'/pro/form-2'} className="border-2 border-[#373A85] bg-[#373A85] text-white font-bold px-10 py-1 rounded-md hover:bg-[#212359] text-sm lg:text-base">Next</Link>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <p className="text-xs lg:text-sm font-medium">Problems Registering?</p>
                            <p className="text-xs lg:text-sm">Contact us at <span className="text-[#109EDA] font-medium">1-813-766-7565</span></p>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </Layout>
    </>
  )
}


export default FormService