import { NewConcertStepEnum } from "@/presentation/ui-model/newConcert/newConcertFlow";
import { useState } from "react";

export function useNewConcertFlow() {
  const [step, setStep] = useState<NewConcertStepEnum>(NewConcertStepEnum.INITIAL);

  const goToInitial = () => setStep(NewConcertStepEnum.INITIAL);
  const goToOrganize = () => setStep(NewConcertStepEnum.ORGANIZE);

  return {
    step,
    goToInitial,
    goToOrganize,
  };
}
