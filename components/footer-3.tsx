import { faFacebookF, faInstagram, faPinterestP, faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";


export default function FooterComponentThree() {
    return ( 
        <footer className="w-full p-5 lg:p-10 bg-gray-200">
            <div className="w-full">
                <div className="border-b-2 border-b-gray-400">
                    <div className="flex flex-col items-end">
                        <div className="mr-16 mb-10">
                            <p className="text-sm lg:text-base font-bold mb-5">We're here to help</p>
                            <p className="text-xs lg:text-sm mb-1 font-medium">Call 1-813-766-7565</p>
                            <p className="text-xs lg:text-sm mb-1 font-medium">support@boatmate.com</p>
                        </div>
                        <div className="mb-10 lg:mb-20 flex flex-row gap-3">
                            <Link href={'/pro/list'} ><FontAwesomeIcon className="text-[#373A85] text-xl lg:text-[25px]" icon={faTwitter} /></Link>
                            <Link href={'/pro/list'} ><FontAwesomeIcon className="text-[#373A85] text-xl lg:text-[25px]" icon={faFacebookF} /></Link>
                            <Link href={'/pro/list'} ><FontAwesomeIcon className="text-[#373A85] text-xl lg:text-[25px]" icon={faPinterestP} /></Link>
                            <Link href={'/pro/list'} ><FontAwesomeIcon className="text-[#373A85] text-xl lg:text-[25px]" icon={faYoutube} /></Link>
                            <Link href={'/pro/list'} ><FontAwesomeIcon className="text-[#373A85] text-xl lg:text-[25px]" icon={faInstagram} /></Link>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row lg:gap-20 lg:justify-between lg:items-center">
                    <div className="flex flex-row gap-3 items-center">
                        <p className="text-gray-600 font-medium text-sm lg:text-lg">BoatMate</p>
                        <p className="text-xs">© Copyright (813) 766-7565, BoatMate. All Rights Reserved.</p>
                    </div>
                    <div className="hidden lg:flex lg:flex-row gap-3 justify-between items-center">
                        <p className="text-xs">Terms of Use</p>
                        <p className="text-xs">Privacy Policy</p>
                        <p className="text-xs">Service Provider Agreement</p>
                        <p className="text-xs">California Privacy</p>
                        <p className="text-xs">Accessibility Tools</p>
                    </div>
                </div>
            </div>
        </footer>
     );
}