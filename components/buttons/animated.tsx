import React, {useState} from 'react';


export const BackAnimated = () => {
    const [isHover, setIsHover] = useState<boolean>(false);

    const hovered = () => {
        setIsHover(!isHover);
    }

    return (
        <button 
        className="flex items-center gap-1 bg-none px-4 py-2 rounded focus:outline-none transition-colors duration-300"
        onMouseEnter={hovered}
        onMouseLeave={hovered}
        >
            <i className={`pi pi-angle-left transition-all ${isHover ? 'opacity-100' : 'opacity-0'}`}></i>
            Back
        </button>
    )
};