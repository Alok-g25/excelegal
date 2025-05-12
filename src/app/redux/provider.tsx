"use client"
import { Provider } from "react-redux";
import { ReactNode } from "react";
import store from "./store";

interface ReduxProviderProps {
    children: ReactNode;
}

// console.log("ReduxProvider")
export function ReduxProvider({ children }: ReduxProviderProps) {
    return <Provider store={store}>
        {children}
    </Provider>
}