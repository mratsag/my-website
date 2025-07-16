// components/ui/InputWithIcon.tsx
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import { InputHTMLAttributes, ReactNode, forwardRef } from 'react'

interface InputWithIconProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: LucideIcon
  rightIcon?: ReactNode
}

export const InputWithIcon = forwardRef<HTMLInputElement, InputWithIconProps>(
  ({ className, label, error, helperText, leftIcon: LeftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {LeftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LeftIcon className="h-5 w-5 text-gray-400" />
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'block w-full py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm',
              LeftIcon ? 'pl-10' : 'pl-3',
              rightIcon ? 'pr-12' : 'pr-3',
              error && 'border-red-300 focus:ring-red-500 focus:border-red-500',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600 mt-1">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-gray-500 mt-1">{helperText}</p>
        )}
      </div>
    )
  }
)

InputWithIcon.displayName = 'InputWithIcon'