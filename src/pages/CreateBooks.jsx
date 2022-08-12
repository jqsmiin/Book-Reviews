import { Grid } from "@mui/material"
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Rating from '@mui/material/Rating';
import shelf from '../images/bookshelf.png'
import {useNavigate} from 'react-router-dom'
import {useState, useEffect, useCallback, useRef} from 'react'
import {getAuth, onAuthStateChanged} from 'firebase/auth'
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage'
import {db} from '../firebase.config'
import {addDoc, collection, serverTimestamp} from 'firebase/firestore'
import {v4 as uuidv4} from 'uuid'
import { toast } from 'react-toastify'
import Spinner from "../components/Spinner";

function CreateBooks() {
    const [loading, setLoading] = useState(false)
    const [currency, setCurrency] = useState('');
    const [value, setValue] = useState({
        author : '',
        title : '',
        isbn : '',
        pages : '',
        description : '',
        rating : 2,
        images : {},
        type : currency
    })

    const types = [
      {
        value: 'Non-fiction',
      },
      {
        value: 'Fiction',
      },
    ];

    const {author, title, isbn, pages, description, rating, images, type} = value;

    
    const handleChange = useCallback(async(e) =>{
      setCurrency(e.target.value);
      setValue((prevState) =>({
        ...prevState
      }))
    }, [])

    useEffect(() =>{
       const changeType = () =>{
        setValue((prevState) =>({
          ...prevState,
          type : currency
        }))
       }
       changeType()
    }, [type, handleChange, currency])

    const auth = getAuth()
    const navigate = useNavigate()
    const isMounted = useRef(true)

    useEffect(() =>{
        if(isMounted){
           onAuthStateChanged(auth, (user) =>{
             if(user){
               setValue({...value, userRef : user.uid})
             }else{
               navigate('/sign-in')
             }
           })
        }
 
        return () =>{
            isMounted.current = false
        }
       
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted])

    const onSubmit = async (e) =>{
        e.preventDefault()
 
        setLoading(true)
        if(images.length > 6){
            setLoading(false)
            toast.error('Max 6 images')
            return
        }
        // Store images in firebase
        const storeImage = async (image) =>{
            return new Promise((resolve, reject) =>{
                const storage = getStorage()
                const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`
 
                const storageRef = ref(storage, 'images/' + fileName)
 
                const uploadTask = uploadBytesResumable(storageRef, image)
 
                uploadTask.on('state_changed',
     (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
     }, 
     (error) => {
     reject(error)
     }, 
     () => {
      // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
         resolve(downloadURL);
        })
     }
   )
     })
   }
 
    const imgUrls = await Promise.all(
        [...images].map((image) => storeImage(image))
    ).catch(() =>{
        setLoading(false)
        toast.error('Images not uploaded')
        return
    })
 
    const formDataCopy = {
      ...value,
      imgUrls,
      timestamp : serverTimestamp()
    }
 
    delete formDataCopy.images

    console.log(formDataCopy);
 
    await addDoc(collection(db, 'books'), formDataCopy)
 
   setLoading(false)
 
   toast.success('Book Added')
   }

    const onMutate = (e) =>{
        let boolean = null;
         // Files
        if (e.target.files) {
            setValue((prevState) => ({
            ...prevState,
            images: e.target.files,
            }))
        }
  
      // Text/Booleans/Numbers
      if (!e.target.files) {
        setValue((prevState) => ({
          ...prevState,
          [e.target.id]: boolean ?? e.target.value,
        }))
      }
    }
    const onRatingChange = (e, newValue) =>{
        let rating = e.target.parentElement.id;
        setValue((prevState) =>({
            ...prevState,
            [rating] : newValue.toString()
        }))
    }
    if(loading){
        return <Spinner />
    }

    return (
        <section id="create-books">
         <h2 className="section-title">Create Book</h2>
         <Grid container>
           <Grid item md={6} className='create-item-1'>
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 0, width: '35ch' },
                    }}
                    noValidate
                    autoComplete="off"
                    >
                    <div className="field-container">
                    <label className='field-label' htmlFor="author">Author</label>
                    <TextField value={author} onChange={onMutate} id="author" label="Author" variant="outlined" />
                    </div>
                    <div className="field-container">
                    <label className='field-label' htmlFor="title">Title</label>
                    <TextField value={title} onChange={onMutate} id="title" label="Title" variant="outlined" />
                    </div>
                    <div className="field-container">
                    <label className='field-label' htmlFor="isbn">Isbn</label>
                    <TextField value={isbn} onChange={onMutate} id="isbn" type="number" label="Isbn" variant="outlined" />
                    </div>
                    <div className="field-container">
                    <label className='field-label' htmlFor="pages">Pages</label>
                    <TextField value={pages} onChange={onMutate} id="pages" type="number" label="Pages" variant="outlined" />
                    </div>    
                    <div className="field-container">
                    <label className='field-label' htmlFor="description">Description</label>
                    <TextField value={description} onChange={onMutate} id="description" multiline maxRows={15} label="Description" variant="outlined" />
                    </div>   
                    <div className="field-container">
                      <label className='field-label' htmlFor="description">Type</label>
                      <TextField
                      id="type"
                      select
                      label="Select"
                      value={type}
                      onChange={handleChange}
                      helperText="Please select your type"
                    >
                      {types.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.value}
                        </MenuItem>
                      ))}
                     </TextField>  
                    </div>  
                    <div className="field-container">
                    <label className='field-label' htmlFor="upload">Upload image</label>
                    <Button  className='logout-btn' variant="contained" component="label">
                     Upload
                     <input id='images' hidden accept=".jpg,.png,.jpeg" onChange={onMutate} type="file" />
                    </Button>
                    <p className="image-alert">You can upload only 1 image</p>
                    </div>                         
                    <div className="rating-container">
                    <label className='rating-label' htmlFor="rating">Rating</label>
                    <Rating value={+rating}  onChange={(event, newValue) => onRatingChange(event, newValue)} id='rating' name="simple-controlled" />
                    </div>
                </Box>
                    <Button className='logout-btn' onClick={onSubmit} pt={4} variant="outlined">Submit</Button>
           </Grid>
           <Grid item md={4} className='create-item-2'>
              <img src={shelf} alt="Shelf" />
           </Grid>
         </Grid>
        </section>
    )
}

export default CreateBooks
