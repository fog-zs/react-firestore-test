import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { db } from '../../firebase';
import { runTransaction, collection, addDoc, doc, setDoc, getDoc, getDocs } from "firebase/firestore";
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

const NewUser = (props: any) => {

    const addUser = async (id: string, name: string) => {
        const sfDocRef = doc(db, "users", "users");

        try {
            await runTransaction(db, async (transaction) => {
                const sfDoc = await transaction.get(sfDocRef);
                if (!sfDoc.exists()) {
                    throw "Document does not exist!";
                }
                
                let newUsers:{[key: string]: any} = sfDoc.data().users || {};
                newUsers[id] = name;

                transaction.update(sfDocRef, { users: newUsers });
            });
            console.log("Transaction successfully committed!");
            props.submit();
        } catch (e) {
            console.log("Transaction failed: ", e);
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        props.onClose();
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const name: string = data.get('name')?.toString() || "";
        if (name === "" || name === undefined) {return;};
        const docRef = await addDoc(collection(db, "users"), {
            name: name,
        });
        addUser(docRef.id, name);
    }
    return <>
        <br />
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={props.open}
            onClose={props.onClose}
        >
        <Box component="form" onSubmit={handleSubmit} sx={style}>
            <TextField required fullWidth name="name" id="name" label="追加する名前" variant="outlined" />
            <Button type="submit" fullWidth variant="contained">新規登録</Button>
        </Box>
        </Modal>
    </>
}

export default NewUser;