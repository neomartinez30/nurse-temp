// filepath: src/store/slices/types.ts

export interface CallState {
    isCallActive: boolean;
    callerId: string | null;
    stateOfCall : string | null;
    interactionID: string | null; 
}

export interface CallAction {
    type: string;
    payload: CallState;
}

export interface CallerDataTable {
    PhoneNumber: string | null;
    Name: string | null;
    AccountNumber: string | null;
    DOD_ID: string | null;
    FamilyMembers: any[];
    TickerNumber: string | null;
    TicketStatus: string | null;
    TicketOwner: string | null;
    TicketCreatedAt: string | null;
}
