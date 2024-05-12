import clsx from 'clsx';
import { HTMLProps, forwardRef } from 'react';

export default forwardRef<HTMLInputElement, HTMLProps<HTMLInputElement>>(
  function TextInput({ className, ...rest }, ref) {
    return (
      <input
        ref={ref}
        className={clsx(
          className,
          'p-1.5 px-2 border border-gray-350 rounded w-full'
        )}
        {...rest}
      />
    );
  }
);
