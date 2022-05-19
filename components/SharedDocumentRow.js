import Button from "@material-tailwind/react/Button";
import Icon from "@material-tailwind/react/Icon";
import { useRouter } from "next/dist/client/router";
import { useCollectionOnce } from "react-firebase-hooks/firestore";
import { db } from '../firebase';
import { getSession, useSession } from 'next-auth/client'
import { useState, useEffect } from "react";

const DocumentRow = ({ fileId, dateShared, owner }) => {
    const [snapshot, loadingSnapshot] = useState({});
    useEffect(() => {
     fetch() 
    }, [])
    const [session] = useSession();

    
 
    const router = useRouter()
    const fetch = async() => await db.collection("userDocs")
            .doc(owner)
            .collection("docs").doc(fileId).get().then(doc =>loadingSnapshot(doc.data()))
console.log(snapshot)   
    return (
        <div onClick={() => router.push(`/doc/${fileId}?owner=${owner}`)} className="flex items-center p-4 rounded-lg hover:bg-gray-100 text-gray-700 text-sm cursor-pointer">
            <Icon name="article" size="3xl" color="blue" />
            <p className="flex-grow pl-5 w-10 pr-10 truncate">{snapshot?.fileName}</p>
            <p className="pr-5 text-sm">{dateShared?.toDate().toLocaleDateString()}</p>
            <p className="pr-5 text-sm">Owner : {owner}</p>
           
            <Button
                color="gray"
                buttonType="outline"
                rounded={true}
                iconOnly={true}
                ripple="dark"
                className="border-0"
            >
                <Icon name="more_vert" size="3xl" />
            </Button>
        </div>
    );
}

export default DocumentRow;