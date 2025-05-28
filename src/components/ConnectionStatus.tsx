import { useEffect, useState } from 'react';

export const ConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${
        isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        <span className={`w-2 h-2 rounded-full mr-2 ${
          isOnline ? 'bg-green-500' : 'bg-red-500'
        }`}></span>
        {isOnline ? 'Online' : 'Offline'}
      </div>
    </div>
  );
};