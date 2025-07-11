
import Navigation from '../components/Navigation';
import Main from '../components/Main';

export default function Home() {
  return (
<>

<div className=''>
     <div className='fixed '> <Navigation /> </div>
     <div className=' md:pl-50 pt-[4rem] '> <Main /></div>
</div>

</>
  );
}
