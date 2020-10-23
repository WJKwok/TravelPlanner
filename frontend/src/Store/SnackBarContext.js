import React, { createContext, useState, useEffect } from 'react';

export const SnackBarContext = createContext();

const snackInitialState = {
    text: "", 
    code: ""
}

const SnackBarContextProvider = (props) => {

    const [snackMessage, setSnackMessage] = useState(snackInitialState)

    useEffect(() => {

        const timer = setTimeout(() => {
            setSnackMessage(snackInitialState)
        }, 5000);

        return () => clearTimeout(timer);
    }, [snackMessage])

    return (
        <SnackBarContext.Provider value={{snackMessage, setSnackMessage}}>
            {props.children}
        </SnackBarContext.Provider>
    )
}

export default SnackBarContextProvider;