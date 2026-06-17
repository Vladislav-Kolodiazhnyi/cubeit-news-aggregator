import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import Footer from './components/Footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col relative bg-bg text-fg transition-colors duration-300">
      <Navbar />
      <main className="grow w-full">
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
}