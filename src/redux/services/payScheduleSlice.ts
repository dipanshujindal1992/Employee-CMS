import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface PaySchedulePayload {
    workWeek: string[];
    salaryCalculationType: string;
    organizationWorkingDays?: number;
    payType: string;
    specificPayDay?: number;
    firstPayrollMonth: string;
    firstPayrollPayDate: string;
}

interface PayScheduleState {
    paySchedule: PaySchedulePayload | null;
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;
    successMessage: string | null;
}

const initialState: PayScheduleState = {
    paySchedule: null,
    isLoading: false,
    isSaving: false,
    error: null,
    successMessage: null,
};

const payScheduleSlice = createSlice({
    name: "paySchedule",
    initialState,
    reducers: {
        payScheduleGetRequest(state) {
            state.isLoading = true;
            state.error = null;
        },
        payScheduleGetSuccess(state, action: PayloadAction<any>) {
            state.isLoading = false;
            state.paySchedule = action.payload;
        },
        payScheduleGetFailure(state, action: PayloadAction<string>) {
            state.isLoading = false;
            state.error = action.payload;
        },

        payScheduleSetRequest(state, _action: PayloadAction<PaySchedulePayload>) {
            state.isSaving = true;
            state.error = null;
            state.successMessage = null;
        },
        payScheduleSetSuccess(state, action: PayloadAction<any>) {
            state.isSaving = false;
            state.successMessage = action.payload.message || "Saved successfully";
            if (action.payload.data) {
                state.paySchedule = action.payload.data;
            }
        },
        payScheduleSetFailure(state, action: PayloadAction<string>) {
            state.isSaving = false;
            state.error = action.payload;
        },

        payScheduleResetState(state) {
            state.error = null;
            state.successMessage = null;
        },
    },
});

export const {
    payScheduleGetRequest,
    payScheduleGetSuccess,
    payScheduleGetFailure,
    payScheduleSetRequest,
    payScheduleSetSuccess,
    payScheduleSetFailure,
    payScheduleResetState,
} = payScheduleSlice.actions;

export default payScheduleSlice.reducer;
