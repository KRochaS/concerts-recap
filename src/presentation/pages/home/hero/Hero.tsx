import Link from "next/link";
import Image from "next/image";
import { Button } from "../../../shared/components/button/Button";
import Card from "../../../shared/components/card/Card";

export function Hero() {
  return (
    <main className="flex-1 grid place-items-center px-6 mt-20">
      <div className="max-w-[1325px]">
        <section className="grid grid-cols-1 gap-9 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold leading-tight tracking-tight text-white">
              Your concert recap,
              <br />
              thoughts, and memories
            </h1>

            <p className="text-lg text-gray-400 max-w-md">
              Fill out your concert memories page with the best moments
            </p>

            <Link href="/new-concert">
              <Button className="text-md"> REGISTER CONCERTS </Button>
            </Link>
          </div>

          <div className="flex flex-col gap-6 md:items-end">
            <Card
              src="/images/image-1.png"
              description="recap your concerts moments and share (if you like) with the world"
            />

            <div className="md:self-center">
              <Card
                src="/images/image-2.png"
                description="See how many people have checked out your memories"
              />
            </div>

            <Card
              src="/images/image-3.png"
              description="Record the distance you traveled, the songs that made you feel alive, and the song you missed"
            />
          </div>
        </section>
      </div>
    </main>
  );
}
