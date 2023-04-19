
import React, { useEffect, useState } from 'react';
import { AutoComplete, AutoCompleteChangeEvent, AutoCompleteCompleteEvent } from "primereact/autocomplete";

interface Services {
    id: number;
    description: string;
}

export type Service = {
    searchList: any[],
    selectedElement: string,
    setSelectedElement: (selectedElement: string) => void
}

const SearchComponent:React.FC<Service> = ({searchList, selectedElement, setSelectedElement}) => {
    const [filteredElements, setFilteredElements] = useState<Services[]>([]);

    const search = (event: AutoCompleteCompleteEvent) => {
        setTimeout(() => {
            let _filteredElements;

            if (!event.query.trim().length) {
                _filteredElements = [...searchList];
            }
            else {
                _filteredElements = searchList.filter((searchItem) => {
                    const result = searchItem.name.toLowerCase().startsWith(event.query.toLowerCase());
                    console.log(result);
                    return searchItem.name.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }

            setFilteredElements(_filteredElements);
        }, 250);
    }

    return (
        <div className="flex justify-content-center">
            <AutoComplete className='w-full' field="name" value={selectedElement} suggestions={filteredElements} completeMethod={search} dropdown onChange={(e: AutoCompleteChangeEvent) => setSelectedElement(e.value)} />
        </div>
    )
}

export default SearchComponent;