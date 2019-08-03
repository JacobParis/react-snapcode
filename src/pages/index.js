import React from "react";
import { Link } from "gatsby";
import styled from 'styled-components';
import Switch from 'react-switch';

import Form from "../components/form";
import Layout from "../components/layout";
import Image from "../components/image";
import SEO from "../components/seo";

function IndexPage() {
    const [username, setUsername] = React.useState();
    const [avatar, setAvatar] = React.useState();
    const [isLocked, setLocked] = React.useState(false);
    return (
        <Layout>
            <SEO title="Snapcode Generator" />
            
            <Form isLocked={isLocked} setAvatar={setAvatar} setUsername={setUsername} username={username} setLocked={setLocked}/>
            <Snapcode username={username} isHidden={!isLocked} avatar={avatar} />
        </Layout>
    )
}

function Snapcode({isHidden, avatar, username}) {
    const [isRotated, setRotated] = React.useState(false);
    const [showBitmoji, setShowBitmoji] = React.useState(false);
    const [showName, setShowName] = React.useState(false);

    return isHidden ? null : (
        <div>
            <div>
                <SVGContainer>
                    <SVG svg={avatar} isRotated={isRotated} showBitmoji={showBitmoji} />
                </SVGContainer>
                <UsernameLabel isOffset={isRotated} isHidden={!showName}>{username}</UsernameLabel>
            </div>
            <Setting label="Diamond Shape" state={isRotated} setState={setRotated} />
            <Setting label="Display Name" state={showName} setState={setShowName} />
            <Setting label="Display Bitmoji" state={showBitmoji} setState={setShowBitmoji} />
            
        </div>
    )
}

const SettingRow = styled.label`
    display: flex;
    justify-content: space-between;
    margin: 0.5rem 0;
    font-size: 1rem;
    & > span {

    } 
`;
function Setting({label, state, setState}) {
    const toggleState = React.useCallback(() => setState(!state));

    return (
        <SettingRow>
            <span>{label}</span>
            <Switch checked={state} onChange={toggleState} />
        </SettingRow>
    );
}


const UsernameLabel = styled.h3`
    opacity: ${({isHidden}) => isHidden ? `0` : `1`};
    margin-top: ${({isOffset}) => isOffset ? `3rem` : `1rem`};
    transition: margin-top 0.6s, opacity 0.3s ease;
    transition-timing-function: ${({isOffset}) => isOffset ? `cubic-bezier(0.23, 1, 0.32, 1)` : `cubic-bezier(0.755, 0.05, 0.855, 0.06)`}
`;

const SVGContainer = styled.div`
    position: relative;
    width: 70vw;
    max-width: 400px;
    height: 70vw;
    max-height: 400px;
    margin: auto;
`;

const SVG = styled.div.attrs({
    dangerouslySetInnerHTML: ({svg}) => ({
        __html: svg
    })})`
    position: absolute;
    left: 0;
    right: 0;
    margin: 0 0 2rem 0;
    max-height: 100vw;
    transition: transform 0.6s cubic-bezier(0.6, -0.28, 0.735, 0.045);
    transform: ${({isRotated}) => isRotated ? `rotate(225deg)` : `initial`};
    & image {
        transform: ${({isRotated}) => isRotated ? `rotate(135deg)` : `initial`};
        transform-origin: center;
        transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55),
                    opacity 0.4s;
        opacity: ${({showBitmoji}) => showBitmoji ? 1 : 0}
    }
`;
export default IndexPage
