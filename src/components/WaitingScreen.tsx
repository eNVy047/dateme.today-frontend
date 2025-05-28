export const WaitingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-16 h-16 bg-blue-200 rounded-full mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Looking for a partner...</h2>
        <p className="text-gray-500 text-sm">Please wait while we connect you with someone</p>
      </div>
    </div>
  );
};