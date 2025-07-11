import React from 'react'
import Link from 'next/link'
const page = () => {
  return (
    <div>
      Hi , This is the Teacher List Page
      <p>Here you can manage the list of teachers.</p>
           <Link href="/">
              <button className="text-blue-500 mt-2 hover:underline">
                Go back to Main Page
              </button>
              </Link>
    </div>
  )
}

export default page
