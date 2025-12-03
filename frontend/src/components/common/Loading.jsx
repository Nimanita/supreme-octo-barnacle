// src/components/common/Loading.jsx
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/helpers';

export const Loading = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };
  
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className={cn('animate-spin text-primary-600', sizes[size])} />
      {text && <p className="mt-3 text-sm text-gray-600">{text}</p>}
    </div>
  );
};
