import { Divider, List, TextInput } from "@mantine/core"
import React, { useState } from 'react';
import { HiLocationMarker } from "react-icons/hi";
import { IoClose } from "react-icons/io5";

export default ({ setLocation }) => {
    const [searchText, setSearchText] = useState("")
    const [locations, setLocations] = useState([])
    const [isVisible, setIsVisible] = useState(false);

    const onSearch = () => {

        let params = {
            "q": searchText,
            "format": "json",
            "addressdetails": 1,
        }

        // set the baseURL of the locations search API
        let url = process.env.REACT_APP_NOMINATIM_API_BASE_URL + new URLSearchParams(params)

        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                // console.log(result)
                setLocations(result)
            })
            .catch(error => console.log('error', error));
    }

    return (
        <div className="z-[10000] absolute right-[40%] top-5">
            <div className="relative w-96">

                <TextInput
                    onFocus={() => {
                        setIsVisible(true)
                    }}
                    onBlurCapture={() => {
                        setTimeout(() => {
                            setIsVisible(false)
                        }, 200)
                    }}
                    className="w-full"
                    placeholder="Search"
                    value={searchText}
                    onChange={(e) => {
                        setSearchText(e.currentTarget.value)
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            onSearch()
                        }
                    }}
                />
                {searchText !== "" && <IoClose size={20} className="text-gray-500 cursor-pointer absolute right-2 top-[20%]" onClick={() => {
                    setSearchText("")
                    setLocations([])
                }} />}
            </div>

            {locations.length > 0 && isVisible && <List
                center
                className="mt-2 bg-white shadow-md rounded-md p-2 w-96"
                icon={<HiLocationMarker className="text-red-500" size={25} />}
            >
                {
                    locations.map((location, i) => (
                        <div key={i}>
                            <List.Item className="leading-5 cursor-pointer p-2 hover:bg-gray-200 rounded-md"
                                onClick={() => {
                                    setLocation({
                                        coordinates: [location.lat, location.lon],
                                        zoomLevel: location.place_rank
                                    })
                                }}
                            >{location.display_name}</List.Item>
                            {locations.length > 1 && <Divider />}
                        </div>
                    ))
                }
            </List>}
        </div>
    )
}