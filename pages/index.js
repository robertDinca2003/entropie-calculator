import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [mesaj, setMesaj] = useState("");
  let litere = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0,
  ];
  let procente = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0,
  ];
  let totAscii = [];
  let procenteTotAscii = [];
  let huffman = [];
  const [valori, setValori] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0,
  ]);
  const [procentaj, setProcentaj] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0,
  ]);
  const [entropieLitere, setEntropieLitere] = useState(0);
  const [procentajAscii, setProcentajAscii] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0,
  ]);
  const [entropieAscii, setEntropieAscii] = useState(0);
  const [huffmanCode, setHuffmanCode] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0,
  ]);
  const [cripted, setCripted] = useState("");
  class HuffmanNode {
    constructor() {
      this.data = 0;
      this.ch = "";
      this.left = this.right = null;
    }
  }
  const genCode = (root, s) => {
    if (
      root.left == null &&
      root.right == null &&
      ((root.c.charCodeAt(0) >= 65 && root.c.charCodeAt(0) <= 90) ||
        root.c.charCodeAt(0) == 32)
    )
      if (root.c === "Space") {
        huffman[26] = s;
        return;
      } else {
        huffman[root.c.charCodeAt(0) - 65] = s;
        return;
      }
    genCode(root.left, s + "0");
    genCode(root.right, s + "1");
  };

  useEffect(() => {
    console.log(mesaj);
  }, [mesaj]);

  const entropieMesaj = () => {
    if (mesaj.length < 1) return;
    for (let i = 0; i <= 26; i++) {
      litere[i] = 0;
      huffman[i] = "";
    }
    for (let i = 0; i < 1001; i++) (totAscii[i] = 0), (procenteTotAscii[i] = 0);

    const lungime = mesaj.length;
    for (let i = 0; i < lungime; i++) {
      if (mesaj[i].charCodeAt(0) >= 65 && mesaj[i].charCodeAt(0) <= 90) {
        litere[mesaj[i].charCodeAt(0) - 65] += 1;
      }
      if (mesaj[i].charCodeAt(0) >= 97 && mesaj[i].charCodeAt(0) <= 122) {
        litere[mesaj[i].charCodeAt(0) - 97] += 1;
      }
      if (mesaj[i].charCodeAt(0) == 32) litere[26] += 1;
      totAscii[mesaj[i].charCodeAt(0)]++;
    }

    console.log(litere);
    setValori(litere);

    let totalLiter = 0;

    for (let i = 0; i <= 26; i++) totalLiter += litere[i];

    for (let i = 0; i <= 26; i++) {
      procente[i] = (litere[i] / totalLiter) * 100;
    }
    for (let i = 0; i < 1001; i++) {
      procenteTotAscii[i] = (totAscii[i] / lungime) * 100;
    }
    setProcentaj(procente);
    setProcentajAscii(procenteTotAscii);
    let proba = 0;
    for (let i = 0; i <= 26; i++) proba += procente[i];
    console.log("totalul este ", proba);

    let entropie = 0;

    for (let i = 0; i <= 26; i++) {
      if (procente[i] == 0) continue;
      entropie += (procente[i] / 100) * Math.log2(100 / procente[i]);
    }
    setEntropieLitere(entropie);
    entropie = 0;
    for (let i = 0; i < 1001; i++) {
      if (procenteTotAscii[i] == 0) continue;
      entropie +=
        (procenteTotAscii[i] / 100) * Math.log2(100 / procenteTotAscii[i]);
    }

    setEntropieAscii(entropie);
    entropie = 0;
    let q = [];
    for (let i = 0; i <= 26; i++) {
      if (litere[i] == 0) continue;
      let huffN = new HuffmanNode();
      if (i < 26) huffN.c = String.fromCharCode(i + 65);
      else huffN.c = "Space";
      huffN.data = procente[i];
      huffN.left = null;
      huffN.right = null;
      q.push(huffN);
    }

    let root = null;
    q.sort(function (a, b) {
      return a.data - b.data;
    });

    while (q.length > 1) {
      let x = q[0];
      q.shift();
      let y = q[0];
      q.shift();
      let f = new HuffmanNode();
      f.data = x.data + y.data;
      f.c = "+";
      f.left = x;
      f.right = y;
      root = f;
      q.push(f);
      q.sort(function (a, b) {
        return a.data - b.data;
      });
    }
    genCode(root, "");
    console.log(huffman);
    setHuffmanCode(huffman);

    let mesajcriptat = "";

    if (lungime > 5500) {
      setCripted("Mesajul are peste 5000 de caractere");
    } else {
      for (let i = 0; i < lungime; i++) {
        if (
          mesaj[i].toUpperCase().charCodeAt(0) >= 65 &&
          mesaj[i].toUpperCase().charCodeAt(0) <= 90
        )
          mesajcriptat =
            mesajcriptat + huffman[mesaj[i].toUpperCase().charCodeAt(0) - 65];
        if (mesaj[i].charCodeAt(0) == 32)
          mesajcriptat = mesajcriptat + huffman[26];
      }
      setCripted(mesajcriptat);
    }
  };

  function file2Buffer(file) {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      const readFile = function (event) {
        const buffer = reader.result;
        resolve(buffer);
      };

      reader.addEventListener("load", readFile);
      reader.readAsArrayBuffer(file);
    });
  }

  const pdfCitire = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);

    const file = data.get("inpFile");
    const fileText = await file.text();
    console.log(JSON.stringify(fileText));
    // axios.post("http://localhost:3000/api/hello", { txt: fileText });
    setMesaj(fileText);
    entropieMesaj(mesaj);
  };

  return (
    <main
      className={`flex bg-slate-100 gap-10 flex-col items-center justify-between py-12 lg:p-24 px-4 sm:px-8 md:px-12 lg:px-24 ${inter.className}`}
    >
      <h1 className="italic font-bold lg:text-7xl md:text-5xl sm:text-4xl xsm:text-3xl text-xl text-center">
        Calculator de entropie a textului
      </h1>

      <h2 className="text-xl text-center sm:text-2xl md:text-3xl lg:text-4xl">
        Introduce un text de maxim 5000 de caractere
      </h2>
      <h2 className="text-center text-lg sm:text-xl md:text-2xl lg:text-3xl">
        Introdu un fisier propriu(doar txt):
      </h2>
      <form
        onSubmit={pdfCitire}
        className="flex gap-5 flex-col md:flex-row justify-center content-center self-center items-center md:justify-between"
      >
        <input
          type="file"
          name="inpFile"
          id="inpFile"
          className="self-center items-center w-[80%] md:w-[340px] justify-center content-center "
        />
        <button
          type="submit"
          id="btnUpdate"
          className="border-2 border-black p-2 rounded-md hover:bg-black hover:text-slate-100 transition-colors duration-200"
        >
          Upload
        </button>
      </form>
      <textarea
        placeholder="Introduce textul aici"
        onChange={(e) => {
          setMesaj(e.target.value);
        }}
        className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[50%] border-2 border-black rounded-[30px]  py-2 px-4"
        type="text"
        rows={20}
      />
      <button
        onClick={entropieMesaj}
        className="rounded-lg min-w-[10vw]  border-4 p-2 border-black hover:bg-black hover:text-slate-100 transition-all duration-200"
      >
        Proceseaza
      </button>
      <h2 className="text-center text-lg sm:text-xl md:text-2xl lg:text-3xl">
        Numarul aparitilor din textul dat:{" "}
      </h2>
      <div className="border-2 p-4 text-sm xsm:text-md sm:text-lg rounded-[20px] w-[100%] border-black grid grid-cols-2 xsm:grid-cols-3 md:grid-cols-5 md:grid-rows-6 lg:grid-rows-4 lg:grid-cols-7 gap-5 justify-center">
        {valori.map((val, key) => {
          return (
            <h1
              className="border-2 py-1 px-2 rounded-lg border-black"
              key={key}
            >
              {key == 26 ? "Space" : String.fromCharCode(key + 65)}:{val}
            </h1>
          );
        })}
      </div>

      <h2 className="text-center text-lg sm:text-xl md:text-2xl lg:text-3xl">
        Numarul procentual de aparitii din text
      </h2>
      <div className="border-2 p-8 text-sm xsm:text-md sm:text-lg rounded-[20px] border-black grid grid-cols-2 xsm:grid-cols-3 md:grid-cols-5 md:grid-rows-6 lg:grid-rows-4 lg:grid-cols-7 gap-5 justify-center w-[100%]  items-center">
        {procentaj.map((val, key) => {
          return (
            <h1
              className="border-2 py-1 px-1 rounded-lg border-black"
              key={key}
            >
              {key == 26 ? "Space" : String.fromCharCode(key + 65)}:
              {Math.round(val * 100) / 100}%
            </h1>
          );
        })}
      </div>
      <h2 className="text-center text-lg sm:text-xl md:text-2xl lg:text-3xl">
        Codul Huffman pentru aparitiile de mai sus
      </h2>
      <div className="border-2 p-8 text-sm xsm:text-md sm:text-lg rounded-[20px] border-black grid grid-cols-1 xsm:grid-cols-2 md:grid-cols-4 md:grid-rows-6 lg:grid-rows-4 lg:grid-cols-7 gap-5 justify-center w-[100%]  items-center">
        {huffmanCode.map((val, key) => {
          if (val == "") return;
          return (
            <h1
              className="border-2 py-1 px-1 rounded-lg border-black"
              key={key}
            >
              {key == 26 ? "Space" : String.fromCharCode(key + 65)}:{val}
            </h1>
          );
        })}
      </div>
      <h1 className="text-center text-lg sm:text-xl md:text-2xl lg:text-3xl">
        Textul initial criptat folosind codul Huffman (doar litere mari si
        spatii):
      </h1>
      <textarea
        readOnly
        className="w-[90vw] text-start bg-transparent text-lg sm:text-xl md:text-2xl lg:text-3xl p-2 border-2 rounded-lg border-black"
      >
        {cripted}
      </textarea>
      <h1 className="text-center text-lg sm:text-xl md:text-2xl lg:text-3xl">
        Entropia literelor (fara case sensitive si semne de punctiatie) din
        textul dat este: {entropieLitere}
      </h1>

      <h1 className="text-center text-lg sm:text-xl md:text-2xl lg:text-3xl">
        Entropia tuturor caracterelor din textul dat este: {entropieAscii}
      </h1>
      <div className="border-2 w-[100%]  p-4 text-sm xsm:text-md sm:text-lg rounded-[20px] border-black grid grid-cols-2 xsm:grid-cols-3 md:grid-cols-5  lg:grid-cols-7 gap-5 justify-center">
        {procentajAscii.map((val, key) => {
          if (val == 0) return;
          return (
            <h1
              className="py-1 px-1 border-2 border-black rounded-lg"
              key={key}
            >
              {key !== 32 ? String.fromCharCode(key) : "Space"}:
              {Math.round(val * 100) / 100}%
            </h1>
          );
        })}
      </div>
    </main>
  );
}
