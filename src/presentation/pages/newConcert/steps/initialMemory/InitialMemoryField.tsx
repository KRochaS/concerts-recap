import { ReactNode } from 'react';

import { FieldError } from '@/presentation/shared/components/fieldError/FieldError';

type InitialMemoryFieldProps = {
  children: ReactNode;
  errorMessage?: string;
  className?: string;
};

export const InitialMemoryField = ({
  children,
  errorMessage,
  className,
}: InitialMemoryFieldProps) => {
  return (
    <div className={className ? `flex flex-col ${className}` : 'flex flex-col'}>
      {children}
      <FieldError message={errorMessage} />
    </div>
  );
};
