import Button from "@material-tailwind/react/Button";
import Icon from "@material-tailwind/react/Icon";
import { useRouter } from "next/dist/client/router";
import { db } from "../../firebase";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import { getSession, signOut, useSession } from "next-auth/client";
import Login from "../../components/Login";
import TextEditor from "../../components/TextEditor";
import Modal from "@material-tailwind/react/Modal";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import { useState } from "react";
import firebase from "firebase";
import draftToHtml from "draftjs-to-html";
// import Timestamp from "firebase.timestamp";

const Doc = () => {
  const [session] = useSession();
  const [showModal, setShowModal] = useState(false);
  const [userShare, setUserShare] = useState("");
  const [loading, setLoading] = useState("");

  if (!session) return <Login />;

  const router = useRouter();
  const { id } = router.query;
  const { owner } = router.query;

  const [snapshot, loadingSnapshot] = useDocumentOnce(
    db
      .collection("userDocs")
      .doc(owner ? owner : session.user.email)
      .collection("docs")
      .doc(id)
  );

  if (!loadingSnapshot && !snapshot?.data()?.fileName) {
    router.replace("/");
  }

  const shareDocument = () => {
    if (userShare) {
      db.collection("shareDocs").doc(userShare).collection("sharedDocs").add({
        file_id: id,
        owner: session.user.email,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      setUserShare("");
      setShowModal(false);
      window.location.reload();
    } else {
      alert("Please enter a valid email address");
    }
  };

  const onExport = (downloadFileName) => {
    setLoading(true);
    const data = snapshot.data().editorState;
    const mdData = draftToHtml(data);
    const string = `<div>${mdData}</div>`;

    fetch("http://localhost:3001/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        string,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.file);
        fetch(`http://localhost:3001/?file_name=${data.file}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/pdf",
          },
        })
          .then((res) => res.blob())
          .then((blob) => {
            var blob = new Blob([blob], { type: "application/pdf" });
            const fileURL = URL.createObjectURL(blob);
            setLoading(false);
            window.open(fileURL);

          });
      });
  };

  const [saving, setSaving] = useState(false);

  return (
    <div>
      { loading ? "Loading...." : <>
      <header className="flex justify-between items-center p-3 pb-1">
        <span onClick={() => router.push("/")} className="cursor-pointer">
          <Icon name="description" size="5xl" color="green" />
        </span>
        <div className="flex-grow px-2">
          <h2>File Name: {snapshot?.data()?.fileName}</h2>
          <p className="pr-5 text-sm">
            {/* { console.log() } */}
           created on: {new Date(snapshot?.data()?.timestamp?.seconds * 1000).toLocaleDateString("en-US")}
           {saving ? <span className="mx-2">saving.....</span> : null}
          </p>
          <div className="flex items-center text-sm space-x-1 -ml-1 h-8 text-gray-500">
            <button onClick={() => onExport("Test")} className="bg-green-500 hover:bg-blue-700 text-white font-bold px-4 rounded-full">export</button>
          </div>
        </div>

        <div className="idRight hidden md:inline-flex items-center">
          <Button
            color="green"
            buttonType="filled"
            size="regular"
            className="hidden md:inline-flex h-10"
            rounded={false}
            block={false}
            iconOnly={false}
            rillple="light"
            onClick={() => setShowModal(true)}
          >
            <Icon name="people" size="md" /> SHARE
          </Button>
          {/* <img
            className="cursor-pointer rounded-full h-10 w-10 ml-2"
            src={session?.user.image}
            alt=""
          /> */}
        </div>
        <button onClick={signOut} className="mx-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
  Logout
</button>
      </header>

      <Modal
        isOpen={showModal}
        active={showModal}
        toggler={() => setShowModal(false)}
        className="mt-6 p-10 bg-white shadow-lg max-w-3xl mx-auto mb-12 border"
      >
        <ModalBody>
          <input
            value={userShare}
            onChange={(e) => setUserShare(e.target.value)}
            type="text"
            className="outline-none w-full"
            placeholder="Enter the user google email ..."
            onKeyDown={(e) => e.key === "Enter" && shareDocument()}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="blue"
            buttonType="link"
            onClick={(e) => setShowModal(false)}
            ripple="dark"
          >
            Cancel
          </Button>
          <Button color="blue" onClick={() => shareDocument()} ripple="light">
            Share
          </Button>
        </ModalFooter>
      </Modal>
      <TextEditor setSaving={setSaving}  />
      </>
  }
    </div>
  );
};

export default Doc;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
