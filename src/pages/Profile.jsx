import { Grid } from "@mui/material"
import avatar from '../images/avatar.png'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Profile() {
    const auth = getAuth()
    const navigate = useNavigate()
    
    const onLogout = () =>{
        auth.signOut()
        navigate('/sign-in')
    }

    return (
        <section id="profile">
            <Grid container spacing={4}>
              <Grid item md={6} sm={12} xs={12} className='item-1'>
                <div className="image-container">
                    <img src={avatar} alt='User Avatar' />
                </div>
                <div className="text-container">
                    <p>Welcome {auth.currentUser.displayName}! You can view your profile information and logout if you want.</p>
                </div>
              </Grid>
              <Grid item md={6} sm={12} xs={12} className='item-2'>
                <h2>User Info!</h2>
                <Box sx={{ p: 2, border: '1px dashed grey' }} className="info-container">
                    <h3>Username : </h3>
                    <p>{auth.currentUser.displayName}</p>
                    <h3>Email : </h3>
                    <p>{auth.currentUser.email}</p>
                </Box>
                <Button onClick={onLogout} className='logout-btn' pt={4} variant="outlined">Logout</Button>
              </Grid>
            </Grid>
        </section>
    )
}

export default Profile
