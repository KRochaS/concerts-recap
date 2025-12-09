import { JSX } from "react";
import { Satisfy, Work_Sans } from "next/font/google";
import Image from 'next/image'
import { Header } from "@/presentation/shared/header";

const workSansDisplay = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});


const satisfyDisplay = Satisfy({
  subsets: ["latin"],
  weight: ["400"],
});

export default function Home() {

  const oi = () => {
  }

  function handleSubmit() {
    
  }
  return (
    <div
       className={`${workSansDisplay.className}  ${satisfyDisplay.className} bg-background-primary text-content-body antialiased bg-[radial-gradient(circle_at_48%_54%,#010a2d,transparent)] h-screen`}
    >
      <div className="bg-[url(/assets/bg-stars.svg)] h-screen" >
        {/* <Image src="/assets/bg-stars.svg" alt="sdsd" width={30} height={30}/> */}
         <Header />
      </div>
    </div>
  );
}
