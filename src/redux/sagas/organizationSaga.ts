import { call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import { AxiosError, type AxiosResponse } from "axios";
import api from "../../api/api";
import {
    ORGANIZATION_DETAIL_ADD_API,
    ORGANIZATION_GET_API,
} from "../../constant/api";
import { organizationAddDetailFailure, organizationAddDetailRequest, organizationAddDetailSuccess, organizationGetFailure, organizationGetRequest, organizationGetSuccess } from "../services/organizationSlice";


/* ===========================e
   RESPONSE TYPES
=========================== */

interface OrganizationApiResponse {
    message: string;
    success?: boolean;
}

interface OrganizationDetailApiResponse {
    message: string;
    success?: boolean;
    data: {
        id: string;
        organizationName: string;
        location: string;
        industry: string;
        dateFormat: string;
        fieldSeparator: string;
        address1: string;
        address2: string;
        state: string;
        city: string;
        country: string;
        pincode: string;
        isRun: boolean;
        logo?: string;
        createdAt?: string;
        updatedAt?: string;
    };
}

/* ===========================
   ADD ORGANIZATION
=========================== */

export function* handleOrganizationAdd(
    action: PayloadAction<FormData>,
): Generator {
    try {
        const response = (yield call(
            api.post,
            ORGANIZATION_DETAIL_ADD_API,
            action.payload,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            },
        )) as AxiosResponse<OrganizationApiResponse>;

        yield put(organizationAddDetailSuccess(response?.data));
    } catch (error: unknown) {
        const axiosError = error as AxiosError<{ message?: string }>;
        const message =
            axiosError.response?.data?.message || "Organization add failed";

        yield put(organizationAddDetailFailure(message));
    }
}

/* ===========================
   GET ORGANIZATION
=========================== */

export function* handleOrganizationGet(): Generator {
    try {
        const response = (yield call(
            api.get,
            ORGANIZATION_GET_API,
        )) as AxiosResponse<OrganizationDetailApiResponse>;

        yield put(organizationGetSuccess(response?.data));
    } catch (error: unknown) {
        const axiosError = error as AxiosError<{ message?: string }>;
        const message =
            axiosError.response?.data?.message ||
            "Organization fetch failed";

        yield put(organizationGetFailure(message));
    }
}

/* ===========================
   WATCHER
=========================== */

export default function* organizationSaga() {
    yield takeLatest(organizationAddDetailRequest.type, handleOrganizationAdd);
    yield takeLatest(organizationGetRequest.type, handleOrganizationGet);
}