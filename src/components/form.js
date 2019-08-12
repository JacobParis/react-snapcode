import React from "react";
import styled from "styled-components";
import Button from "../components/button";

export default function Form({isLocked, setLocked, setAvatar, setUsername, username}) {
    const [isValid, setValid] = React.useState(false);
    const [isEmpty, setEmpty] = React.useState(true);
    const [isLoading, setLoading] = React.useState(false);

    const updateUsername = React.useCallback(e => {
        const input = e.target.value;
        const nameWithNoAt = input.indexOf("@") ? input : input.replace("@", "");
        const validRegex = /^[a-zA-Z][\w-_.]{1,13}[\w]$/;

        setEmpty(nameWithNoAt.length <= 3);

        if(validRegex.test(nameWithNoAt)) {
            setValid(true);
            setUsername(e.target.value)
        } else {
            setValid(false);
        }
    }, []);

    const getResult = React.useCallback(e => {
        e.preventDefault();

        if(!isValid || isEmpty) {
            setValid(false);
            return;
        }
        
        console.log("Submitting",  username);
        setLoading(true);
        fetch(".netlify/functions/proxy/", {
            method: 'POST',
            body: JSON.stringify({
                username: username
            })
        })
        .then(response => response.text())
        .then(result => {
            setLoading(false);
            setAvatar(result);
            setLocked(true);
        })
    }, [username]);

    const unlock = React.useCallback(() => setLocked(false));
    return isLocked ? (
        <Button onClick={unlock}>Different User</Button>
    ) : (
        <form onSubmit={getResult}>
            <input className="input" placeholder="Username" type="text" onInput={updateUsername} />
            <div>
                <Button type="submit">{isLoading ? "Loading" : "Get Tag"}</Button>
            </div>
            <FormError isValid={isValid} isEmpty={isEmpty} />
        </form>
    );
}

function FormError({isValid, isEmpty}) {

    return (isValid || isEmpty) ? (
        <p />
    ) : (
        <p>Username Invalid</p>
    )
}