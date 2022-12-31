import React, { useEffect, useState } from 'react';
import SignOut from "./SignOut";
import SignIn from './SignIn';
import { encrypt, decrypt } from "./Crypto";
import Cookies from "js-cookie";
import UserSelect from "./users/UserSelect";
import RecordTable from './records/RecordTable';
import { collection, doc, setDoc, getDoc, getDocs } from "firebase/firestore";
import { db } from '../firebase';

const Main = (props: any) => {
    const [users, setUsers] = useState<{ [key: string]: any }>({});
    const [selectUserId, setSelectUserId] = useState("");

    // ユーザーリストを取得
    const getUserList = async () => {
        const docSnap = await getDoc(doc(db, "users", "users"));
        if (!docSnap.exists()) {
            console.log("users collection not found");
            return;
        }
        const data = docSnap.data();
        setUsers(data.users);
        console.log(data.users);
    };

    useEffect(() => {
        getUserList();
    }, []);

    return <>
        <h1>記録表</h1>
        {/* ユーザーの選択 */}
        <UserSelect selectUserId={selectUserId} setSelectUserId={setSelectUserId} users={users} getUserList={getUserList} />

        {/* 記録データの表示 */}
        {selectUserId !== "" && <RecordTable id={selectUserId} />}
    </>
}

export default Main;