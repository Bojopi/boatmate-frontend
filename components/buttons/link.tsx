import Link from "next/link";
import { Button } from "primereact/button";
import React from "react";

export type ButtonProps = {
    children: React.ReactNode;
    href?: any;
};

export type ButtonIconProps = {
    href?: any;
    title?: string;
};

export type ButtonChildrenIconProps = {
    href?: any;
    title?: string;
    children: React.ReactNode;
};

export const ButtonCreate: React.FC<ButtonProps> = ({children, href}) => {
  return (
    <Button
    type='button'
    outlined
    className='flex justify-between gap-2'
    >
        <i className="pi pi-plus"></i>
        <Link href={href}>{children}</Link>
    </Button>
  );
};