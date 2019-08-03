import React from "react";
import styled from "styled-components";

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
            <input class="input" placeholder="Username" type="text" onInput={updateUsername} />
            <div>
                <button class="button button-snapchat" type="submit">{isLoading ? "Loading" : "Snapchat"}</button>
            </div>
            <FormError isValid={isValid} isEmpty={isEmpty} />
        </form>
    );
}

const Button = styled.button`
    background: yellow;
    border: 4px solid;
    border-radius: 1rem;
    padding: 0.5rem 1rem;
    font-weight: bold;
    margin-bottom: 4rem;
`;
function FormError({isValid, isEmpty}) {

    return (isValid || isEmpty) ? (
        <p />
    ) : (
        <p>Username Invalid</p>
    )
}