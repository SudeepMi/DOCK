import Button from "@material-tailwind/react/Button";
import Icon from "@material-tailwind/react/Icon";
import { useRouter } from "next/dist/client/router";
import {db} from "../firebase";
import { useSession } from "next-auth/client";

const DocumentRow = ({ id, fileName, date }) => {

    const router = useRouter()
  const [session] = useSession();


    const deleteDoc = () => {
        db.collection("userDocs").doc(session.user.email).collection("docs").doc(id).delete()
        window.location.reload();
    }

    return (
        <div className="flex items-center p-4 rounded-lg hover:bg-gray-100 text-gray-700 text-sm cursor-pointer">
            <div onClick={() => router.push(`/doc/${id}`)} className="align-middle flex flex-1 items-center">
            <Icon name="article" size="3xl" color="blue" />
            <p className="flex-grow pl-5 w-10 pr-10 truncate">{fileName}</p>
            <p className="pr-5 text-sm">{date?.toDate().toLocaleDateString()}</p>
            </div>
            <Button
                color="gray"
                buttonType="outline"
                rounded={true}
                iconOnly={true}
                ripple="dark"
                className="border-0"
                onClick={()=>deleteDoc()}
            >
                <Icon name="delete" size="2xl" />
            </Button>
        </div>
    );
}

export default DocumentRow;