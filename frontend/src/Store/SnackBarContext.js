import React, { createContext, useState, useEffect } from 'react';

export const SnackBarContext = createContext();

const SnackBarContextProvider = (props) => {

    const [snackMessage, setSnackMessage] = useState("")

    useEffect(() => {

        const timer = setTimeout(() => {
            setSnackMessage("")
        }, 3000);

        return () => clearTimeout(timer);
    }, [snackMessage])

    return (
        <SnackBarContext.Provider value={{snackMessage, setSnackMessage}}>
            {props.children}
        </SnackBarContext.Provider>
    )
}

export default SnackBarContextProvider;