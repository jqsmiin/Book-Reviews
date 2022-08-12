import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddBoxIcon from '@mui/icons-material/AddBox';
import Logo from '../images/logo.png'
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';

export default function TemporaryDrawer() {
  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const navigate = useNavigate()

  const changeRoute =  (e) =>{
   let textContent = e.target.textContent;

   if(textContent === 'Home'){
    navigate('/')
   }else if(textContent === 'Profile'){
    navigate('/profile')
   }else if(textContent === 'Create Book'){
    navigate('/create-book')
   }
  }

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <Grid container>
           <Grid item md={6} pl={4}>
             <h3>Menu</h3>
           </Grid>
        </Grid>
        {['Home', 'Profile', 'Create Book'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={changeRoute}>
              <ListItemIcon>
                {index === 0 ? <AutoStoriesIcon /> : index === 1 ? <AccountCircleIcon/> : <AddBoxIcon /> }
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      {['right'].map((anchor) => (
        <React.Fragment key={anchor}>
         <nav id='navbar'>
            <Grid container spacing={1}>
                <Grid className='item-1' item md={8} sm={8} xs={8}>
                  <img src={Logo} alt='Logo' />
                </Grid>
                <Grid className='item-2' item md={4} sm={4} xs={4}>
                <Button onClick={toggleDrawer(anchor, true)}> <MenuIcon sx={{
                   fontSize : '2.5rem'
                }} /> </Button>
                  <Drawer
                     anchor={anchor}
                     open={state[anchor]}
                     onClose={toggleDrawer(anchor, false)}
                   >
                   {list(anchor)}
                  </Drawer>
                </Grid>
            </Grid>
         </nav>
        </React.Fragment>
      ))}
    </div>
  );
}
       