'use client';

import Navigation from '../../components/Navigation'
export default function AdminLayout({ children }: { children: React.ReactNode }) {

 
  return (
    <div className="flex flex-col min-h-screen">
     <div className='absolute z-30 h-0 '> <Navigation /> </div>
      <main className="flex-grow md:pl-54 pt-[4.6rem] bg-[#f6f5ff]">
        {children}
      </main>
    </div>
  );
}