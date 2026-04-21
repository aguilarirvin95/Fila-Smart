import { create } from 'zustand';
import type { Clinic, Patient, DashboardSection } from '../types';
import { mockClinics, initialMockPatients, INITIAL_TICKET_COUNTER } from '../data/mockData';

interface QueueStore {
  // ── State ──────────────────────────────────────────────
  activeClinic: Clinic;
  queue: Patient[];             // contains 'waiting' and 'in-consultation'
  currentPatient: Patient | null; // the one in consultation
  history: Patient[];           // 'done' patients
  ticketCounter: number;
  activeSection: DashboardSection;
  sidebarOpen: boolean;

  // ── Actions ────────────────────────────────────────────
  setActiveClinic: (clinic: Clinic) => void;
  setActiveSection: (section: DashboardSection) => void;
  setSidebarOpen: (open: boolean) => void;

  /** Adds a patient to the end of the waiting queue and returns the new Patient */
  addPatient: (name: string, phone: string, clinicId: string) => Patient;

  /** Moves the first waiting patient to 'in-consultation' */
  callNext: () => void;

  /** Moves currentPatient to history with timestamps */
  finishConsultation: () => void;

  /** Removes a waiting patient from the queue (cancel) */
  cancelPatient: (id: string) => void;
}

export const useQueueStore = create<QueueStore>((set, get) => ({
  // ── Initial state ──────────────────────────────────────
  activeClinic: mockClinics[0],
  queue: initialMockPatients,
  currentPatient: null,
  history: [],
  ticketCounter: INITIAL_TICKET_COUNTER,
  activeSection: 'cola',
  sidebarOpen: false,

  // ── Setters ────────────────────────────────────────────
  setActiveClinic: (clinic) => set({ activeClinic: clinic }),
  setActiveSection: (section) => set({ activeSection: section }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // ── addPatient ─────────────────────────────────────────
  addPatient: (name, phone, clinicId) => {
    const { ticketCounter } = get();
    const newCounter = ticketCounter + 1;

    const newPatient: Patient = {
      id: `p-${Date.now()}`,
      clinicId,
      name,
      phone,
      ticketCode: `#A-${String(newCounter).padStart(3, '0')}`,
      registeredAt: new Date(),
      status: 'waiting',
    };

    set((state) => ({
      queue: [...state.queue, newPatient],
      ticketCounter: newCounter,
    }));

    return newPatient;
  },

  // ── callNext ───────────────────────────────────────────
  callNext: () => {
    const { queue, currentPatient } = get();
    if (currentPatient) return; // already someone in consultation

    const waiting = queue.filter((p) => p.status === 'waiting');
    if (waiting.length === 0) return;

    const next = waiting[0];
    const calledAt = new Date();
    const updated: Patient = { ...next, status: 'in-consultation', calledAt };

    set((state) => ({
      queue: state.queue.map((p) => (p.id === next.id ? updated : p)),
      currentPatient: updated,
    }));
  },

  // ── finishConsultation ─────────────────────────────────
  finishConsultation: () => {
    const { currentPatient } = get();
    if (!currentPatient) return;

    const finishedAt = new Date();
    const finished: Patient = { ...currentPatient, status: 'done', finishedAt };

    set((state) => ({
      // Remove finished patient from queue array and reassign positions
      queue: state.queue.filter((p) => p.id !== currentPatient.id),
      currentPatient: null,
      history: [finished, ...state.history],
    }));
  },

  // ── cancelPatient ──────────────────────────────────────
  cancelPatient: (id) => {
    set((state) => ({
      queue: state.queue.filter((p) => p.id !== id),
    }));
  },
}));
