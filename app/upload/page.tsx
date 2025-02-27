"use client";

import React, { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Progress } from "@/app/components/ui/progress";
import { UploadCloud } from "lucide-react";

const FileUploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & EventTarget;
  }

  const handleFileChange = (event: FileChangeEvent) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setMessage("Uploading...");
    setIsUploading(true);

    try {
      const response = await fetch("/api/seed", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setMessage(result.message);

      if (response.ok) {
        setFile(null);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("An error occurred while uploading the file.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <Card className="max-w-lg p-6 m-4">
        <CardHeader>
          <CardTitle>Upload Your File</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 items-center min-h-[200px]">
            <Input
              type="file"
              accept=".xlsx"
              onChange={handleFileChange}
              disabled={isUploading}
              className="file:mr-4 file:py-3 file:px-4 file:rounded-md file:border file:border-gray-300 file:bg-gray-100 file:text-sm file:font-medium hover:file:bg-gray-200 text-center"
              style={{ textAlign: 'center', padding: '4px', height: '58px' }}
            />
            {file && (
              <div className="text-sm text-gray-600">
                Selected file: <span className="font-medium">{file.name}</span>
              </div>
            )}
            {isUploading && <Progress value={0} />}
            <Button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="flex items-center space-x-2 mt-4"
              style={{ height: '48px' }}
            >
              <UploadCloud className="w-5 h-5" />
              <span>Upload</span>
            </Button>
            <p>{message}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileUploadForm;
