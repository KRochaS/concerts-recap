export const Header = () => {
  return (
    <header className="w-full">
      <div className="w-full max-w-screen-2xl mx-auto px-4 py-6 flex items-center justify-between relative">
        <div className="text-2xl md:text-3xl work-sans">
          Concert <span className="-ml-[5px] satisfy-font">recap</span>
        </div>
        <nav className="flex gap-3 md:gap-4 text-sm md:text-base">
          <a href="#" className="hover:text-gray-50 hover:underline">
            my page
          </a>
          <a href="#" className="hover:text-gray-50 hover:underline">
            logout
          </a>
        </nav>
        
      </div>
    </header>
  );
};
