const Avatar = ({ name, lastName, size = 40 }: { name: string, lastName: string, size?: number }) => {
    const initials = (name?.charAt(0) || '') + (lastName?.charAt(0) || '')
    return (
        <div className={`flex items-center justify-center rounded-full bg-gray-200 p-2 text-gray-700 font-medium ${size ? `w-[${size}px] h-[${size}px]` : 'w-10 h-10'}`}>
            {initials || '?'}
        </div>
    )
}

export default Avatar
