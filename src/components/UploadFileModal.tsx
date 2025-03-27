import { useState } from 'react';
import { Modal, Button, Checkbox } from 'flowbite-react';
import { HiDocument, HiUpload } from 'react-icons/hi';

interface UploadFileModalProps {
  show: boolean;
  onClose: () => void;
  onUpload: (fileData: {
    file: File;
    fileName: string;
    isCallRecording: boolean;
    isCallTranscript: boolean;
  }) => void;
}

export function UploadFileModal({ show, onClose, onUpload }: UploadFileModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [isCallRecording, setIsCallRecording] = useState(false);
  const [isCallTranscript, setIsCallTranscript] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setFileName(droppedFile.name);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    try {
      await onUpload({
        file,
        fileName,
        isCallRecording,
        isCallTranscript,
      });
      onClose();
    } catch (error) {
      console.error('Failed to upload file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal show={show} onClose={onClose} size="md">
      <Modal.Header>Upload File</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dropzone */}
          <div
            className="flex flex-col items-center justify-center w-full"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
          >
            {!file ? (
              <label className="w-full cursor-pointer">
                <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <HiUpload className="w-10 h-10 mb-2 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX, MP3, MP4 (MAX. 800x400px)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.mp3,.mp4"
                    data-testid="file-input"
                  />
                </div>
              </label>
            ) : (
              <div className="flex items-center justify-center w-full h-64 border-2 border-gray-300 rounded-lg bg-gray-50">
                <div className="flex flex-col items-center justify-center gap-2">
                  <HiDocument className="w-10 h-10 text-gray-400" />
                  <p className="text-sm text-gray-500">{file.name}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setFileName('');
                    }}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Remove file
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* File Name Input */}
          <div>
            <label htmlFor="file-name" className="block mb-2 text-sm font-medium text-gray-900">
              File Name
            </label>
            <input
              type="text"
              id="file-name"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter file name"
              data-testid="file-name-input"
            />
          </div>

          {/* Checkboxes */}
          <div className="flex items-center space-x-4">
            <Checkbox
              id="call-recording"
              checked={isCallRecording}
              onChange={(e) => setIsCallRecording(e.target.checked)}
              data-testid="call-recording-checkbox"
            />
            <label htmlFor="call-recording" className="text-sm font-medium text-gray-900">
              Call Recording
            </label>
          </div>

          <div className="flex items-center space-x-4">
            <Checkbox
              id="call-transcript"
              checked={isCallTranscript}
              onChange={(e) => setIsCallTranscript(e.target.checked)}
              data-testid="call-transcript-checkbox"
            />
            <label htmlFor="call-transcript" className="text-sm font-medium text-gray-900">
              Call Transcript
            </label>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: '45%' }}
                data-testid="upload-progress"
              ></div>
            </div>
          )}

          <Modal.Footer>
            <Button
              type="submit"
              disabled={!file || isUploading}
              className="bg-[#2A3365]"
              data-testid="upload-button"
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
            <Button
              color="gray"
              onClick={onClose}
              disabled={isUploading}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  );
} 