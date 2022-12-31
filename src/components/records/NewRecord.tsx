import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextField from '@mui/material/TextField';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { db } from '../../firebase';
import { runTransaction, collection, doc, setDoc, getDoc, getDocs } from "firebase/firestore";
import Modal from "@mui/material/Modal";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };


// 新しい記録をDBに登録する
const NewRecord = (props: any) => {

    const [value, setValue] = useState<Dayjs | null>(dayjs());

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        props.onClose();
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log(props.id);

        const sfDocRef = doc(db, "users", props.id);

        try {
            await runTransaction(db, async (transaction) => {
                const sfDoc = await transaction.get(sfDocRef);
                if (!sfDoc.exists()) {
                    throw "Document does not exist!";
                }
                const newRecord = {
                    date: value?.toString(),
                    temperature: data.get("temperature"),
                    note: data.get("note"),
                };

                const records = sfDoc.data().records;
                let newRecords = [];
                if (records === undefined) {
                    newRecords = [newRecord]
                }
                else {
                    newRecords = [...records, newRecord];

                }
                transaction.update(sfDocRef, { records: newRecords });
            });
            console.log("Transaction successfully committed!");
            props.submit();
        } catch (e) {
            console.log("Transaction failed: ", e);
        }

    }

    return <>
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={props.open}
            onClose={props.onClose}
        >

            <Box component="form" onSubmit={handleSubmit} sx={style}>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                renderInput={(props) => <TextField {...props} />}
                                label="日時"
                                value={value}
                                onChange={(newValue) => {
                                    setValue(newValue);
                                }}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            type="number"
                            label="体温"
                            name="temperature"
                            inputProps={{ min: "0", max: "100", step: "0.1" }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            id="outlined-multiline-flexible"
                            label="メモ"
                            multiline
                            maxRows={4}
                            name="note"
                        />

                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" fullWidth variant="contained">登録</Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    </>
}

export default NewRecord;