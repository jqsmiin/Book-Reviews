import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {db} from '../firebase.config'
import { serverTimestamp, setDoc, doc } from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import bookShelf from '../images/bookshelf.png'
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

function SignUp() {
    const [users, setUser] = useState({
        name : '',
        email : '',
        password : ''
    })
    const navigate = useNavigate()

    const {name, email, password} = users

    const handleUser = (e) =>{
        setUser((prevState) =>({
            ...prevState,
            [e.target.id] : e.target.value
        }))
    }

    const createUser = async (e) =>{
        e.preventDefault()
        try{
            // Get Auth
            const auth = getAuth()
            // Set User Credentials
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            // Set User
            const user = userCredential.user
            // Update profile and set name
            updateProfile(auth.currentUser, {
              displayName: name,
            })
            // Copy formData
            const formDataCopy = {...users}
            formDataCopy.timeStamp = serverTimestamp()
            // Save data to firebase storage
            console.log(formDataCopy);
            await setDoc(doc(db, 'users', user.uid), formDataCopy)
            // Navigate to home page
            navigate('/') 

        } catch (error) {
            console.log(error)
        }
    }
    
    const handleNavigate = () =>{
        navigate('/sign-in')
    }
    return (
        <section id="sign-up">
            <Grid container spacing={1}>
                <Grid item xs={12} sm={7} md={8} lg={8} className='item-1'>
                    <img src={bookShelf} alt='book shelf' />
                </Grid>
                <Grid item xs={12} sm={5} md={4} lg={4} className='item-2'>
                    <h3>Sign Up!</h3>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap : '2rem', marginBottom : '2rem' }}>
                      <TextField onChange={handleUser} value={name} fullWidth id="name" label="Name" variant="outlined" />
                      <TextField onChange={handleUser} value={email} fullWidth id="email" label="Email" variant="outlined" />
                      <TextField type='password' onChange={handleUser} value={password} fullWidth id="password" label="Password" variant="outlined" />
                    </Box>
                    <Stack spacing={1} direction="column">
                      <Button onClick={createUser} size="meduim" variant="contained">Submit</Button>
                      <Button onClick={handleNavigate} size="meduim" variant="text">Sign In Instead?</Button>
                    </Stack>
                </Grid>
            </Grid>
        </section>
    )
}

export default SignUp
