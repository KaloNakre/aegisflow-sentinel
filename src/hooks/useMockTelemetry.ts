'use client';

import { useState, useEffect } from 'react';

import { AlertData } from '@/components/dashboard/AlertCenter';

export interface TelemetryData {
  overallRisk: number;
  securityScore: number;
  risks: {
    security: { value: number; trend: 'up' | 'down' | 'stable' };
    sop: { value: number; trend: 'up' | 'down' | 'stable' };
    model: { value: number; trend: 'up' | 'down' | 'stable' };
    data: { value: number; trend: 'up' | 'down' | 'stable' };
    runtime: { value: number; trend: 'up' | 'down' | 'stable' };
    network: { value: number; trend: 'up' | 'down' | 'stable' };
    agent: { value: number; trend: 'up' | 'down' | 'stable' };
    cost: { value: number; trend: 'up' | 'down' | 'stable' };
  };
  alerts: AlertData[];
  timeline: { id: string; time: string; message: string; status: 'passed' | 'warning' | 'critical' | 'info' }[];
}

const generateRandomFluctuation = (value: number, maxChange: number, min = 0, max = 100) => {
  const change = (Math.random() * maxChange * 2) - maxChange;
  return Math.min(max, Math.max(min, Math.round(value + change)));
};

const determineTrend = (oldValue: number, newValue: number): 'up' | 'down' | 'stable' => {
  if (newValue > oldValue) return 'up';
  if (newValue < oldValue) return 'down';
  return 'stable';
};

const initialData: TelemetryData = {
  overallRisk: 35,
  securityScore: 85,
  risks: {
    security: { value: 12, trend: 'down' },
    sop: { value: 45, trend: 'up' },
    model: { value: 5, trend: 'stable' },
    data: { value: 2, trend: 'down' },
    runtime: { value: 8, trend: 'stable' },
    network: { value: 15, trend: 'stable' },
    agent: { value: 22, trend: 'down' },
    cost: { value: 65, trend: 'up' },
  },
  alerts: [
    { id: '1', timestamp: '13:42:01', severity: 'CRITICAL', message: 'PII detected in prompt sent to public model', source: 'SOP Engine' },
    { id: '2', timestamp: '13:40:15', severity: 'HIGH', message: 'Unusual token volume spike detected', source: 'Cost Monitor' },
  ],
  timeline: [
    { id: 't1', time: '13:42', message: 'Critical SOP violation', status: 'critical' },
    { id: 't2', time: '13:41', message: 'Unusual token usage', status: 'warning' },
    { id: 't3', time: '13:40', message: 'Unapproved model detected', status: 'warning' },
    { id: 't4', time: '13:39', message: 'Network anomaly', status: 'warning' },
    { id: 't5', time: '13:38', message: 'SOP verification passed', status: 'passed' },
  ]
};

export function useMockTelemetry(updateIntervalMs: number = 3000) {
  const [data, setData] = useState<TelemetryData>(initialData);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newOverallRisk = generateRandomFluctuation(prev.overallRisk, 5);
        const newSecurityScore = generateRandomFluctuation(prev.securityScore, 3);
        
        return {
          overallRisk: newOverallRisk,
          securityScore: newSecurityScore,
          risks: {
            security: {
              value: generateRandomFluctuation(prev.risks.security.value, 4),
              trend: determineTrend(prev.risks.security.value, generateRandomFluctuation(prev.risks.security.value, 4))
            },
            sop: {
              value: generateRandomFluctuation(prev.risks.sop.value, 6),
              trend: determineTrend(prev.risks.sop.value, generateRandomFluctuation(prev.risks.sop.value, 6))
            },
            model: {
              value: generateRandomFluctuation(prev.risks.model.value, 2),
              trend: determineTrend(prev.risks.model.value, generateRandomFluctuation(prev.risks.model.value, 2))
            },
            data: {
              value: generateRandomFluctuation(prev.risks.data.value, 1),
              trend: determineTrend(prev.risks.data.value, generateRandomFluctuation(prev.risks.data.value, 1))
            },
            runtime: {
              value: generateRandomFluctuation(prev.risks.runtime.value, 3),
              trend: determineTrend(prev.risks.runtime.value, generateRandomFluctuation(prev.risks.runtime.value, 3))
            },
            network: {
              value: generateRandomFluctuation(prev.risks.network.value, 4),
              trend: determineTrend(prev.risks.network.value, generateRandomFluctuation(prev.risks.network.value, 4))
            },
            agent: {
              value: generateRandomFluctuation(prev.risks.agent.value, 3),
              trend: determineTrend(prev.risks.agent.value, generateRandomFluctuation(prev.risks.agent.value, 3))
            },
            cost: {
              value: generateRandomFluctuation(prev.risks.cost.value, 5),
              trend: determineTrend(prev.risks.cost.value, generateRandomFluctuation(prev.risks.cost.value, 5))
            },
          },
          alerts: prev.alerts,
          timeline: prev.timeline
        };
      });
    }, updateIntervalMs);

    return () => clearInterval(interval);
  }, [updateIntervalMs]);

  return data;
}
