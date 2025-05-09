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
    <div className="flex items-center space-x-4 p-3 rounded-md bg-green-50 border border-green-200 my-2">
      <div className="h-12 w-12 rounded-full bg-green-200 flex items-center justify-center overflow-hidden">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={name}
            width={48}
            height={48}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-lg font-bold text-green-600">✓</span>
        )}
      </div>

      <div className="flex-grow">
        <p className="font-medium">{name}</p>
        <p className="text-sm text-green-600">{message}</p>
        {children}
      </div>
    </div>
  );
};

export default GenericSuccess;
