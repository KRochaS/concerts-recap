import { Badge } from '@/presentation/shared/components/badge/Badge';
import { Battery } from '@/presentation/shared/components/battery/Battery';
import { Button } from '@/presentation/shared/components/button/Button';
import { DatePicker } from '@/presentation/shared/components/datepicker/Datepicker';
import { Input } from '@/presentation/shared/components/input/Input';
import { OverallRating } from '@/presentation/shared/components/overallRating/OverallRating';
import { Select } from '@/presentation/shared/components/select/Select';

import Stars from '@/presentation/shared/components/stars/Stars';
import { Textarea } from '@/presentation/shared/components/textarea/Textarea';
import TicketUpload from '@/presentation/shared/components/ticketUpload/TicketUpload';
import { NewConcertStepProps } from '@/presentation/ui-model/newConcert/newConcertFlow';

import {
  Armchair,
  ArrowLeft,
  Eye,
  Footprints,
  Frown,
  Handshake,
  Mic2,
  PartyPopper,
  RotateCw,
  ShoppingBag,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const OrganizeMemory = ({ onBack }: NewConcertStepProps) => {
  const [date, setDate] = useState<Date>();
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const badges = [
    { id: 1, name: 'I cried', icon: Frown, color: '#f87171' },
    { id: 2, name: 'Moshpit', icon: Users, color: '#fb923c' },
    { id: 3, name: 'Circle pit', icon: RotateCw, color: '#facc15' },
    { id: 4, name: 'Wall of death', icon: Footprints, color: '#ef4444' },
    { id: 5, name: 'Great view', icon: Eye, color: '#4ade80' },
    { id: 6, name: 'Fun people', icon: PartyPopper, color: '#60a5fa' },
    { id: 7, name: 'Bought merch', icon: ShoppingBag, color: '#c084fc' },
    { id: 8, name: 'Lost voice', icon: Mic2, color: '#2dd4bf' },
    { id: 9, name: 'Met artist', icon: Handshake, color: '#f472b6' },
    { id: 10, name: 'Seating ticket', icon: Armchair, color: '#818cf8' },
    { id: 11, name: 'Electric crowd', icon: Zap, color: '#f97316' },
    { id: 12, name: 'Chills', icon: Sparkles, color: '#a855f7' },
  ];

  const options = [
    { value: '5', label: '5 - Amazing' },
    { value: '4', label: '4 - Good' },
    { value: '3', label: '3 - OK' },
    { value: '2', label: '2 - Bad' },
    { value: '1', label: '1 - Horror' },
  ];

  const handleToggle = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSave = () => router.push('/concerts');

  return (
    <div className="mx-auto max-w-331.25 px-4">
      <form className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-12">
        <section className="flex flex-col gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <DatePicker label="DATE" value={date} onChange={setDate} />
            <Input label="ARTIST" placeholder="e.g., The Midnight" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input label="TOUR" placeholder="e.g., Monsters Tour" />
            <Input label="VENUE" placeholder="e.g., The O2" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input label="CITY" placeholder="e.g., London" />
            <Input label="SUPPORT" placeholder="e.g., Nightly" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input label="A SONG I MISSED" />
            <Input label="BEST LIVE SONG" />
          </div>

          <Textarea label="OTHER THOUGHTS" className="min-h-30" />
          <TicketUpload />
        </section>

        <section className="flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <label className="text-[11px] font-bold text-zinc-500 tracking-[0.2em] uppercase">
              Experience Tags
            </label>

            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              {badges.map((item) => (
                <Badge
                  key={item.id}
                  label={item.name}
                  icon={item.icon}
                  color={item.color}
                  isSelected={selectedIds.includes(item.id)}
                  onClick={() => handleToggle(item.id)}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-12">
            <p className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase">
              Ratings
            </p>

            <div className="flex flex-col xl:flex-row xl:gap-12">
              <div className="flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Select
                    label="ENTRANCE"
                    defaultValue="6"
                    options={options}
                    id="entrance"
                  />
                  <Select
                    label="SUPPORT ACT"
                    defaultValue="5"
                    options={options}
                    id="support"
                  />
                  <Select
                    label="MAIN ACT"
                    defaultValue="6"
                    options={options}
                    id="main"
                  />
                  <Select
                    label="CROWD"
                    defaultValue="6"
                    options={options}
                    id="crowd"
                  />
                  <Select
                    label="STAGE SHOW"
                    defaultValue="6"
                    options={options}
                    id="stage"
                  />
                  <Select
                    label="MOOD OF ARTISTS"
                    defaultValue="3"
                    options={options}
                    id="mood"
                  />
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 w-35 mt-10">
                <p className="text-[10px] font-bold text-zinc-500 tracking-[0.15em] uppercase text-center">
                  Overall Rating
                </p>
                <OverallRating id="overall-rating" />
              </div>
            </div>

            <hr className="hidden lg:block border-zinc-800" />

            <div className="flex flex-col lg:flex-row lg:justify-between gap-12">
              <div className="flex flex-col gap-4">
                <p className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase">
                  SETLIST
                </p>
                <Stars size={32} />
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase">
                  Energy after the gig
                </p>
                <div className="flex items-center gap-4">
                  <Battery size={120} id="final-battery" />
                  <span className="text-[8px] font-bold text-zinc-400 tracking-widest">
                    EMOTIONALLY DESTROYED
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </form>
      <div className="pt-8 pb-8 flex gap-4 justify-between">
        <Button onClick={onBack}>
          <ArrowLeft /> back
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
};
