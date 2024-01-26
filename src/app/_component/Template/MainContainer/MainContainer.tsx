"use client";
import React from "react";
import { useSession } from "next-auth/react";
import styles from './MainContainer.module.css';
import MyPage from "../../Molecule/ChannelsContainer";

export default function MainContainer() {
    const { data: session } = useSession();
    if (session ) {
        return (
            <MyPage />
        );
    }
   return <></>
}

