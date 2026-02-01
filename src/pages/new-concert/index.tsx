import { useNewConcertFlow } from "@/presentation/hooks/newConcert/useNewConcertFlow";
import { Layout } from "@/presentation/pages/newConcert/layout/Layout";
import { STEP_COMPONENT } from "@/presentation/ui-model/newConcert/newConcertFlow";

export default function NewConcertPage() {
  const { step, goToInitial, goToOrganize } = useNewConcertFlow();
  const StepComponent = STEP_COMPONENT[step];

  return (
    <Layout step={step}>
      <StepComponent onContinue={goToOrganize} onBack={goToInitial} />
    </Layout>
  );
}
