import jwt_decode from "jwt-decode";
import {IAccessToken} from "../models/IAccessToken";
import {$authHost, $publicHost, loadFingerprint} from "./interceptors";
import {IGoogleAuth} from "./googleAuthAPI";
import {IUserProfile} from "../models/IUser";

export const registration = async (email: string, username: string, password: string, fingerprint: string ) => {
    const {data} = await $authHost.post("user/registration",
        {
            email,
            username,
            password,
            fingerprint
        })
    return data;
}

export const login = async (email: string, password: string, fingerprint: string ) => {
    const {data} = await $authHost.post("user/login",
        {
            email,
            password,
            fingerprint
        });
    return data;
}

export const fetchAuthGoogle = async (dataAuth: IGoogleAuth, fingerprint: string) => {
    try {
        const {data} = await $authHost.post("user/googleAuthUser", {
            ...dataAuth,
            fingerprint
        })

        return data;
    } catch (e) {
        console.log(e.message)
    }
}

export const formatDate = (userBirthdate: string) => {
    const dateFormat = new Date(userBirthdate)

    const months: string[] = [
        "січня", "лютого", "березня", "квітня", "травня", "червня",
        "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"
    ];

    const day: number = dateFormat.getDate();
    const monthIndex: number = dateFormat.getMonth();
    const year: number = dateFormat.getFullYear();

    const formattedDate: string = `${day} ${months[monthIndex]} ${year} року`;

    return formattedDate;
};
export const getUserProfile = async () => {
    try {
        const {data} = await $authHost.get<IUserProfile>("user/userProfile");
        return data;
    } catch (e) {
        console.log(e.message)
    }
}

export const updateUserProfile = async (newValues) => {
    try {
        const {data} = await $authHost.put<IUserProfile>("user/userProfile", {
            newValues
        });
        return data;
    } catch (e) {
        console.log(e.message)
    }
}

export const auth = async (fingerprint: string) => {
    const {data} = await $authHost.post("user/auth",
        {
            fingerprint
        }
    );

    if (data.split(' ')[0] === "ok") {
        localStorage.clear()
        localStorage.setItem("bTok", data.split(' ')[1]);
    } else {
        localStorage.clear();
    }

    return data
}

export const fetchEmailRecoveryPassword = async ( email: string ) => {
    try {
        const {data} = await $publicHost.post<string>(`user/passwordForgot`, {
            email
        });

        return data;
    } catch (e) {
        console.log({message: e.message})
    }
}

export const checkRecoveryLink = async ( link: string ) => {
    const {data} = await $publicHost.get<string>(`user/checkRecoveryLink/:${link}`);

    return data;
}

export const fetchRecoveryPassword = async ( link: string, password: string, fingerprint: string ) => {
    try {
        const {data} = await $authHost.post<string>(`user/recoveryPassword/:${link}`, {
            password,
            fingerprint
        });

        return data;
    } catch (e) {
        console.log({message: e.message})
    }
}

export const logout = async () => {
    const {data} = await $authHost.get<string>("user/logout")

    return data
}

export const getUsername = async () : IAccessToken | string => {
    const bTok = localStorage.getItem("bTok");

    if (bTok) {
        return jwt_decode(bTok);
    } else {
        const data = await auth( await loadFingerprint())

        if (data === "пользователь") {
            localStorage.clear();
            return {
                username: "пользователь"
            }
        } else if (data === 'failed') {
            localStorage.clear();
            return {
                username: "пользователь"
            }
        }

        const bTokResponse = localStorage.getItem("bTok")
        console.log(bTokResponse)
        return jwt_decode(bTokResponse);
    }

    // if (accessTokenCookie) {
    //     const accessToken = accessTokenCookie.split('=')[1];
    //
    //     return jwt_decode(accessToken);
    // } else {
    //     const data = await auth( await loadFingerprint())
    //
    //     if (data === "пользователь") {
    //         return {
    //             username: "пользователь"
    //         }
    //     } else if (data === 'failed') {
    //         return {
    //             username: "пользователь"
    //         }
    //     }
    //     const accessTokenCookie = document.cookie
    //         .split('; ')
    //         .find(row => row.startsWith('accessToken='));
    //     const accessToken = accessTokenCookie.split('=')[1];
    // console.log(accessToken)
    // console.log(document.cookie)
    //     return jwt_decode(accessToken);
    // }
};
