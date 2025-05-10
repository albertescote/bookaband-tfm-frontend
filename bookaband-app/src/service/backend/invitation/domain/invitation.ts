export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}

export interface Invitation {
  id: string;
  bandId: string;
  bandName: string;
  userId: string;
  status: InvitationStatus;
  createdAt: Date;
}
