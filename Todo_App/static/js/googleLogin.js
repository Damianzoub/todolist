import { account } from "./static/js/appwrite";

/*I HAVE TO FIX THE '' UNDER THE GOOGLE*/
document.addEventListener('DOMContentLoaded',()=>{
    const googleButton = document.getElementById('google-signup');
    
    if (googleButton){
        googleButton.addEventListener('click', ()=>{
            account.createOAuth2Session(
                'google',
                '', /* That is if the sign up is succesful */
                'http://127.0.0.1:5000/auth/register' /*That is if the sign up is not succesful*/
            )
        })
    }
})