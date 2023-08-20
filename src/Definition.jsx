// import './styles-tw.css'
import './index.css'

export default function Definintion({ type, meaning }) {
    return (
        <div>
            <h3 className="text-blue-500 font-bold">{ type }</h3>
            <ul>
                { meaning.map((elem, index) => {
                        return (<li className='pl-[15px]' key={index + 1}>{ index + 1 }.  { elem.definition }</li>)
                })}
            </ul>
        </div>
    )
}