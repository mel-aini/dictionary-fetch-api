import { useState, useRef, useEffect } from "react";
import Definintion from "./Definition";
import './index.css';
import { AiOutlineSearch } from "react-icons/ai";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
// import './styles-tw.css'

export default function App() {
  const [word, setWord] = useState("");
  const [load, setLoad] = useState(false);
  const [meanings, setMeanings] = useState([]);
  const [maxHeight, setMaxHeight] = useState("245px");
  const searchWord = useRef();
  const loadDiv = useRef();
  const [phonetic, setPhonetic] = useState("");
  const	[dictionary, setDictionary] = useState("");
  const	[noDef, setNoDef] = useState(false);
  let	loading = false;

  useEffect(() => {
    titleAnimation();
  }, []);

  const titleAnimation = () => {
    const str = "DICTIONARY";
    let tmp = "";
    let i = 0;
    let id = setInterval(frame, 150);
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
	if (searchWord.current.value === "") {
		return ;
	}
    setLoad(true);
    loading = true;
    loadAnimation();
    await sleep(1000);
    let data = await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + searchWord.current.value);
    let data2 = await data.json();
    setWord(searchWord.current.value.toLowerCase());
	if (data2.title === 'No Definitions Found') {
		setNoDef(true);
		setLoad(false);
		loading = false;
		return ;
	}
	if (data2[0].phonetics) {
		for (let i = 0; i < data2[0].phonetics.length; i++) {
		  if (data2[0].phonetics[i].text) {
			setPhonetic(data2[0].phonetics[i].text);
			break ;
		  }
		}
	}
    searchWord.current.value = "";
    setMeanings(data2);
    setLoad(false);
    loading = false;
	setNoDef(false);
    console.log(maxHeight + "px");
  }
    
  const loadAnimation = () => {
    let width = 0;
    let increment = true;
    let id = setInterval(frame, 10);
    function frame() {
      if (!loading || !loadDiv) {
        clearInterval(id);
		return ;
      }
      if (width === 93) {
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
	
	  {/* // dictionary */}
      <div className="mt-[40vh] text-white">
        <h1 className="flex justify-center items-center w-[80px] font-semibold text-[50px] sm:text-7xl">{ dictionary }
          <span className="translate-y-[-3px] sm:translate-y-[-5px] font-thin pl-[10px] text-[#E0AB31] animate-[loading_1s_ease_infinite]">|</span>
        </h1>
      </div>
	  {/* // dictionary */}
	  
	  {/* // input */}
      <form onSubmit={(e) => {e.preventDefault()}} className="mt-[2vh] sm:mt-[5vh] mb-[20px] w-full relative text-white shadow-2xl">
        <input ref={searchWord} type="text" placeholder="Search for a word" className="border bg-transparent border-white border-solid w-full pl-[15px] pr-[44px] h-[50px] outline-0 rounded-lg placeholder:text-white placeholder:opacity-50"></input>
        <button onClick={ goSearch }>
          <AiOutlineSearch className="absolute top-[12px] right-[10px] cursor-pointer text-[24px]"/>
        </button>
      { load && <div ref={ loadDiv } className="absolute bottom-[-5px] left-[7px] w-[3px] h-[3px] bg-[#E0AB31]"></div>}
      </form>
	  {/* // input */}

	  {/* // wordSection */}
	  { noDef && <div className="mt-[50px] text-[#E0AB31]">No Definitions Found</div> }
	  { meanings && meanings.length > 0 && <>
		<div className="block px-[20px] py-[20px] bg-gray-100 overflow-hidden w-full rounded-lg shadow-2xl bg-transparent">
			<h1 className="text-3xl text-[#E0AB31] font-bold">{ word }
			<span className="text-lg font-light pl-[10px]">[{ phonetic }]</span>
			</h1>
			<hr className="border-t-1 border-[#E0AB31] my-[15px]"></hr>
			<div className={`meanings max-h-[${maxHeight}] px-[10px] py[20px] overflow-hidden`}>
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
		<div className="flex gap-[10px] self-end mt-[20px] mb-[50px]">
			<MdExpandLess onClick={() => {
				setMaxHeight("245px");
			}} className="bg-transparent w-[30px] h-[30px] rounded-full cursor-pointer shadow-lg" />
			<MdExpandMore onClick={() => {
				setMaxHeight("max-content");
			}} className="bg-transparent w-[30px] h-[30px] rounded-full cursor-pointer shadow-lg" />
		</div>
	  </> }
	  {/* // wordSection */}

    </div>
  );
}

