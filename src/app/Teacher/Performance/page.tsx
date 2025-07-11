import React from 'react'
import Link from 'next/link'

const Page = () => {
  return (
    <div>
      Hi , This is The Performance Page
        <p>Here you can view and manage your performance reviews.</p>
          <Link href="/">
              <button className="text-blue-500 mt-2 hover:underline">
                Go back to Main Page
              </button>
              </Link>
    </div>
  )
}

export default Page
