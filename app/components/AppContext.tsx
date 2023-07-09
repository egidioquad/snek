"use client"

import { createContext, useState, useContext, ReactNode } from 'react';

interface AppContextProps {
	btcAddress: string;
	userHighscore: number;
	updateBtcAddress: (address: string) => void;
	updateUserHighscore: (score: number) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

interface AppProviderProps {
	children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
	const [btcAddress, setBtcAddress] = useState('');
	const [userHighscore, setUserHighscore] = useState(0);

	const updateBtcAddress = (address: string) => {
		setBtcAddress(address);
	};

	const updateUserHighscore = (score: number) => {
		setUserHighscore(score);
	};

	const contextValue: AppContextProps = {
		btcAddress,
		userHighscore,
		updateBtcAddress,
		updateUserHighscore,
	};

	return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextProps => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error('useAppContext must be used within an AppProvider');
	}
	return context;
};
