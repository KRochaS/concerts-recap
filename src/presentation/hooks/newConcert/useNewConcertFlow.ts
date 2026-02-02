import { NewConcertStepEnum } from "@/presentation/ui-model/newConcert/newConcertFlow";
import { useState, useCallback } from "react";

export function useNewConcertFlow() {
  const [step, setStep] = useState<NewConcertStepEnum>(NewConcertStepEnum.INITIAL);

  const goToInitial = useCallback(() => {
    setStep(NewConcertStepEnum.INITIAL);
  }, []);

  const goToOrganize = useCallback(() => {
    setStep(NewConcertStepEnum.ORGANIZE);
  }, []);

  return {
    step,
    goToInitial,
    goToOrganize,
  };
}
