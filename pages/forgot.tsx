import LayoutPrincipal from "@/components/layoutPrincipal"
import Link from "next/link"
import { Button } from "primereact/button"
import { InputText } from "primereact/inputtext"


const ForgetPass = () => {
  return (
    <LayoutPrincipal>
      <div className='w-full h-[calc(100vh-180px)] md:h-auto flex flex-col items-center justify-center py-16'>
        <Link href={'/'} className='w-16 md:w-24' >
            <img
                src="https://images.squarespace-cdn.com/content/v1/634f43133040660154fd193a/07d993cf-6c35-46b4-a3d8-2c26c53b2958/Biggest_BoatMate-removebg-preview.png?format=1500w"
                alt="logo"
                className='w-16 md:w-24'
            />
        </Link>
        <p className="text-2xl font-bold mt-5">Forgot Password</p>
        <Link href={'/login'} className="text-sm text-[#00CBA4] font-medium" >Or Login</Link>
        <InputText id="email" name="email" placeholder="Email address" className="w-[80%] md:w-[50%] lg:w-[30%] mt-5" />
        <Button label="Continue" icon='pi pi-lock' className="bg-[#109EDA] w-[80%] md:w-[50%] lg:w-[30%] mt-5"></Button>
      </div>
    </LayoutPrincipal>
  )
}

export default ForgetPass