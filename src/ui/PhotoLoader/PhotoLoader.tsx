import React, { FC, useEffect, useState } from 'react'
// import "./PhotoLoader.scss"

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    isInvalid?: boolean
}

export const PhotoLoader: FC<Props> = ({ label, isInvalid, ...props }) => {

    return (
        <label className='photoloader'>
            {label && <div className="photoloader__label">{label}</div>}
            <div className={'photoloader__block' + (isInvalid ? " error" : "")}>
                <input className='photoloader__input' type="file" {...props} />
                <img className='photoloader__image' src="/img/icons/upload.svg" alt="" />
                <div className='photoloader__title'>Upload a file or drag and drop</div>
                <div className='photoloader__subtitle'>PNG, JPG, GIF up to 3MB</div></div>
        </label>

    )
}

export default PhotoLoader