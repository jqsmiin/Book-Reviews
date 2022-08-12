import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function useAuthStatus(){

   const [loggedIn, setLoggedIn] = useState(false)
   const [checkedStatus,setCheckingStatus] = useState(true)

   useEffect(() =>{
     const auth = getAuth()
     onAuthStateChanged(auth, (user) =>{
        if(user){
            setLoggedIn(true)
        }
        setCheckingStatus(false)
     })
   })

   return {loggedIn,checkedStatus}


}

export default useAuthStatus

