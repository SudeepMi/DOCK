import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { AtomicBlockUtils, EditorState } from "draft-js";
import { db } from "../firebase";
import { useRouter } from "next/dist/client/router";
import { convertFromRaw, convertToRaw } from "draft-js";
import { useSession } from "next-auth/client";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import createImagePlugin from "@draft-js-plugins/image";

const imagePlugin = createImagePlugin();

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((module) => module.Editor),
  {
    ssr: false,
  }
);

function TextEditor({ setSaving }) {
  const [session] = useSession();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [uploadedImages, setUploadedImages] = useState([])
  const router = useRouter();
  const { id } = router.query;
  const { owner } = router.query;
  const [snapshot] = useDocumentOnce(
    db
      .collection("userDocs")
      .doc(owner ? owner : session.user.email)
      .collection("docs")
      .doc(id)
  );

  useEffect(() => {
    if (snapshot?.data()?.editorState) {
      setEditorState(
        EditorState.createWithContent(
          convertFromRaw(snapshot?.data()?.editorState)
        )
      );
    }
  }, [snapshot]);

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    setSaving(true);
    // console.log(convertToRaw(editorState.getCurrentContent()));
    db.collection("userDocs")
      .doc(owner ? owner : session.user.email)
      .collection("docs")
      .doc(id)
      .set(
        {
          editorState: convertToRaw(editorState.getCurrentContent()),
        },
        {
          merge: true,
        }
      ).then(() => {
        setSaving(false);
      });
  };

  const insertImage = (file) => {
    let uploadedImages = [...uploadedImages];

    const imageObject = {
      file: file,
      localSrc: URL.createObjectURL(file),
    }

    uploadedImages.push(imageObject);
    
    return new Promise(
      (resolve, reject) => {
        resolve({ data: { link: imageObject.localSrc } });
      }
    );
  };

  const toolBarOption = {
    options: [
      "inline",
      "blockType",
      "fontSize",
      "fontFamily",
      "list",
      "textAlign",
      "colorPicker",
      "link",
      "embedded",
      "emoji",
      "image",
      "remove",
      "history",
    ],
    inline: {
      inDropdown: false,
      className: undefined,
      component: undefined,
      dropdownClassName: undefined,
      options: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "monospace",
        "superscript",
        "subscript",
      ],
    },
    blockType: {
      inDropdown: true,
      options: [
        "Normal",
        "H1",
        "H2",
        "H3",
        "H4",
        "H5",
        "H6",
        "Blockquote",
        "Code",
      ],
      className: undefined,
      component: undefined,
      dropdownClassName: undefined,
    },
    fontSize: {
      options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
      className: undefined,
      component: undefined,
      dropdownClassName: undefined,
    },
    fontFamily: {
      options: [
        "Arial",
        "Georgia",
        "Impact",
        "Tahoma",
        "Times New Roman",
        "Verdana",
        "Ubuntu",
        "Raleway",
      ],
      className: undefined,
      component: undefined,
      dropdownClassName: undefined,
    },
    list: {
      inDropdown: true,
      className: undefined,
      component: undefined,
      dropdownClassName: undefined,
      options: ["unordered", "ordered", "indent", "outdent"],
    },
    textAlign: {
      inDropdown: true,
      className: undefined,
      component: undefined,
      dropdownClassName: undefined,
      options: ["left", "center", "right", "justify"],
    },
    colorPicker: {
      className: undefined,
      component: undefined,
      popupClassName: undefined,
      colors: [
        "rgb(97,189,109)",
        "rgb(26,188,156)",
        "rgb(84,172,210)",
        "rgb(44,130,201)",
        "rgb(147,101,184)",
        "rgb(71,85,119)",
        "rgb(204,204,204)",
        "rgb(65,168,95)",
        "rgb(0,168,133)",
        "rgb(61,142,185)",
        "rgb(41,105,176)",
        "rgb(85,57,130)",
        "rgb(40,50,78)",
        "rgb(0,0,0)",
        "rgb(247,218,100)",
        "rgb(251,160,38)",
        "rgb(235,107,86)",
        "rgb(226,80,65)",
        "rgb(163,143,132)",
        "rgb(239,239,239)",
        "rgb(255,255,255)",
        "rgb(250,197,28)",
        "rgb(243,121,52)",
        "rgb(209,72,65)",
        "rgb(184,49,47)",
        "rgb(124,112,107)",
        "rgb(209,213,216)",
      ],
    },
    link: {
      inDropdown: true,
      className: undefined,
      component: undefined,
      popupClassName: undefined,
      dropdownClassName: undefined,
      showOpenOptionOnHover: true,
      defaultTargetOption: "_self",
      options: ["link", "unlink"],
      linkCallback: undefined,
    },
    emoji: {
      className: undefined,
      component: undefined,
      popupClassName: undefined,
      emojis: [
        "😀",
        "😁",
        "😂",
        "😃",
        "😉",
        "😋",
        "😎",
        "😍",
        "😗",
        "🤗",
        "🤔",
        "😣",
        "😫",
        "😴",
        "😌",
        "🤓",
        "😛",
        "",
        "😠",
        "😇",
        "😷",
        "😈",
        "👻",
        "😺",
        "😸",
        "😹",
        "😻",
        "😼",
        "😽",
        "🙀",
        "🙈",
        "🙉",
        "",
        "👼",
        "👮",
        "🕵",
        "💂",
        "👳",
        "🎅",
        "👸",
        "👰",
        "👲",
        "🙍",
        "🙇",
        "🚶",
        "🏃",
        "💃",
        "⛷",
        "🏂",
        "🏌",
        "🏄",
        "🚣",
        "🏊",
        "⛹",
        "🏋",
        "🚴",
        "👫",
        "💪",
        "👈",
        "👉",
        "👉",
        "👆",
        "🖕",
        "👇",
        "",
        "🤘",
        "🖐",
        "👌",
        "👍",
        "👎",
        "✊",
        "👊",
        "👏",
        "🙌",
        "🙏",
        "🐵",
        "🐶",
        "🐇",
        "🐥",
        "🐸",
        "",
        "🐛",
        "🐜",
        "🐝",
        "🍉",
        "🍄",
        "🍔",
        "🍤",
        "🍨",
        "🍪",
        "🎂",
        "🍰",
        "🍾",
        "🍷",
        "🍸",
        "🍺",
        "🌍",
        "🚑",
        "⏰",
        "🌙",
        "🌝",
        "🌞",
        "⭐",
        "🌟",
        "🌠",
        "🌨",
        "🌩",
        "⛄",
        "🔥",
        "🎄",
        "🎈",
        "🎉",
        "🎊",
        "🎁",
        "🎗",
        "🏀",
        "🏈",
        "🎲",
        "🔇",
        "🔈",
        "📣",
        "�",
        "🎵",
        "🎷",
        "💰",
        "🖊",
        "📅",
        "✅",
        "❎",
        "💯",
      ],
    },
    embedded: {
      className: undefined,
      component: undefined,
      popupClassName: undefined,
      embedCallback: undefined,
      defaultSize: {
        height: "auto",
        width: "auto",
      },
    },
    image: {
      className: undefined,
      component: undefined,
      popupClassName: undefined,
      urlEnabled: true,
      uploadEnabled: true,
      alignmentEnabled: true,
      uploadCallback: insertImage,
      previewImage: true,
      inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg",
      alt: { present: false, mandatory: false },
      defaultSize: {
        height: "auto",
        width: "auto",
      },
    },
    remove: { className: undefined, component: undefined },
    history: {
      inDropdown: true,
      className: undefined,
      component: undefined,
      dropdownClassName: undefined,
      options: ["undo", "redo"],
      //   undo: { icon: 'undo', className: undefined },
      //   redo: { icon: 'redo', className: undefined },
    },
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-16">
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        toolbarClassName="flex sticky top-0 z-50 !justify-center mx-auto"
        editorClassName="mt-6 p-10 bg-white shadow-lg max-w-5xl mx-auto mb-12 border"
        toolbar={toolBarOption}
        plugins={[imagePlugin]}
        hashtag={{
          separator: ' ',
          trigger: '#',
        }}
        mention={{
          separator: ' ',
          trigger: '@',
          suggestions: [
            { text: 'APPLE', value: 'apple', url: 'apple' },
            { text: 'BANANA', value: 'banana', url: 'banana' },
            { text: 'CHERRY', value: 'cherry', url: 'cherry' },
            { text: 'DURIAN', value: 'durian', url: 'durian' },
            { text: 'EGGFRUIT', value: 'eggfruit', url: 'eggfruit' },
            { text: 'FIG', value: 'fig', url: 'fig' },
            { text: 'GRAPEFRUIT', value: 'grapefruit', url: 'grapefruit' },
            { text: 'HONEYDEW', value: 'honeydew', url: 'honeydew' },
          ],
        }}
      />
    </div>
  );
}

export default TextEditor;
