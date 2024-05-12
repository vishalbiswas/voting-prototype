import clsx from 'clsx';
import { HTMLProps } from 'react';

type FormGroupProps = {
  error?: any;
} & HTMLProps<HTMLDivElement>;

export default function FormGroup({
  children,
  error,
  className,
  ...rest
}: FormGroupProps) {
  return (
    <div className={clsx('mb-6', className)} {...rest}>
      {children}
      {error && (
        <div className="relative text-sm">
          <div className="text-red-400 absolute top-0 w-full left-0">
            {error?.message || 'Invalid value'}
          </div>
        </div>
      )}
    </div>
  );
}
