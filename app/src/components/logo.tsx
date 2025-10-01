export default function Logo({size}: {size: number}) {
    return <div className={`size-${size} p-1 flex justify-center items-center`}>
        <img src="logo.svg" className={`w-${size} h-${size}`}></img>
    </div>
} 