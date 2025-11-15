import axios from "../config/setAxios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";


let isRefreshing = false;

// 콜백들은 새로운 토큰을 전달받아 재요청을 트리거함
let refreshSubscribers: Array<(token: string | null) => void> = [];

// ✔ 토큰 재발급 완료 후 큐에 쌓여있던 요청들 실행
function onRefreshed(newToken: string | null) {
    refreshSubscribers.forEach(callback => callback(newToken));
    refreshSubscribers = [];
}

// ✔ 재발급이 끝날 때까지 요청을 큐에 등록
function addRefreshSubscriber(callback: (token: string | null) => void) {
    refreshSubscribers.push(callback);
}

/**
 * 자동 토큰 재발급 + 요청 재실행
 * @param config AxiosRequestConfig — 원래 요청 정보
 */
export async function autoRefreshCheck<T = any>(
    config: AxiosRequestConfig
): Promise<AxiosResponse<T> | undefined> {

    const token = localStorage.getItem("accessToken");

    if (!token) return;

    try {
        // ⭐ 원래 요청 먼저 실행
        const response = await axios({
            ...config,
            headers: {
                ...config.headers,
                Authorization: token,
            },
            withCredentials: true,
        });

        return response;

    } catch (error: any) {
        const status = error?.response?.status;
        const code = error?.response?.data?.code;

        // ⭐ Access Token 만료 → refresh 로 재발급
        if (status === 401 && code === "EXPIRED_ACCESS_TOKEN") {
            alert("refreshToken 재발급중...");

            return new Promise((resolve, reject) => {
                // refresh 끝날 때 재요청하도록 큐에 등록
                addRefreshSubscriber(async (newToken) => {
                    if (!newToken) {
                        reject(new Error("토큰 재발급 실패"));
                        return;
                    }

                    try {
                        const retryResponse = await axios({
                            ...config,
                            headers: {
                                ...config.headers,
                                Authorization: newToken,
                            },
                            withCredentials: true,
                        });

                        resolve(retryResponse);
                    } catch (retryError) {
                        reject(retryError);
                    }
                });

                // ⭐ 이미 refresh 요청 중이면 두 번째 refresh 요청을 막음
                if (!isRefreshing) {
                    isRefreshing = true;

                    axios
                        .post(
                            "/api/auth/refresh",
                            {},
                            { withCredentials: true }
                        )
                        .then((refreshRes) => {
                            const newToken = refreshRes.headers["authorization"];

                            if (!newToken) throw new Error("토큰 재발급 실패");

                            localStorage.setItem("accessToken", newToken);
                            onRefreshed(newToken); // 대기 중인 요청들 실행
                        })
                        .catch((refreshError) => {
                            localStorage.removeItem("accessToken");
                            alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
                            onRefreshed(null);
                            reject(refreshError);
                        })
                        .finally(() => {
                            isRefreshing = false;
                        });
                }
            });
        }

        // ⭐ 기타 인증 오류
        console.error(
            "인증 실패 또는 기타 에러:",
            error?.response?.data || error?.message
        );

        throw error;
    }
}
