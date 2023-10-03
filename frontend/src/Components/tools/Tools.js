import React from 'react';
import { toast } from 'react-toastify';

export const TextInput = ({formik, name, placeholder, label, ...inputprops})=>{

    return (
        <div>
            <label name = {name}><strong>{label}</strong></label><br/>
            <input name= {name} placeholder= {placeholder}
                        onChange={formik.handleChange} onBlur={formik.handleBlur}
                        value={formik.values[name]} 
                        {...inputprops}/>
            
            {formik.touched[name] && formik.errors[name]?
            <div className="error_label">
                    {formik.errors[name]}
            </div>:null }

        </div>
 
    )
}

export const toastSuccess = (msg) =>{
    toast.success(msg,{
        position : toast.POSITION.TOP_LEFT
    });

}
export const toastError = (msg) =>{
    toast.error(msg,{
        position : toast.POSITION.TOP_LEFT
    });

}
