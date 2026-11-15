import React from 'react';
import { AgentResult } from '../../types/triage';
import { Card, CardHeader, CardContent } from '../common/Card';
import { EmptyState } from '../common/EmptyState';
import { Sparkles } from 'lucide-react';
import { normalizePriority } from '../../utils/triageUtils';

interface PriorityOverviewProps {
  triageResults: AgentResult[];
}

export const PriorityOverview: React.FC<PriorityOverviewProps> = ({ triageResults }) => {
  // Calculate distribution from real triage data
  const counts = {
    Critical: 0,
    High: 0,
    Medium: 0,
    Low: 0,
  };

  triageResults.forEach((result) => {
    const priority = normalizePriority(result.priority);
    const match = (Object.keys(counts) as Array<keyof typeof counts>).find(
      (key) => normalizePriority(key) === priority
    );
    if (match) counts[match]++;
  });

  const total = triageResults.length;

  const priorities: Array<{
    name: 'Critical' | 'High' | 'Medium' | 'Low';
    count: number;
    color: string;
    barColor: string;
    textColor: string;
  }> = [
    {
      name: 'Critical',
      count: counts.Critical,
      color: 'bg-rose-50 border-rose-200',
      barColor: 'bg-rose-500',
      textColor: 'text-rose-700',
    },
    {
      name: 'High',
      count: counts.High,
      color: 'bg-amber-50 border-amber-200',
      barColor: 'bg-amber-500',
      textColor: 'text-amber-700',
    },
    {
      name: 'Medium',
      count: counts.Medium,
      color: 'bg-blue-50 border-blue-200',
      barColor: 'bg-blue-500',
      textColor: 'text-blue-700',
    },
    {
      name: 'Low',
      count: counts.Low,
      color: 'bg-emerald-50 border-emerald-200',
      barColor: 'bg-emerald-500',
      textColor: 'text-emerald-700',
    },
  ];

  return (
    <Card>
      <CardHeader
        title="Priority Distribution"
        subtitle="Breakdown of AI-classified ticket urgency"
      />
      <CardContent>
        {total === 0 ? (
          <EmptyState
            icon={<Sparkles className="h-6 w-6 text-slate-400" />}
            title="No Priority Data Yet"
            description="Run AI Triage on support tickets to analyze urgency and populate the priority distribution."
          />
        ) : (
          <div className="space-y-4">
            {priorities.map((item) => {
              const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
              return (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{item.name}</span>
                    <span className="text-slate-500">
                      <span className={`font-semibold ${item.textColor}`}>{item.count}</span>
                      <span className="ml-1 text-slate-400">({percentage}%)</span>
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${item.barColor}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Total Triaged Tickets</span>
              <span className="font-semibold text-slate-900">{total}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
