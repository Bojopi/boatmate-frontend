import React from 'react'

import { Rating } from "primereact/rating";

export type RatingProps = {
    value: number
}

export const RaitingComponent: React.FC<RatingProps> = ({ value }) => {
    return (
        <div className="card flex justify-content-center">
            <Rating value={value} onIconProps={{style: {color: '#eec137'}}} readOnly cancel={false} />
        </div>
    );
}