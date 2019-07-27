import React from "react";
import { Link } from "gatsby";

import Layout from "../components/layout";
import Image from "../components/image";
import SEO from "../components/seo";

function IndexPage() {
    const [username, setUsername] = React.useState();
    const [isValid, setValid] = React.useState(false);
    const [isEmpty, setEmpty] = React.useState(true);

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
    
    const [avatar, setAvatar] = React.useState();

    const getResult = React.useCallback(e => {
        e.preventDefault();
        console.log("Submitting",  username);

        fetch(".netlify/functions/proxy/", {
            method: 'POST',
            body: JSON.stringify({
                username: username
            })
        })
        .then(response => response.text())
        .then(result => {
            setAvatar(result);
        })
    }, [username]);

    return (
        <Layout>
            <SEO title="Snapcode Generator" />
            <h1>Enter your username</h1>
            <form onSubmit={getResult}>
                <input class="input" placeholder="Username" type="text" onInput={updateUsername} />
                <div>
                    <button class="button button-snapchat" type="submit">Snapchat</button>
                </div>
                <FormError isValid={isValid} isEmpty={isEmpty} />
            </form>
            <SVG svg={avatar} />
        </Layout>
    )
}

function FormError({isValid, isEmpty}) {

    return (isValid || isEmpty) ? (
        <p />
    ) : (
        <p>Username Invalid</p>
    )
}
function SVG({svg}) {
    const html = {
        __html: svg
    }
    return (
        <div dangerouslySetInnerHTML={html} />
    )
}
export default IndexPage
