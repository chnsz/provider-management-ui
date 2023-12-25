import React, {useEffect} from "react";
import {ApiDetail} from "@/pages/AutoGenerate/api-config";

const FuncOrch: React.FC<{ apiData: ApiDetail[] }> = ({apiData}) => {

const create = [0, 1, '',''];
const read = [''];
const arr3 = [];
const arr4 = [];

    useEffect(()=>{
        console.log("XXXXXXXXXXXXXXX")
    }, [apiData])
    console.log('render FuncOrch', apiData)
    return <>{apiData.length}</>
}

export default FuncOrch;
