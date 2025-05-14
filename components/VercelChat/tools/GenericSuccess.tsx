const GenericSuccess = ({
  image,
  name,
  message,
  children,
}: {
  image?: string;
  name: string;
  message: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className="flex items-center space-x-3 p-2 rounded bg-gray-50 border border-gray-200 my-1 text-gray-800 w-fit md:rounded-xl">
      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={name}
            width={32}
            height={32}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-sm font-medium text-gray-600">✓</span>
        )}
      </div>

      <div className="flex-grow min-w-0">
        <p className="font-medium text-sm truncate">{name}</p>
        <p className="text-xs text-gray-500 truncate">{message}</p>
        {children}
      </div>
    </div>
  );
};

export default GenericSuccess;
