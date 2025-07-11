import Image from 'next/image'
import React from 'react'

const AuthButton = () => {
  return (
    <>
      
 <div className="flex items-center text-black  border w-32 bg-white gap-2 rounded-full  border px-1 py-0.5">
              <div className="relative w-8 h-8  rounded-full overflow-hidden">
                <Image src="/John.svg" alt="User" fill className="object-cover" />
              </div>
              <div className="text-sm pr-4">
                <p className="font-medium">Alakh </p>
                <p className="text-xs ">Teacher</p>
              </div>
            </div>
      
    </>
  )
}

export default AuthButton