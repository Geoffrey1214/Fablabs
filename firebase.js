import {initializeApp} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {getAuth,onAuthStateChanged,signInWithEmailAndPassword,createUserWithEmailAndPassword,signOut} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {getFirestore,doc,getDoc,setDoc,updateDoc,onSnapshot,collection,getDocs} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import {firebaseConfig} from "./firebase-config.js";
const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app),STATE=doc(db,"app","state");
window.FB={
 configured:!String(firebaseConfig.apiKey).startsWith("COLLER"),
 login:(e,p)=>signInWithEmailAndPassword(auth,e,p),
 register:async(e,p)=>{const c=await createUserWithEmailAndPassword(auth,e,p);await setDoc(doc(db,"users",c.user.uid),{email:e,role:"apprenant"});return c},
 logout:()=>signOut(auth),
 onAuth:f=>onAuthStateChanged(auth,async u=>{let role=null;if(u){try{const s=await getDoc(doc(db,"users",u.uid));role=s.exists()?s.data().role:"apprenant"}catch(e){role="apprenant"}}f(u,role)}),
 watch:(f,err)=>onSnapshot(STATE,s=>f(s.exists()?s.data().json:null),err),
 save:j=>setDoc(STATE,{json:j}),
 users:async()=>(await getDocs(collection(db,"users"))).docs.map(d=>({id:d.id,...d.data()})),
 setRole:(id,r)=>updateDoc(doc(db,"users",id),{role:r})
};
if(window.onFB)window.onFB();
