import React from 'react'

const Cart = ({data}) => {
    const {img , text1 , text2 , buttonIcon , buttonText} = data
  return (
    <div className="flex h-130 overflow-hidden flex-col gap-6 p-2 px-4  items-center ">
       <img src={img} loading="lazy"  className='rounded-4xl shadow-cyan-600 hover:shadow-md transition-all duration-300 shadow h-70  w-full lg:w-95 md:w-95 object-cover' />
       <p className='text-lg font-semibold  px-4 '>{text1}</p>
       <p className='text-lg font-semibold  px-4  '>{text2}</p>
        <button className="font-semibold text-lg p-3 shadow shadow-emerald-300 w-full rounded-lg hover:shadow-md transition-all duration-300"><i className={buttonIcon}></i> { buttonText }</button>
    </div>
  )
}

export default Cart
