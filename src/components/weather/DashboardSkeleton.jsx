import { GlassCard } from '../ui/GlassCard';
import { Skeleton } from '../ui/Skeleton';

export const DashboardSkeleton = () => (
  <div className="space-y-6" aria-busy="true" aria-label="Loading weather">
    <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
      <GlassCard className="min-h-80 p-6">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-5 h-10 w-52" />
        <Skeleton className="mt-3 h-4 w-40" />
        <Skeleton className="mt-20 h-20 w-40" />
      </GlassCard>
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }, (_, index) => (
          <GlassCard className="p-4" key={index}>
            <Skeleton className="size-10 rounded-xl" />
            <Skeleton className="mt-6 h-6 w-20" />
            <Skeleton className="mt-2 h-3 w-24" />
          </GlassCard>
        ))}
      </div>
    </div>
    <GlassCard className="h-48 p-5">
      <Skeleton className="h-5 w-40" />
      <div className="mt-5 flex gap-3 overflow-hidden">
        {Array.from({ length: 7 }, (_, index) => (
          <Skeleton className="h-28 min-w-24 rounded-2xl" key={index} />
        ))}
      </div>
    </GlassCard>
  </div>
);
