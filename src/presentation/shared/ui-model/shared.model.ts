import { IconBaseProps } from 'react-icons';

export interface BatteryIcons {
  [key: number]: React.ComponentType<IconBaseProps>;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outlined';
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  label?: string;
  labelPosition?: 'top' | 'side';
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id?: string;
  label?: string;
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
}

export interface FieldErrorProps {
  message?: string;
  className?: string;
}

export interface CardProps {
  title?: string;
  date?: string;
  src: string;
  local?: string;
  description?: string;
  cidade?: string;
  seeRecap?: boolean;
}

export interface Option {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label?: string;
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
  options: Option[];
}

export interface OverallRatingProps {
  id: string;
  label?: string;
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
}

export interface BatteryProps extends IconBaseProps {
  id?: string;
  label?: string;
}
