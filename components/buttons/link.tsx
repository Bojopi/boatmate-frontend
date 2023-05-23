import Link from "next/link";
import { Button } from "primereact/button";
import React from "react";

export type ButtonProps = {
    children: React.ReactNode;
    href?: any;
};

export const ButtonCreate: React.FC<ButtonProps> = ({children, href}) => {
  return (
    <Button
    type='button'
    outlined
    className='p-button-success flex justify-between gap-2'
    >
        <i className="pi pi-plus"></i>
        <Link href={href}>{children}</Link>
    </Button>
  );
};