import { JSX } from "react";


export const Header = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="absolute top-0 max-w-7xl auto flex items-center justify-between py-10 w-full">
        <div className="text-3xl work-sans">
          Concert <span className="-ml-[5px] satisfy-font">recap </span>{" "}
        </div>

        {true && (
          <div className="flex gap-2">
            <a href="#" className="hover:text-gray-50 hover:underline">
              {" "}
              my page
            </a>
            <a href="#" className="hover:text-gray-50 hover:underline">
              {" "}
                logout
              </a>
          </div>
        )}
      </div>
    </div>
  );
}
