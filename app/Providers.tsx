'use client';
import { MainStoreProvider } from '@/main-store-provider';
import React from 'react';

const Providers = ({ children }: { children: React.ReactNode }) => {
	return <MainStoreProvider>{children}</MainStoreProvider>;
};

export default Providers;
