import * as SecureStore from 'expo-secure-store';
import React from 'react';
import { Platform } from 'react-native';

const AuthContext = React.createContext<{
    signIn: (token: string) => Promise<void>;
    signOut: () => Promise<void>;
    session?: string | null;
    isLoading: boolean;
}>({
    signIn: async () => { },
    signOut: async () => { },
    session: null,
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
async function setStorageItemAsync(key: string, value: string | null) {
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
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        // Platform specific logic for getting items.
        if (Platform.OS === 'web') {
            try {
                if (typeof localStorage !== 'undefined') {
                    setSession(localStorage.getItem('session'));
                }
            } catch (e) {
                console.error('Local storage is unavailable:', e);
            }
            setIsLoading(false);
        } else {
            SecureStore.getItemAsync('session').then((value) => {
                setSession(value);
                setIsLoading(false);
            });
        }
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
                    setSession(null);
                },
                session,
                isLoading,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
}
