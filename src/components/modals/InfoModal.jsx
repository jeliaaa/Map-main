import React, { useState } from 'react'
import euFlag from "../../assets/eu.jpg"
import partner2 from "../../assets/partners/BILC.jpg"
import partner5 from "../../assets/partners/eprc.jpg"
import partner1 from "../../assets/partners/EUforGeorgia.jpg"
import partner6 from "../../assets/partners/IJH.jpg"
import partner3 from "../../assets/partners/KAS.jpg"
import partner4 from "../../assets/partners/SSFund.jpeg"


import { X } from 'lucide-react'
const InfoModal = () => {
    const [isOpen, setIsOpen] = useState(false)
    const partners = [
        partner1,
        partner2,
        partner3,
        partner4,
        partner5,
        partner6
    ]
    return (
        <>
            <div onClick={() => setIsOpen(true)} className='w-20 hover:-translate-y-2 transition-all delay-300 cursor-pointer aspect-square rounded-full bg-white absolute right-5 bottom-5 md:right-10 md:bottom-10'>
                <img className='w-full h-full rounded-full' src={euFlag} />
            </div>
            {isOpen &&
                <div className='w-dvw absolute flex items-center justify-center left-0 top-0 h-dvh'>
                    <div onClick={() => setIsOpen(false)} className='bg-black/30 z-50 w-dvw h-dvh absolute'></div>
                    <div className='z-51 w-3/4 h-3/4 bg-white rounded-4xl flex flex-col'>
                        <div className='w-full bg-indigo-600 rounded-t-4xl border-white border-b-2 py-7 px-5 flex justify-between items-center'>
                            <span className='text-2xl text-white font-bold'></span>
                            <X className='hover:rotate-90 hover:font-bold transition-all delay-200 text-white cursor-pointer' onClick={() => setIsOpen(false)} />
                        </div>
                        <div id='info-cont' className='w-full overflow-y-auto p-5 flex flex-col gap-y-5'>
                            <div>
                                <div className='w-full flex flex-wrap gap-5 items-center'>
                                    <img src={partner1} className='h-15' />
                                    <img src={partner2} className='h-25' />
                                    <img src={partner3} className='h-25' />

                                </div>
                                <p className='mt-5'>
                                    აჭარის რეგიონში ევროკავშირის პროექტების შესახებ საინფორმაციო რუკა. პროექტი “ერთიანი საქართველო ევროპისთვის” მხარდაჭერილია ევროკავშირის მიერ, მას ახორციელებს კონსორციუმი კონრად ადენაუერის ფონდის (KAS) ხელმძღვანელობით, რომელშიც შედიან ეკონომიკური პოლიტიკის კვლევის ცენტრი (EPRC) სამოქალაქო საზოგადოების ფონდი (CSF) და თავისუფალ ჟურნალისტთა სახლი (IJH). პროექტის მიზანია ევროკავშირის შესახებ ცნობიერების ამაღლება.
                                </p>
                            </div>
                            <div>
                                <h1 className='text-2xl'>დისქლეიმერი</h1>
                                <div className='flex flex-wrap items-center gap-4 mt-5'>
                                    {partners.slice(3,partners.length).map((p, i) => (
                                        <img className="h-25" key={i} src={p} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
        </>
    )
}

export default InfoModal