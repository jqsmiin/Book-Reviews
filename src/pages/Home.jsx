import Grid from '@mui/material/Grid';
import Rating from '@mui/material/Rating';
import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, query, where, orderBy, doc, deleteDoc} from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import DeleteIcon from '@mui/icons-material/Delete';

function Home() {
   const [listings, setListings] = useState(null)
   const [loading, setLoading] = useState(true)

   const auth = getAuth()

   const ratings = [5,4,3,2,1]

   useEffect(() =>{
    const fetchListings = async() =>{
        try {
            // Get reference
            const listingRef = collection(db, 'books')
            // Create query
            const q = query(
                listingRef,
                where('userRef', '==', auth.currentUser.uid),
                orderBy('timestamp', 'desc')
            )
            // Execute query
            const querySnap = await getDocs(q)

            const listings = []
            querySnap.forEach((doc) =>{
                return listings.push({
                    id : doc.id,
                    data : doc.data()
                })
            })
            setListings(listings)
            setLoading(false)
        } catch (error) {
            console.log(error);
            toast.error("Couln't get books")
        }
    }
    fetchListings()
   }, [auth.currentUser.uid])

   if(loading){
    return <Spinner />
   }

   const onDelete = async (e) =>{
    const listingId = e.target.parentElement.parentElement.id;
    if(window.confirm('Are you sure')){
        await deleteDoc(doc(db, 'books', listingId))

        const updatedListings = listings.filter((listing) => listing.id !== listingId)

        setListings(updatedListings)

        toast.success('Book deleted successfully')
    }
   }


    return (
        <section id="home">
            <Grid container>
              <Grid className='item-1' item md={12} sm={12}>
                <h2 className='section-title'>Rating</h2>
                {ratings.map((rating) =>{
                    return(
                     <div className="rating-container" key={rating}>
                        <div className="star-container">
                        <Rating defaultValue={rating} id='rating' name="half-rating" readOnly precision={0.5} />
                        </div>
                        <div draggable className="image-container">
                            {listings
                             .filter(listing => listing.data.rating === `${rating}`)
                             .map((listing) =>(
                                        <img key={listing.id} src={listing.data.imgUrls[0]} alt={listing.data.title} />
                                 ))
                            }
                        </div>
                     </div>
                    )
 
                })}
            
              </Grid>
              <h2 className="section-title">
                 Your Books
                </h2>
              <Grid className='item-2' item md={12} sm={12}>
                {listings.length > 0 ? listings.map(listing =>(
                     <div className="book-container" id={listing.id} key={listing.id}>
                    <DeleteIcon className='delete-icon' onClick={onDelete} />
                     <div className="image-container">
                         <img src={listing.data.imgUrls[0]} alt="book" />
                     </div>
                     <div className="text-container">
                         <h2>{listing.data.title}</h2>
                         <h4>{listing.data.author}</h4>
                         <h4 className='geners'>Type/{listing.data.type}</h4>
                         <Rating defaultValue={+listing.data.rating} id='rating' name="half-rating" readOnly precision={0.5} />
                         <p>{listing.data.description}</p>
                     </div>
                 </div>
                )) : <p>You haven't add book yet...</p>}
              </Grid>
            </Grid>
        </section>
    )
}

export default Home
