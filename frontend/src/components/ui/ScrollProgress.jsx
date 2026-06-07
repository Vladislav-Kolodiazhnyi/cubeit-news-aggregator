import { useState, useEffect } from 'react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      
      if (windowHeight <= 0) {
        setProgress(0);
        return;
      }
      
      setProgress(totalScroll / windowHeight);
    };

    window.addEventListener('scroll', handleScroll);
    
    handleScroll(); 
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className="absolute bottom-0 left-0 w-full h-[2px] origin-left bg-fg transition-transform duration-75 ease-out"
      style={{ transform: `scaleX(${progress})` }}
    />
  );
}