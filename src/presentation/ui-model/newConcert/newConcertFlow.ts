import { InitialMemory } from '@/presentation/pages/newConcert/steps/initialMemory/InitialMemory';
import { OrganizeMemory } from '@/presentation/pages/newConcert/steps/organizeMemory/OrganizeMemory';

export enum NewConcertStepEnum {
  INITIAL = 'INITIAL',
  ORGANIZE = 'ORGANIZE',
}

export type NewConcertStepProps = {
  onContinue?: () => void;
  onBack?: () => void;
};

export const STEP_COMPONENT: Record<
  NewConcertStepEnum,
  React.ComponentType<NewConcertStepProps>
> = {
  [NewConcertStepEnum.INITIAL]: InitialMemory,
  [NewConcertStepEnum.ORGANIZE]: OrganizeMemory,
};

export const STEP_DESCRIPTION: Record<NewConcertStepEnum, string> = {
  [NewConcertStepEnum.INITIAL]:
    "Capture the essence of the performance while it's still vivid.",
  [NewConcertStepEnum.ORGANIZE]:
    'Fill in the details below to save your experience.',
};
