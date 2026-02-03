import {
  NewConcertStepEnum,
  STEP_DESCRIPTION,
} from '@/presentation/ui-model/newConcert/newConcertFlow';
import { ReactElement } from 'react';

type LayoutProps = {
  step: NewConcertStepEnum;
  children: React.ReactNode;
};

export function Layout({ step, children }: LayoutProps): ReactElement {
  const stepDescription = STEP_DESCRIPTION;

  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-10 pb-3">
      <div className="gap-20 flex flex-col">
        <header className="flex flex-col mx-auto max-w-[1325px]">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Log a New Concert Memory
            </h1>
            <p className="text-zinc-500 text-sm">{stepDescription[step]}</p>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
