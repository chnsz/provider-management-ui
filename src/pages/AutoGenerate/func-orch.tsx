import React from "react";
import {ApiDetail} from "@/pages/AutoGenerate/api-config";

const FuncOrch: React.FC<{ apiData: ApiDetail[] }> = ({apiData}) => {

    console.log('render FuncOrch', apiData)
    return <>{apiData.length}</>
}

export default FuncOrch;
