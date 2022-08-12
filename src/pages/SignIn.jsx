import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from 'react';
import book from '../images/book.png';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

function SignIn() {
    const [users, setUsers] = useState({
        email : '',
        password : ''
    })

    const handleChange = (e) =>{
        setUsers((prevState) =>({
            ...prevState,
            [e.target.id] : e.target.value
        }))
    }

    const navigate = useNavigate()

    const {email, password} = users

    const handleSubmit = async () =>{
     try{
        const auth = getAuth();
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        if(userCredential){
            navigate('/')
        }
     }catch(err){
      console.log(err)
     }
    }

    const handleNavigate = () =>{
        navigate('/sign-up')
    }

    return (
        <section id="sign-up">
        <Grid container spacing={1}>
            <Grid item xs={12} sm={7} md={8} lg={8} className='item-1'>
                <img src={book} alt='book' />
            </Grid>
            <Grid item xs={12} sm={5} md={4} lg={4} className='item-2'>
                <h3>Sign In!</h3>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap : '2rem', marginBottom : '2rem' }}>
                  <TextField onChange={handleChange} value={email} fullWidth id="email" label="Email" variant="outlined" />
                  <TextField onChange={handleChange} value={password} fullWidth id="password" type='password' label="Password" variant="outlined" />
                </Box>
                  <h4 onClick={() => navigate('/forgot-password')} className='forgot-password'>Forgot Password?</h4>
                <Stack spacing={1} direction="column">
                  <Button onClick={handleSubmit} size="meduim" variant="contained">Submit</Button>
                  <Button onClick={handleNavigate} size="meduim" variant="text">Sign Up Instead?</Button>
                </Stack>
            </Grid>
        </Grid>
    </section>
    )
}

export default SignIn
