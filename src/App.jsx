import { useState, useRef, useEffect } from "react";
import Definintion from "./Definition";
import './index.css';
import { AiOutlineSearch } from "react-icons/ai";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
// import './styles-tw.css'

export default function App() {
  let [word, setWord] = useState("");
  let [load, setLoad] = useState(false);
  let [meanings, setMeanings] = useState([]);
  let searchWord = useRef();
  let loadDiv = useRef();
  let [phonetic, setPhonetic] = useState("");
  let meaningsDiv = useRef();
  let wordSection = useRef();
  let arrows = useRef();
  let maxHeight = 245;
  let loading = false;
  let [dictionary, setDictionary] = useState("");

  useEffect(() => {
    if (load) {
      loadDiv.current.style.display = "block";
    }
    else {
      loadDiv.current.style.display = "none";
    }
  });

  useEffect(() => {
    titleAnimation();
  }, []);

  const titleAnimation = () => {
    const str = "DICTIONARY";
    let tmp = "";
    let i = 0;
    let id = setInterval(frame, 150);;
    function frame() {
      if (i === str.length)
        clearInterval(id);
      else {
        tmp = tmp + str[i];
        setDictionary(tmp);
        i++;
      }
    }
  }
  

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  let goSearch = async () => {
    // console.log(searchWord.current.value);
    maxHeight = 245;
    wordSection.current.style.display = "none";
    arrows.current.style.display = "none";
    setLoad(true);
    loading = true;
    loadAnimation();
    await sleep(1000);
    let data = await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + searchWord.current.value);
    let data2 = await data.json();
    setWord(searchWord.current.value.toLowerCase());
    for (let i = 0; i < data2[0].phonetics.length; i++) {
      if (data2[0].phonetics[i].text) {
        setPhonetic(data2[0].phonetics[i].text);
        break ;
      }
    }
    searchWord.current.value = "";
    setMeanings(data2);
    // try {
      // console.log(data.json())
      // }
      // catch {
      // console.log('error')
      // }
      // console.log(data);
    setLoad(false);
    wordSection.current.style.display = "block";
    arrows.current.style.display = "flex";
    meaningsDiv.current.style.maxHeight = maxHeight + "px";
    console.log(maxHeight + "px");
    loading = false;
  }
    
  const loadAnimation = () => {
    let width = 0;
    let increment = true;
    let id = setInterval(frame, 10);
    function frame() {
      if (!loading) {
        clearInterval(id);
      }
      if (width === 100) {
        increment = false;
        loadDiv.current.style.width = width + '%';
        width--;
      }
      else if (width === 0) {
        increment = true;
        loadDiv.current.style.width = width + '%';
        width++;
      } else {
        if (increment)
          width++;
        else
          width--;
        loadDiv.current.style.width = width + '%';
      }
    }
  }

  return (
    <div className="relative flex flex-col items-center w-[90%] sm:w-[80%] lg:w-[60%] mx-auto">
      <div className="mt-[30vh]">
        <h1 className="flex justify-center items-center w-[80px] text-7xl">{ dictionary }
          <span className="translate-y-[-5px] font-thin pl-[10px] animate-[loading_1s_ease_infinite]">|</span>
        </h1>
      </div>
      {/* <button onClick={titleAnimation} >animate</button> */}
      <form onSubmit={(e) => {e.preventDefault()}} className="mt-[10vh] mb-[20px] w-full relative">
        <input ref={searchWord} type="text" placeholder="Search for a word" className="border w-full pl-[10px] pr-[30px] h-[40px] outline-0"></input>
        {/* <button type="search" onClick={goSearch} className="bg-black w-[120px] h-[40px] text-white">search</button> */}
        <button onClick={goSearch}>
          <AiOutlineSearch className="absolute top-[12px] right-[10px] cursor-pointer"/>
        </button>
      <div ref={ loadDiv } className="absolute bottom-[0px] left-0 w-[3px] h-[3px] bg-black"></div>
      </form>
      <div ref={ wordSection } className="hidden px-[20px] py-[20px] bg-gray-100 overflow-hidden w-full">
        <h1 className="text-3xl font-bold">{ word }
          <span className="text-lg font-light pl-[10px]">[{ phonetic }]</span>
        </h1>
        <hr className="border-t-1 border-black my-[15px]"></hr>
        <div ref={ meaningsDiv } className="meanings px-[10px] py[20px] overflow-hidden">
          { meanings.map((elem, index1) => {
              return (
                <div key={index1 + 1}>
                  {elem.meanings.map((mean, index2) => {
                    // console.log(mean);
                    return <Definintion type={ mean.partOfSpeech } meaning={ mean.definitions } key={index2 + 1}/>;
                  })}
                </div>
              )
            })
          }
        </div>
      </div>
      <div ref={ arrows } className="hidden gap-[10px] self-end mt-[20px] mb-[50px]">
        <MdExpandLess onClick={() => {
          console.log(`here ${meaningsDiv.current.style.maxHeight}`);
          maxHeight -= 245;
          if (maxHeight === 0) {
            maxHeight = 245
            return ;
          }
          meaningsDiv.current.style.maxHeight = `${maxHeight}px`;
        }} className="bg-gray-100 w-[30px] h-[30px] cursor-pointer" />
        <MdExpandMore onClick={() => {
          console.log(`here ${meaningsDiv.current.style.maxHeight}`);
          maxHeight += 245;
          if (maxHeight === 0) {
            maxHeight = 245
            return ;
          }
          meaningsDiv.current.style.maxHeight = `${maxHeight}px`;
        }} className="bg-gray-100 w-[30px] h-[30px] cursor-pointer" />
      </div>
    </div>
  );
}

