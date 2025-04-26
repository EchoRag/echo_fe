import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Table, Spinner, Tooltip } from 'flowbite-react';
import useAxios from '../hooks/useAxios';
import { API_PATHS } from '../utils/apiPaths';
import { AnimatedLogo } from '../components/AnimatedLogo';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
}

interface Document {
  id: string;
  fileName: string;
  filePath: string;
  description: string | null;
  isCallRecording: boolean;
  isCallTranscript: boolean;
  status: 'pending' | 'processing' | 'processed' | 'failed';
  errorDescription: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectDocuments() {
  const { projectId } = useParams<{ projectId: string }>();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const axios = useAxios();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectResponse, documentsResponse] = await Promise.all([
          axios.get(API_PATHS.PROJECTS),
          axios.get(API_PATHS.PROJECT_DOCUMENTS(projectId!))
        ]);
        
        const projectData = projectResponse.data.find((p: Project) => p.id === projectId);
        if (projectData) {
          setProject(projectData);
        }
        setDocuments(documentsResponse.data);
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchData();
    }
  }, [projectId, axios]);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileType = (doc: Document): string => {
    if (doc.isCallRecording) return 'Call Recording';
    if (doc.isCallTranscript) return 'Call Transcript';
    return 'Document';
  };

  const getStatusBadge = (doc: Document): { text: string; className: string } => {
    const statusConfig = {
      pending: { text: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
      processing: { text: 'Processing', className: 'bg-blue-100 text-blue-800' },
      processed: { text: 'Processed', className: 'bg-green-100 text-green-800' },
      error: { text: 'Error', className: 'bg-red-100 text-red-800' },
      failed: { text: 'Failed', className: 'bg-red-100 text-red-800' }
    };
    return statusConfig[doc.status];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <AnimatedLogo className="w-full h-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{project?.name}</h1>
          <p className="text-gray-600">{project?.description}</p>
        </div>
        <Link
          to={`/projects`}
          className="text-white bg-[#2A3365] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Back to Project
          <svg className="w-6 h-6 dark:text-white ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12l4-4m-4 4 4 4"/>
          </svg>
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Document Name</Table.HeadCell>
            <Table.HeadCell>Upload Date</Table.HeadCell>
            <Table.HeadCell>Type</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {documents.map((doc) => {
              const status = getStatusBadge(doc);
              return (
                <Table.Row key={doc.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white truncate">
                    {doc.fileName}
                  </Table.Cell>
                  <Table.Cell>
                    {formatDate(doc.createdAt)}
                  </Table.Cell>
                  <Table.Cell>
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                      {getFileType(doc)}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Tooltip
                      content={doc.errorDescription || status.text}
                      style={doc.errorDescription ? "light" : "dark"}
                    >
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status.className}`}>
                        {status.text}
                      </span>
                    </Tooltip>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
} 