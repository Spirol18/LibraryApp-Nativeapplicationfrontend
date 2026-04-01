import * as SecureStore from 'expo-secure-store';
import React from 'react';
import { Platform } from 'react-native';

const AuthContext = React.createContext<{
    signIn: (token: string) => Promise<void>;
    signOut: () => Promise<void>;
    session?: string | null;
    user?: any | null;
    setUser: (user: any | null) => void;
    isLoading: boolean;
}>({
    signIn: async () => { },
    signOut: async () => { },
    setUser: () => { },
    session: null,
    user: null,
    isLoading: true,
});

// This hook can be used to access the user info.
export function useSession() {
    const value = React.useContext(AuthContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useSession must be wrapped in a <SessionProvider />');
        }
    }

    return value;
}

// We use a custom utility to handle web and native separately.
// SecureStore is not supported on the web out of the box.
export async function getStorageItemAsync(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
        try {
            if (typeof localStorage !== 'undefined') {
                return localStorage.getItem(key);
            }
        } catch (e) {
            console.error('Local storage is unavailable:', e);
        }
        return null;
    } else {
        return await SecureStore.getItemAsync(key);
    }
}
export async function setStorageItemAsync(key: string, value: string | null) {
    if (Platform.OS === 'web') {
        try {
            if (value === null) {
                localStorage.removeItem(key);
            } else {
                localStorage.setItem(key, value);
            }
        } catch (e) {
            console.error('Local storage is unavailable:', e);
        }
    } else {
        if (value == null) {
            await SecureStore.deleteItemAsync(key);
        } else {
            await SecureStore.setItemAsync(key, value);
        }
    }
}

export function SessionProvider(props: React.PropsWithChildren) {
    const [session, setSession] = React.useState<string | null>(null);
    const [user, setUser] = React.useState<any | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        async function loadStorage() {
            try {
                const [sessionValue, userValue] = await Promise.all([
                    getStorageItemAsync('session'),
                    getStorageItemAsync('user_data')
                ]);
                
                setSession(sessionValue);
                if (userValue) {
                    try {
                        setUser(JSON.parse(userValue));
                    } catch (e) {
                        console.error('Failed to parse user data:', e);
                    }
                }
            } finally {
                setIsLoading(false);
            }
        }
        loadStorage();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                signIn: async (token: string) => {
                    await setStorageItemAsync('session', token);
                    setSession(token);
                },
                signOut: async () => {
                    await setStorageItemAsync('session', null);
                    await setStorageItemAsync('user_data', null);
                    setSession(null);
                    setUser(null);
                },
                session,
                user,
                setUser,
                isLoading,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
}
