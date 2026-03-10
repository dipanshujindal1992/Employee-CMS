import axios from "axios";
import { BASE_URL } from "../../constant/api";

interface Payload {
    api: string;
    name: string;
    method?: "get" | "post"; // optional, default = post
    [key: string]: unknown;
}

export const PdfDownloadCom = async (payload: Payload) => {
    try {
        const { api, name, method = "post", ...rest } = payload;

        const token = localStorage.getItem("token");

        const apiURL = `${BASE_URL}${api}`;

        let response;

        if (method.toLowerCase() === "get") {
            response = await axios.get(apiURL, {
                params: {
                    type: "pdfDownload",
                    ...rest,
                },
                responseType: "blob",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } else {
            // default POST
            response = await axios.post(
                apiURL,
                {
                    type: "pdfDownload",
                    ...rest,
                },
                {
                    responseType: "blob",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        }

        const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
        const a = document.createElement("a");
        a.href = url;
        a.download = `${name}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    } catch (error: unknown) {
        const err = error as { message?: string };
        alert(`Download failed: ${err?.message || "Unknown error"}`);
    }
};
