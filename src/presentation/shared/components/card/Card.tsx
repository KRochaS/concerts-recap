import Image from 'next/image';
import { cn } from '../../lib/utils';
import { CardProps } from '../../ui-model/shared.model';

export default function Card({
  title,
  description,
  date,
  local,
  src,
  cidade,
  seeRecap,
}: CardProps) {
  return (
    <div
      className={cn(
        'w-full max-w-sm bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex gap-4',
        seeRecap && 'hover:border-border-secondary cursor-pointer'
      )}
    >
      <div className="size-24 rounded-md overflow-hidden shrink-0 relative">
        <Image
          src={src}
          alt={description || title || 'Concert image'}
          fill
          sizes="96px"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-2">
        {title && (
          <span className="uppercase text-xs font-bold text-accent-green">
            {title}
          </span>
        )}
        <div className="flex flex-col">
          {date && <span className="text-white font-bold">{date}</span>}
          <span className="text-content-body text-sm">{description}</span>
          <span className="text-content-body text-sm">{local}</span>
          <span className="text-content-body text-sm">{cidade}</span>
        </div>
      </div>
    </div>
  );
}
