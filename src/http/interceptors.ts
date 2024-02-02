import axios from "axios";
import fingerprintjs from '@fingerprintjs/fingerprintjs';
const fpPromise = fingerprintjs.load();


export const loadFingerprint = async () => {
    const fp = await fpPromise;

    const result = await fp.get();
    return result.visitorId;
};

const $publicHost = axios.create({
    baseURL: process.env.REACT_APP_API_URL
})

const $authHost = axios.create({
    baseURL: process.env.REACT_APP_API_URL
})

$authHost.interceptors.request.use(
    (config) => {
        config.withCredentials = true;
        config.headers.Authorization = `Bearer ${localStorage.getItem("bTok") || ""}`;
        return config;
    }
);

$authHost.interceptors.response.use(
    async (response) => {
        try {
            if (response.data === "не авторизован") {

                const fingerprint = await loadFingerprint();

                const { data } = await $authHost.post<string>('user/auth', { fingerprint });

                if (data.split(' ')[0] === "ok") {
                    localStorage.clear();
                    localStorage.setItem("bTok", data.split(' ')[1]);
                } else {
                    localStorage.clear();
                }

                const originalRequestConfig = response.config;
                originalRequestConfig.headers.Authorization = `Bearer ${data.split(' ')[1] || ""}`;
                return axios(originalRequestConfig);
            }

            return response;
        } catch (error) {
            return Promise.reject(error);
        }
    }
);

export {
    $publicHost,
    $authHost
}