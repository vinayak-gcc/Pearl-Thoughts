import React from 'react'
import Link from 'next/link'            

const Page = () => {
  return (
    <div>
      Hi , This is The Qualification Page
        <p>Here you can manage your qualifications and certifications.</p>
          <Link href="/">
              <button className="text-blue-500 mt-2 hover:underline">
                Go back to Main Page
              </button>
              </Link>
    </div>
  )
}

export default Page
