import type { Clinic, Patient } from '../types';

export const MINUTES_PER_PATIENT = 12;
export const INITIAL_TICKET_COUNTER = 7;

export const mockClinics: Clinic[] = [
  {
    id: 'clinic-1',
    slug: 'san-rafael',
    name: 'Clínica San Rafael',
    address: '5ª Av. Norte #23, Santa Ana',
    phone: '+503 2441-0023',
    specialty: 'Medicina General',
    encargadoCola: 'Licda. Carmen Portillo',
  },
  {
    id: 'clinic-2',
    slug: 'santa-elena',
    name: 'Centro Médico Santa Elena',
    address: 'Blvd. Los Próceres #45, San Salvador',
    phone: '+503 2278-1156',
    specialty: 'Medicina Familiar',
    encargadoCola: 'Lic. Roberto Menjívar',
  },
  {
    id: 'clinic-3',
    slug: 'los-heroes',
    name: 'Clínica Familiar Los Héroes',
    address: 'C. Los Héroes #7, Soyapango',
    phone: '+503 2277-3344',
    specialty: 'Medicina General y Pediatría',
    encargadoCola: 'Licda. Ana Dubón',
  },
];

const now = new Date();
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60_000);

export const initialMockPatients: Patient[] = [
  {
    id: 'p-001',
    clinicId: 'clinic-1',
    name: 'María José Hernández',
    phone: '+503 7823-4512',
    ticketCode: '#A-001',
    registeredAt: minutesAgo(52),
    status: 'waiting',
  },
  {
    id: 'p-002',
    clinicId: 'clinic-1',
    name: 'Carlos Ernesto Rivas',
    phone: '+503 7654-3210',
    ticketCode: '#A-002',
    registeredAt: minutesAgo(41),
    status: 'waiting',
  },
  {
    id: 'p-003',
    clinicId: 'clinic-1',
    name: 'Ana Patricia López',
    phone: '+503 7901-2345',
    ticketCode: '#A-003',
    registeredAt: minutesAgo(33),
    status: 'waiting',
  },
  {
    id: 'p-004',
    clinicId: 'clinic-1',
    name: 'José David Martínez',
    phone: '+503 7412-8765',
    ticketCode: '#A-004',
    registeredAt: minutesAgo(24),
    status: 'waiting',
  },
  {
    id: 'p-005',
    clinicId: 'clinic-1',
    name: 'Sofía Alejandra Gutiérrez',
    phone: '+503 7543-6789',
    ticketCode: '#A-005',
    registeredAt: minutesAgo(17),
    status: 'waiting',
  },
  {
    id: 'p-006',
    clinicId: 'clinic-1',
    name: 'Luis Armando Pérez',
    phone: '+503 7234-5678',
    ticketCode: '#A-006',
    registeredAt: minutesAgo(9),
    status: 'waiting',
  },
  {
    id: 'p-007',
    clinicId: 'clinic-1',
    name: 'Diana Beatriz Flores',
    phone: '+503 7890-1234',
    ticketCode: '#A-007',
    registeredAt: minutesAgo(3),
    status: 'waiting',
  },
];
