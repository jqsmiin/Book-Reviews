import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { useState } from 'react';
import {toast} from 'react-toastify';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

function ForgotPassword() {
   const [email, setEmail] = useState('')

   const handleChange = (e) =>{
    setEmail(e.target.value)
   }

   const handleSubmit = async(e) =>{
    e.preventDefault()
    try {
        const auth = getAuth()
   
        await sendPasswordResetEmail(auth, email)
        
        toast.success('Email was sent')
    } catch (error) {
        toast.error('Could not sent email')
    }
   }


    return (
       <section id="forgot-password">
        <Container container spacing={1}>
        <div className="page-title">Forgot Password?</div>
        <Grid className='content-wrapper' xs={6} md={6} sx={{display: 'flex', flexDirection: 'column'}}>
        <TextField className='emailInput' onChange={handleChange} value={email} id="email" label="Email" variant="outlined" />
        <Button className='fBtn' onClick={handleSubmit} size="meduim" variant="contained">Submit</Button>
        </Grid>
        </Container>
       </section>
    )
}

export default ForgotPassword
