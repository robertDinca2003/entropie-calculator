import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [mesaj, setMesaj] = useState("");
  let litere = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0,
  ];
  let procente = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0,
  ];
  let totAscii = [];
  let procenteTotAscii = [];
  const [valori, setValori] = useState([]);
  const [procentaj, setProcentaj] = useState([]);
  const [entropieLitere, setEntropieLitere] = useState(0);
  const [procentajAscii, setProcentajAscii] = useState([]);
  const [entropieAscii, setEntropieAscii] = useState(0);
  useEffect(() => {
    console.log(mesaj);
  }, [mesaj]);

  const entropieMesaj = () => {
    if (mesaj.length < 1) return;
    for (let i = 0; i < 26; i++) litere[i] = 0;
    for (let i = 0; i < 1001; i++) (totAscii[i] = 0), (procenteTotAscii[i] = 0);

    const lungime = mesaj.length;
    for (let i = 0; i < lungime; i++) {
      if (mesaj[i].charCodeAt(0) >= 65 && mesaj[i].charCodeAt(0) <= 90) {
        litere[mesaj[i].charCodeAt(0) - 65] += 1;
      }
      if (mesaj[i].charCodeAt(0) >= 97 && mesaj[i].charCodeAt(0) <= 122) {
        litere[mesaj[i].charCodeAt(0) - 97] += 1;
      }
      totAscii[mesaj[i].charCodeAt(0)]++;
    }

    console.log(litere);
    setValori(litere);

    let totalLiter = 0;

    for (let i = 0; i < 26; i++) totalLiter += litere[i];

    for (let i = 0; i < 26; i++) {
      procente[i] = (litere[i] / totalLiter) * 100;
    }
    for (let i = 0; i < 1001; i++) {
      procenteTotAscii[i] = (totAscii[i] / lungime) * 100;
    }
    setProcentaj(procente);
    setProcentajAscii(procenteTotAscii);
    let proba = 0;
    for (let i = 0; i < 26; i++) proba += procente[i];
    console.log("totalul este ", proba);

    let entropie = 0;

    for (let i = 0; i < 26; i++) {
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
    entropieMesaj();
  };

  return (
    <main
      className={`flex gap-10 flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <h1>Calculator de entropie a textului</h1>
      <h2>
        (entropia este calculata doar la nivelul literelor din alfabet, se
        exclud automat toate simbolurile, cifrele si semnele de punctuatie)
      </h2>
      <h2>Introduce un text de maxim 5000 de caractere</h2>
      <h2>Introdu un fisier propriu(pdf):</h2>
      <form onSubmit={pdfCitire} className="flex flex-row justify-between">
        <input type="file" name="inpFile" id="inpFile" />
        <button type="submit" id="btnUpdate">
          Upload
        </button>
      </form>
      <textarea
        placeholder="Introduce textul aici"
        onChange={(e) => {
          setMesaj(e.target.value);
        }}
        className="border-2 border-black rounded-[30px] w-[50vw] py-2 px-4"
        type="text"
        rows={20}
      />
      <button
        onClick={entropieMesaj}
        className="rounded-lg min-w-[10vw]  border-4 p-2 border-black hover:bg-black hover:text-slate-100 transition-all duration-200"
      >
        Proceseaza
      </button>
      <h2>Numarul aparitilor din textul dat: </h2>
      <div className="grid grid-rows-4 grid-cols-7 gap-5 justify-center">
        {valori.map((val, key) => {
          return (
            <h1 key={key}>
              {String.fromCharCode(key + 65)}:{val}
            </h1>
          );
        })}
      </div>
      <div className="grid grid-rows-4 grid-cols-7 gap-5 justify-center">
        {procentaj.map((val, key) => {
          return (
            <h1 key={key}>
              {String.fromCharCode(key + 65)}:{Math.round(val * 100) / 100}%
            </h1>
          );
        })}
      </div>
      <h1>
        Entropia literelor (fara case sensitive) din textul dat este:{" "}
        {entropieLitere}
      </h1>

      <h1>
        Entropia tuturor caracterelor din textul dat este: {entropieAscii}
      </h1>
      <div className="grid grid-rows-32 grid-cols-8 gap-5 justify-center">
        {procentajAscii.map((val, key) => {
          if (val == 0) return;
          return (
            <h1 key={key}>
              {key !== 32 ? String.fromCharCode(key) : "Space"}:
              {Math.round(val * 100) / 100}%
            </h1>
          );
        })}
      </div>
    </main>
  );
}
