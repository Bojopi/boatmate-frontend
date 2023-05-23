import React from "react"
import { Button } from "primereact/button"
import Link from "next/link";

type ButtonDeleteProps = {
    onClick: () => void
}

type ButtonEditProps = {
    href:   string;
}

export const ButtonDelete: React.FC<ButtonDeleteProps> = ({onClick}) => {
    return (
        <Button
        type="button"
        icon="pi pi-trash"
        className="p-button-danger"
        text
        tooltip='Delete'
        tooltipOptions={{position: 'top'}}
        onClick={onClick}
        />
    );
};

export const ButtonEdit: React.FC<ButtonEditProps> = ({href}) => {
    return (
        <Link href={href}>
            <Button
            type="button"
            icon="pi pi-pencil"
            text
            tooltip='Edit'
            tooltipOptions={{position: 'top'}}
            />
        </Link>
    );
};