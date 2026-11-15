import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AgentResult, RejectTriageRequest } from '../types/triage';
import { triageApi } from '../api/triageApi';

interface TriageContextType {
  triageResults: AgentResult[];
  addTriageResult: (result: AgentResult) => void;
  getTriageForTicket: (ticketId: number) => AgentResult | undefined;
  approveTriage: (id: number) => Promise<AgentResult>;
  rejectTriage: (id: number, request: RejectTriageRequest) => Promise<void>;
  isReviewingId: number | null;
}

const STORAGE_KEY = 'supportai_triage_results';

// Initial data seeded from existing SQLite database records
const INITIAL_TRIAGE_RESULTS: AgentResult[] = [
  {
    id: 5,
    ticketId: 3,
    category: 'Network/VPN',
    priority: 'Medium',
    suggestedResponse:
      'Hello, thank you for reaching out regarding your VPN connection issue. We understand that your VPN connection drops after 5 minutes of use. We are currently reviewing your request and will provide troubleshooting steps or escalate to network support shortly.',
    recommendedAction:
      'Escalate ticket to the network administration or IT support team for VPN stability troubleshooting.',
    status: 'Approved',
    createdAt: '2026-11-10T21:28:40.6236009Z',
  },
  {
    id: 4,
    ticketId: 2,
    category: 'Account Access',
    priority: 'High',
    suggestedResponse:
      'Hello, thank you for contacting support. We understand you are urgently needing access to your account after a password reset. Please confirm if you are using the correct email address and whether you received a confirmation message upon resetting your password. We are looking into your account status to help resolve this quickly.',
    recommendedAction:
      "Verify that the user's password reset was completed successfully and check if the account is locked or experiencing authentication service issues.",
    status: 'Pending Approval',
    createdAt: '2026-11-10T19:51:15.5002748Z',
  },
  {
    id: 3,
    ticketId: 2,
    category: 'Account Access',
    priority: 'High',
    suggestedResponse:
      'Hello, thank you for reaching out to support. We understand you are urgently unable to access your account despite a password reset. A support representative is reviewing your case and will assist you shortly in restoring access securely.',
    recommendedAction:
      'Verify user identity through standard security protocols and check system logs for authentication blocks or account lockout status.',
    status: 'Pending Approval',
    createdAt: '2026-11-05T15:47:50.9059793Z',
  },
];

const TriageContext = createContext<TriageContextType | undefined>(undefined);

export const TriageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [triageResults, setTriageResults] = useState<AgentResult[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore JSON parse errors
    }
    return INITIAL_TRIAGE_RESULTS;
  });

  const [isReviewingId, setIsReviewingId] = useState<number | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(triageResults));
    } catch {
      // LocalStorage may be unavailable
    }
  }, [triageResults]);

  const addTriageResult = (newResult: AgentResult) => {
    setTriageResults((prev) => {
      // Replace if existing with same ID or ticketId, or prepend
      const filtered = prev.filter((r) => r.id !== newResult.id);
      return [newResult, ...filtered];
    });
  };

  const getTriageForTicket = (ticketId: number) => {
    return triageResults.find((r) => r.ticketId === ticketId);
  };

  const approveTriage = async (id: number): Promise<AgentResult> => {
    setIsReviewingId(id);
    try {
      const updated = await triageApi.approveTriage(id);
      setTriageResults((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'Approved' } : r))
      );
      return updated;
    } finally {
      setIsReviewingId(null);
    }
  };

  const rejectTriage = async (id: number, request: RejectTriageRequest): Promise<void> => {
    setIsReviewingId(id);
    try {
      await triageApi.rejectTriage(id, request);
      setTriageResults((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'Rejected' } : r))
      );
    } finally {
      setIsReviewingId(null);
    }
  };

  return (
    <TriageContext.Provider
      value={{
        triageResults,
        addTriageResult,
        getTriageForTicket,
        approveTriage,
        rejectTriage,
        isReviewingId,
      }}
    >
      {children}
    </TriageContext.Provider>
  );
};

export function useTriage(): TriageContextType {
  const context = useContext(TriageContext);
  if (!context) {
    throw new Error('useTriage must be used within a TriageProvider');
  }
  return context;
}
