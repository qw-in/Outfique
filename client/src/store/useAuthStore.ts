// Purpose: To store the user data in the local storage.page reload krne pr user logout na ho isiliye store bna rhe hai

//Agar authentication ka state local component me store karenge, to user ka login state har page refresh par reset ho jayega.
// Isliye hume ek global store chahiye, jo poore app me authentication state ko manage kare.



import { API_ROUTES } from '@/utils/api';
import axios from 'axios';
import {create} from 'zustand';
import {persist} from 'zustand/middleware'


//why zustand is used here?
//zustand is used here to store the user data in the local storage
//zustand me store bnane k liye ek single function create use hota hai jisme hum store ki state aur functions define krte hai


type User = {
    id: string;
    name: string | null;
    email: string;
    role: 'USER' | 'SUPER_ADMIN';
}

type AuthStore = {
    user: User | null;
    isLoading : boolean;
    error: string | null;
    register : (name : string, email : string, password : string) => Promise<string | null>;
    login : (email : string, password : string) => Promise<boolean>;
    logout : () => Promise<void>;
    refreshTokens : () => Promise<boolean>;
};

const axiosInstance = axios.create({
    baseURL: API_ROUTES.AUTH,
    withCredentials: true,
});

export const useAuthStore = create<AuthStore>()(
    persist(//persist is used to store the user data in local storage
        (set)=>({
            user : null,
            isLoading : false,
            error : null,
            register : async(name, email, password) => {
                set({isLoading : true,error : null})
                try {
                    const response = await axiosInstance.post('/register', {name, email, password})
                    set({isLoading : false})
                    return response.data.userId
                } catch (error) {
                    set({
                        isLoading : false,
                        error : axios.isAxiosError(error)? error?.response?.data?.error || 'registration failed': 'registration failed'
                    })

                    return null
                }
            },
            login : async(email, password) => {
                set({isLoading : true,error : null})
                try {
                    const response = await axiosInstance.post('/login', {email, password})
                    set({isLoading : false,user : response.data.user})
                    return true
                } catch (error) {
                    set({
                        isLoading : false,
                        error : axios.isAxiosError(error)? error?.response?.data?.error || 'login failed': 'login failed'
                    })

                    return false
                }
            },
            logout : async() => {
                set({isLoading : true,error : null})
                try {
                    await axiosInstance.post('/logout')
                    set({isLoading : false,user : null})
                } catch (error) {
                    set({
                        isLoading : false,
                        error : axios.isAxiosError(error)? error?.response?.data?.error || 'logout failed': 'logout failed'
                    })
                }
            },
            refreshTokens : async() => {
                try {
                 await axiosInstance.post('/refresh-tokens')
                return true
                } catch (error) {
                    console.error('refresh tokens failed', error)

                    return false
                }
            }
        }),{
            name : 'auth-storage',
            partialize : (state)=>({user : state.user})
        }
    )
)

