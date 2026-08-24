interface TimelineEvent {
  id: string;
  time: string;
  message: string;
  status: 'passed' | 'warning' | 'critical' | 'info';
}

interface IncidentTimelineProps {
  events: TimelineEvent[];
}

export function IncidentTimeline({ events }: IncidentTimelineProps) {
  return (
    <div className="relative pl-3 border-l-2 border-[var(--color-panel-border)] space-y-6">
      {events.map((event, index) => {
        let dotColor = 'bg-gray-400';
        if (event.status === 'passed') dotColor = 'bg-[var(--color-status-green)]';
        if (event.status === 'warning') dotColor = 'bg-[var(--color-status-yellow)]';
        if (event.status === 'critical') dotColor = 'bg-[var(--color-status-red)]';
        if (event.status === 'info') dotColor = 'bg-blue-400';

        return (
          <div key={event.id} className="relative">
            {/* Timeline Dot */}
            <div 
              className={`absolute -left-[1.1rem] top-1 w-3 h-3 rounded-full border-2 border-[var(--color-panel)] ${dotColor}`}
            />
            
            <div className="flex flex-col">
              <span className="text-xs font-mono text-gray-500 mb-1">{event.time}</span>
              <span className="text-sm text-gray-200">{event.message}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
