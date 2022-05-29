import Head from 'next/head'
import Header from '../components/Header'
import Button from "@material-tailwind/react/Button";
import Icon from "@material-tailwind/react/Icon";
import Image from 'next/image'
import add from '../public/add.png'
import { getSession, useSession } from 'next-auth/client'
import Login from '../components/Login';
import Modal from '@material-tailwind/react/Modal'
import ModalBody from '@material-tailwind/react/ModalBody'
import ModalFooter from '@material-tailwind/react/ModalFooter'
import { useState } from 'react';
import { db } from '../firebase';
import firebase from 'firebase';
import { useCollectionOnce } from 'react-firebase-hooks/firestore'
import DocumentRow from '../components/DocumentRow';
import SharedDocumentRow from '../components/SharedDocumentRow';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import { ContentState, convertFromHTML, convertToRaw, EditorState } from 'draft-js';

export default function Home() {

    const [session] = useSession();
    const router = useRouter();
    const [deleting, setloading] = React.useState(false);
    const [deleted, setDeleted] = React.useState(false);

    if (!session)
        return <Login />


    const [showModal, setShowModal] = useState(false);
    const [input, setInput] = useState('');
    const [showModalUpload, setShowModalUpload] = useState(false);
    const [snapshot] = useCollectionOnce(
        db.collection("userDocs")
            .doc(session.user.email)
            .collection("docs")
            .orderBy("timestamp", "desc")
    );

    const [shared] = useCollectionOnce(
        db.collection("shareDocs")
            .doc(session.user.email)
            .collection("sharedDocs")
            .orderBy("timestamp", "desc")
    );

    const createDocument = () => {
        if (!input)
            return;

       db.collection("userDocs")
            .doc(session.user.email)
            .collection("docs")
            .add({
                fileName: input,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).then((_data) => {
                setInput('');
                setShowModal(false);
                _data.get().then((_data) => {
                    router.replace(`/doc/${_data.id}`);
                });
            })

        // window.location.reload();
    };
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const onUpload = (e) => {
        // setLoading(true);
        const file = e.target.files[0];
        const fileName = file.name;
        const fomrdat = new FormData();
        fomrdat.append("file", file);
        fomrdat.append("fileName", fileName);
        fetch("http://localhost:3001/upload/single", {
          method: "POST",
        //   headers: {
        //     "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
        //   },
          body: fomrdat,
        })
          .then((res) => res.json())
            .then((data) => {
              
              
                    const sampleMarkup = `<div>${data.html}</div>`;
                  console.log(sampleMarkup);
                  const blocksFromHTML = convertFromHTML(sampleMarkup);
                  const state = ContentState.createFromBlockArray(
                    blocksFromHTML.contentBlocks,
                    blocksFromHTML.entityMap,
                  );
                    setEditorState(EditorState.createWithContent(state));
                    

                setShowModalUpload(false);
            db.collection("userDocs")
            .doc(session.user.email)
            .collection("docs")
            .add({
                fileName: data.filename,
                editorState: convertToRaw(EditorState.createWithContent(state).getCurrentContent()),
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).then((_data) => {
               
                _data.get().then((_data) => {
                    console.log(_data);
                    router.replace(`/doc/${_data.id}`);
                });
            })

                // window.location.reload();
            })
       
        
    };


    const modal = (
        <Modal
            size="sm"
            active={showModal}
            toggler={() => setShowModal(false)}
        >
            <ModalBody>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    type="text"
                    className="outline-none w-full"
                    placeholder="Enter the document name ..."
                    onKeyDown={(e) => e.key === "Enter" && createDocument()}
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
                <Button
                    color="blue"
                    onClick={createDocument}
                    ripple="light"
                >
                    Create
                </Button>
            </ModalFooter>
        </Modal>
    )

    const upload_modal = (
        <Modal
            size="sm"
            active={showModalUpload}
            toggler={() => setShowModalUpload(false)}
        >
            <ModalBody>
                {/* //file upload */}
                <input
                    type="file"
                    onChange={onUpload}
                />
            </ModalBody>
            <ModalFooter>
                <Button
                    color="blue"
                    buttonType="link"
                    onClick={(e) => setShowModalUpload(false)}
                    ripple="dark"
                >
                    Cancel
                </Button>
                {/* <Button
                    color="blue"
                    onClick={createDocument}
                    ripple="light"
                >
                    Create
                </Button> */}
            </ModalFooter>
        </Modal>
    )


    return (
        <div>
            <Head>
                <title>DOCK</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header />

            {modal}
            {upload_modal}

            <section className="bg-[#F8F9FA] pb-10 px-10">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center justify-between">
                        
                        {/* <Button
                            color="gray"
                            buttonType="outline"
                            rounded={true}
                            ripple="dark"
                            className="border-0"
                        >
                            <Icon name="more_vert" size="3xl" />
                        </Button> */}
                    </div>
                    <div>
                        <div onClick={() => setShowModal(true)} className="relative w-100 py-6 cursor-pointer">
                        <Button
                            color="green"
                            buttonType="contained"
                            rounded={true}
                            ripple="dark"
                            className="border-0"
                        >
                            Create Blank Document
                        </Button>
                        </div>
                        <div onClick={() => setShowModalUpload(true)} className="relative w-100 py-6 cursor-pointer">
                        <Button
                            color="green"
                            buttonType="contained"
                            rounded={true}
                            ripple="dark"
                            className="border-0"
                        >
                            Upload Document
                        </Button>
                        </div>
                       
                    </div>
                </div>
            </section>
            <section className="bg-white px-10 md:px-0">
                <div className="max-w-3xl mx-auto py-8 text-sm text-gray-700">
                    <div className="flex items-center justify-between pb-5">
                        <h2 className="font-medium flex-grow">My Documents</h2>
                        <h2 className="mr-12">Date Created</h2>
                        <Icon name="folder" size="3xl" color="gray" />
                    </div>
                    {
                        deleting && <>
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
  <strong className="font-bold">Deleting...</strong>
  <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
    <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
  </span>
</div>
                        </>
                    }

                    {snapshot?.docs.map(doc => (
                        <DocumentRow
                            key={doc.id}
                            id={doc.id}
                            fileName={doc.data().fileName}
                            date={doc.data().timestamp}
                            setloading={setloading}
                            setDeleted={setDeleted}
                        />
                    ))}
                    {
                        shared?.docs.map(doc => (
                            <SharedDocumentRow
                                key={doc.id}
                                id={doc.id}
                                fileId={doc.data().file_id}
                                dateShared={doc.data().timestamp}
                                owner={doc.data().owner}
                                setloading={setloading}
                                setDeleted={setDeleted}

                            />
                        ))
                    }
                    
                </div>
            </section>
        </div>
    );
}

export async function getServerSideProps(context) {
    const session = await getSession(context);

    return {
        props: {
            session,
        },
    };
}