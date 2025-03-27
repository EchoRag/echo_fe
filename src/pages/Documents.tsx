import { useState, useEffect} from 'react';
import axios from 'axios';

interface Document{
  _id: string;
  name: string;
  uploadedAt: string;
}
export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get('/api/documents');
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const deleteDocument = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    try {
      await axios.delete(`/api/documents/${id}`);
      setDocuments(documents.filter((doc) => doc._id !== id));
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Uploaded Documents</h2>
      <ul>
        {documents.map((document) => (
          <li key={document._id} className="border p-4 mb-2 rounded-lg flex justify-between items-center">
            <span>{document.name}</span>
            <button 
              onClick={() => deleteDocument(document._id)} 
              className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
