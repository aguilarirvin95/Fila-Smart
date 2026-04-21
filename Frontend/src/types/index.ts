export type PatientStatus = 'waiting' | 'in-consultation' | 'done' | 'cancelled';

export type DashboardSection = 'inicio' | 'cola' | 'perfil' | 'configuracion';

export interface Patient {
  id: string;
  clinicId: string;
  name: string;
  phone: string;
  ticketCode: string;
  registeredAt: Date;
  calledAt?: Date;
  finishedAt?: Date;
  status: PatientStatus;
}

export interface Clinic {
  id: string;
  slug: string;
  name: string;
  address: string;
  phone: string;
  specialty: string;
  encargadoCola: string;
}
