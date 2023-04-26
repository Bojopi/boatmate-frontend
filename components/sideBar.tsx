

export type SideProps = {
    children: React.ReactNode;
}

const SideBarComponent: React.FC<SideProps> = ({ children }) => {
  return (
    <div className='w-72 h-full shrink-0 bg-white rounded-md shadow-md border'>
        {children}
    </div>
  )
}

export default SideBarComponent;