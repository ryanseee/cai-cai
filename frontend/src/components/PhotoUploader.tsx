import React, { useState, useRef } from "react";
import { useSession } from "../context/SessionContext";
import { Photo } from "../types";
import Button from "./Button";
import { Upload, X } from "lucide-react";

interface PhotoUploaderProps {
  onUploadComplete: () => void;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  onUploadComplete,
}) => {
  const { currentSession, uploadPhotos } = useSession();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleFileChange called");
    if (!e.target.files) {
      console.log("No files selected");
      return;
    }

    const files = Array.from(e.target.files);
    console.log("Files selected:", files.length);

    // Append new files instead of replacing
    setSelectedFiles((prev) => [...prev, ...files]);

    // Generate previews for new files
    files.forEach((file) => {
      console.log("Processing file:", file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("Preview generated for:", file.name);
        setPreviews((prev) => {
          const newPreviews = [...prev, reader.result as string];
          console.log("Total previews after update:", newPreviews.length);
          return newPreviews;
        });
      };
      reader.readAsDataURL(file);
    });

    // Reset the file input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0 || !currentSession) return;

    setIsUploading(true);

    try {
      const photos: Photo[] = [];

      // Process each file
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const reader = new FileReader();

        // Create a promise to handle the async file reading
        const filePromise = new Promise<Photo>((resolve) => {
          reader.onload = (e) => {
            if (e.target?.result) {
              resolve({
                url: e.target.result as string,
                title: file.name,
                session_id: currentSession.id,
                uploaded_at: new Date().toISOString(),
              });
            }
          };
          reader.readAsDataURL(file);
        });

        // Wait for the file to be read
        const photo = await filePromise;
        photos.push(photo);
      }

      // Upload all photos
      console.log("Uploading photos to server:", photos.length);
      await uploadPhotos(photos);
      console.log("Photos uploaded successfully");

      // Call the onUploadComplete callback
      onUploadComplete();

      // Clear the selected files and previews
      setSelectedFiles([]);
      setPreviews([]);

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading photos:", error);
      alert("Failed to upload photos. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="photo-uploader my-6">
      <div className="flex flex-col items-center">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          className="hidden"
        />

        <div
          onClick={openFileDialog}
          className={`border-2 border-dashed rounded-lg p-8 w-full text-center transition-colors
            ${"border-gray-300 cursor-pointer hover:border-indigo-500"}`}
        >
          <Upload className={`mx-auto h-12 w-12 text-gray-400`} />
          <p className={`mt-1 text-sm text-gray-600`}>
            Click to upload photos, or drag and drop
          </p>
          <p className={`text-xs text-gray-500`}>PNG, JPG, GIF up to 10MB</p>
        </div>

        {previews.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Preview ${index}`}
                  className={`h-32 w-full object-cover rounded-lg shadow-sm`}
                />
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1
                            opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedFiles.length > 0 && (
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="mt-4"
            icon={<Upload size={18} />}
          >
            {isUploading
              ? "Uploading..."
              : `Upload ${selectedFiles.length} photos`}
          </Button>
        )}
      </div>
    </div>
  );
};
