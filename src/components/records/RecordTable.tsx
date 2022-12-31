import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextField from '@mui/material/TextField';
import dayjs, { Dayjs } from 'dayjs';
import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { db } from '../../firebase';
import { runTransaction, collection, doc, setDoc, getDoc, getDocs } from "firebase/firestore";
import NewRecord from './NewRecord';
import { DataGrid, GridColDef, GridToolbar, GridRowId } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';

interface User {
    name: string;
    date: string;
    temperature: string;
    note: string;
    id:number;
}
const RecordTable = (props: any) => {
    const [isOpenPost, setOpenPost] = useState(false);
    const [records, setRecords] = useState<User[]>([]);
    const [selectionModel, setSelectionModel] = useState<GridRowId[]>([]);


    // ユーザーデータを取得する
    const getRecords = async () => {
        const ref = doc(db, "users", props.id);
        const docSnap = await getDoc(ref);
        if (!docSnap.exists()) return;

        let data = docSnap.data();

        if (data.records === undefined) {
            setRecords([]);
            return;
        }
        // 日付順にソート
        data.records.sort((a: User, b: User) => -dayjs(a.date).unix() + dayjs(b.date).unix());
        data.records.forEach((record: any, id: number) => {
            record.id = id;
            record.date = dayjs(record.date).format("YYYY/MM/DD (ddd) HH:mm");
        })
        setRecords(data.records);
        console.log(data.records);
    }

    // 行を削除する
    const deleteRow = async () => {
        let rows = records.filter((item)=>!selectionModel.includes(item.id));
        
        // DBを更新
        const sfDocRef = doc(db, "users", props.id);

        try {
            await runTransaction(db, async (transaction) => {
                const sfDoc = await transaction.get(sfDocRef);
                if (!sfDoc.exists()) {
                    throw "Document does not exist!";
                }
                transaction.update(sfDocRef, { records: rows });
            });
            console.log("Transaction successfully committed!");
            setSelectionModel([]);
            getRecords();
        } catch (e) {
            console.log("Transaction failed: ", e);
        }
    }

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 10 },
        { field: 'date', headerName: '日時', width: 180 },
        { field: 'temperature', headerName: '体温', width: 50 },
        { field: 'note', headerName: 'メモ', width: 300 },
    ]

    // 初回のみ実行
    useEffect(() => {
        setSelectionModel([]);
        getRecords();
    }, [props.id]);


    return <>
        {/* 投稿 */}
        <br />
        <NewRecord id={props.id} open={isOpenPost} onClose={() => { setOpenPost(false); }} submit={() => { getRecords(); }} />
        <Button fullWidth variant="contained" onClick={() => setOpenPost(true)}>新規データ登録</Button>
        <br />

        {records.length !== 0 &&

            // テーブルの表示
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={records}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                    components={{ Toolbar: GridToolbar }}
                    selectionModel={selectionModel}
                    onSelectionModelChange={(selectionModel) =>
                        setSelectionModel(selectionModel)
                    }
                />
            </div>
        }

        {selectionModel.length !== 0 &&
            <Button onClick={deleteRow}  color="error" fullWidth variant="outlined" startIcon={<DeleteIcon />}>
                選択行を削除
            </Button>
        }
    </>
}

export default RecordTable;