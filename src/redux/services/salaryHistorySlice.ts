import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface SalaryHistoryItem {
    _id: string;
    payRunId?: string;
    employeeId?: string;
    month?: string;
    year?: string;
    netPay?: number;
    grosPay?: number;
    deduction?: number;
    [key: string]: unknown;
}

interface SalaryHistoryState {
    list: SalaryHistoryItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    isLoading: boolean;
    error: string | null;
}

const initialState: SalaryHistoryState = {
    list: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    isLoading: false,
    error: null,
};

const salaryHistorySlice = createSlice({
    name: "salaryHistory",
    initialState,
    reducers: {
        salaryHistoryListRequest: (state, _action: PayloadAction<{ employeeId: string; page?: number; limit?: number }>) => {
            state.isLoading = true;
            state.error = null;
        },
        salaryHistoryListSuccess: (
            state,
            action: PayloadAction<{ data: SalaryHistoryItem[]; total: number; page: number; limit: number; totalPages: number }>
        ) => {
            state.isLoading = false;
            state.list = action.payload.data;
            state.total = action.payload.total;
            state.page = action.payload.page;
            state.limit = action.payload.limit;
            state.totalPages = action.payload.totalPages;
        },
        salaryHistoryListFailure: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },
    },
});

export const { salaryHistoryListRequest, salaryHistoryListSuccess, salaryHistoryListFailure } =
    salaryHistorySlice.actions;

export default salaryHistorySlice.reducer;
