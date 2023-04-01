
import { useState } from "react";

import { InputText } from "primereact/inputtext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faFacebookF, faPinterestP, faYoutube, faInstagram } from "@fortawesome/free-brands-svg-icons"
import Link from "next/link";

export default function FooterProComponent() {

    const [email, setEmail] = useState<string>('')
    const [zip, setZip] = useState<string>('')

    const submit = () => {
        console.log('enviando datos...');
    }

    return(
        <footer className="w-full pt-10 pb-20 px-5 lg:px-40 bg-gray-200">
            <div className="grid grid-cols-3 lg:grid-cols-5 gap-5 lg:gap-10">
                <div className="col-span-1 w-full flex flex-col text-xs lg:text-base items-start gap-3">
                    <p className="font-medium">Business Center</p>
                    <Link href={'/pro'} className='hover:underline'>Profiles</Link>
                    <Link href={'/pro'} className='hover:underline'>Manage My Account</Link>
                    <Link href={'/pro'} className='hover:underline'>Contact Preferences</Link>
                    <Link href={'/pro'} className='hover:underline'>Add a Business</Link>
                </div>
                <div className="col-span-1 w-full flex flex-col text-xs lg:text-base items-start gap-3">
                    <p className="font-medium">About Us</p>
                    <Link href={'/'} className='hover:underline'>Boatmate.com</Link>
                    <Link href={'/pro'} className='hover:underline'>Online Offers</Link>
                    <Link href={'/pro'} className='hover:underline'>Expert Content</Link>
                </div>
                <div className="col-span-1 w-full flex flex-col text-xs lg:text-base items-start gap-3">
                    <p className="font-medium">Questions</p>
                    <Link href={'/pro'} className='hover:underline'>Contact Us</Link>
                    <Link href={'/pro'} className='hover:underline'>Press Center</Link>
                    <Link href={'/pro'} className='hover:underline'>Investor Relations</Link>
                </div>
                <div className="col-span-3 lg:col-span-2 mx-20 text-xs lg:text-base font-medium">
                    <div className="w-full flex flex-row justify-between">
                        <Link href={'/pro'} className='flex justify-center items-center p-2 rounded-full' ><FontAwesomeIcon className="text-[#373A85] text-xl lg:text-[30px]" icon={faTwitter} /></Link>
                        <Link href={'/pro'} className='flex justify-center items-center p-2 rounded-full' ><FontAwesomeIcon className="text-[#373A85] text-xl lg:text-[30px]" icon={faFacebookF} /></Link>
                        <Link href={'/pro'} className='flex justify-center items-center p-2 rounded-full' ><FontAwesomeIcon className="text-[#373A85] text-xl lg:text-[30px]" icon={faPinterestP} /></Link>
                        <Link href={'/pro'} className='flex justify-center items-center p-2 rounded-full' ><FontAwesomeIcon className="text-[#373A85] text-xl lg:text-[30px]" icon={faYoutube} /></Link>
                        <Link href={'/pro'} className='flex justify-center items-center p-2 rounded-full' ><FontAwesomeIcon className="text-[#373A85] text-xl lg:text-[30px]" icon={faInstagram} /></Link>
                    </div>
                    <p>Connect with us</p>
                    <p className="mt-1 text-base lg:text-2xl">1-888-819-2644</p>
                    <p className="mt-1 text-xs lg:text-sm font-light">Nationwide TDD/TTY: <span className="font-medium">Call 711</span></p>
                    <p className="mt-3 leading-none">Give us a call.</p>
                    <p>We&apos;re standing by.</p>
                    <p className="mt-2 text-xs lg:text-sm">BoatMate Call Center</p>
                    <p className="mt-2 text-xs lg:text-sm font-light">M-F: 8:00am - 8:00pm EST</p>
                </div>
                <p className="col-span-3 text-xs text-center lg:text-left lg:text-sm tracking-wide">© Copyright 1995-2023, Angi. All Rights Reserved. | <Link href={'/pro'} className="font-bold">Terms of Use</Link> | <Link href={'/pro'} className="font-bold">Privacy Policy</Link> | <Link href={'/pro'} className="font-bold">Service Provider Agreement</Link> | <Link href={'/pro'} className="font-bold">California Privacy </Link>| Accessibility Tools</p>
                <div className="col-span-2 mx-20 font-medium hidden lg:block">
                    <p>Drop us a line</p>
                    <p className="mt-2 text-sm font-normal"><Link href={'/pro'} className="font-medium" >Email us </Link>and we&apos;ll reply as quickly as possible.</p>
                </div>
            </div>
        </footer>
    )
};
