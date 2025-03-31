interface ActionCardProps {
  icon: JSX.Element;
  title: string;
  description: string;
  onClick: () => void;
}

function ActionCard({ icon, title, description, onClick }: ActionCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 w-48 space-y-2"
    >
      <div className="text-gray-800 w-12 h-12">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500 text-center">{description}</p>
    </button>
  );
}

export function ActionCards() {
  const handleUploadFiles = () => {
    // TODO: Implement file upload
    console.log('Upload files clicked');
  };

  const handleCallRecording = () => {
    // TODO: Implement call recording
    console.log('Call recording clicked');
  };

  const handleUploadTranscript = () => {
    // TODO: Implement transcript upload
    console.log('Upload transcript clicked');
  };

  return (
    <div className="flex gap-6 flex-wrap justify-center">
      <ActionCard
        icon={
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        }
        title="Upload Files"
        description="hld, api spec, etc"
        onClick={handleUploadFiles}
      />
      <ActionCard
        icon={
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        }
        title="Call recording"
        description="audio or video file"
        onClick={handleCallRecording}
      />
      <ActionCard
        icon={
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        }
        title="Upload Transcript"
        description="txt, word file"
        onClick={handleUploadTranscript}
      />
    </div>
  );
} 