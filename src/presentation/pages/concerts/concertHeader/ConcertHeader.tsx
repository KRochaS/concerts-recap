import { Button } from '@/presentation/shared/components/button/Button';
import Link from 'next/link';
import React from 'react';

export function ConcertHeader() {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          Concert Memories
        </h1>
        <p className="text-sm md:text-base text-zinc-400 mt-1">
          Your collection of unforgettable live music experiences
        </p>
      </div>
      <Link href="/new-concert">
        <Button> Add Memory</Button>
      </Link>
    </div>
  );
}
