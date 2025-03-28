// filepath: src/store/slices/callSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CallerDataTable } from './types';

const initialState: CallerDataTable = {
    PhoneNumber: null,
    Name: null,
    AccountNumber: null,
    DOD_ID: null,
    FamilyMembers: [],
    TickerNumber: null,
    TicketStatus: null,
    TicketOwner: null,
    TicketCreatedAt: null,
};

const databaseSlice = createSlice({
    name: 'database',
    initialState,
    reducers: {
        updateCallerDataTable(state, action) {
            return {...state, ...action.payload};
        },
    },
});

// const databaseSlice = createSlice({
//     name: 'database',
//     initialState: {
//         // Initial state structure that matches your callerData
//         PhoneNumber: '',
//         Name: '',
//         AccountNumber: '',
//         DOD_ID: '',
//         FamilyMembers: [],
//         TicketNumber: '',
//         TicketStatus: '',
//         TicketOwner: '',
//         TicketCreatedAt: '',
//       },
//     reducers: {
//         updateCallerDataTable(state, action) {
//             return {...state, ...action.payload};
//         },
//     },
// });

export const { updateCallerDataTable } = databaseSlice.actions;
export default databaseSlice.reducer;