import { ImageGenerator } from "./image-generator";

const ImagePage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="w-full max-w-3xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Base Image Generator by Recoup
          </h1>
          <p className="text-muted-foreground">
            Enter a prompt and generate an image using AI and stored onchain
          </p>
        </div>
        <ImageGenerator />
      </div>
    </main>
  );
};

export default ImagePage;
