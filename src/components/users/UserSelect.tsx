import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { collection, doc, setDoc, getDoc, getDocs } from "firebase/firestore";
import { db } from '../../firebase';
import { useEffect, useState } from 'react';
import Link from '@mui/material/Link';
import NewUser from './NewUser';
import Button from '@mui/material/Button';
interface User {
    [key: string]: string;
  }

const UserSelect = (props: any) => {
    const [isOpenNewUser, setIsOpenNewUser] = useState(false);

    const handleChange = (event: SelectChangeEvent) => {
        // 選択ユーザーの決定
        props.setSelectUserId(event.target.value as string);
    };

    const listItems = Object.entries(props.users as User).map(([id, name]) => (
        <MenuItem value={id} key={id}>{name}</MenuItem>
    ));

    return <>
        {/* ユーザー選択 */}
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">名前</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="name"
                onChange={handleChange}
                value={props.selectUserId}
            >
                {listItems}
            </Select>
        </FormControl>

            <Link onClick={() => {
                setIsOpenNewUser(true);
            }}>新しくユーザーを追加する</Link>

            <NewUser open={isOpenNewUser} onClose={()=>setIsOpenNewUser(false)} submit={() => {
                props.getUserList();
            }} />
    </>
}

export default UserSelect;
