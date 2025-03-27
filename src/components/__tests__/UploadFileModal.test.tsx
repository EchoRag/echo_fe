import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UploadFileModal } from '../UploadFileModal';

describe('UploadFileModal', () => {
  const mockOnClose = jest.fn();
  const mockOnUpload = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the modal when show is true', () => {
    render(<UploadFileModal show={true} onClose={mockOnClose} onUpload={mockOnUpload} />);
    
    expect(screen.getByText('Upload File')).toBeInTheDocument();
    expect(screen.getByText('Click to upload')).toBeInTheDocument();
    expect(screen.getByText('File Name')).toBeInTheDocument();
    expect(screen.getByText('Call Recording')).toBeInTheDocument();
    expect(screen.getByText('Call Transcript')).toBeInTheDocument();
  });

  it('does not render when show is false', () => {
    render(<UploadFileModal show={false} onClose={mockOnClose} onUpload={mockOnUpload} />);
    
    expect(screen.queryByText('Upload File')).not.toBeInTheDocument();
  });

  it('handles file selection via input', () => {
    render(<UploadFileModal show={true} onClose={mockOnClose} onUpload={mockOnUpload} />);
    
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByTestId('file-input');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(screen.getByTestId('file-name-input')).toHaveValue('test.pdf');
  });

  it('handles file drop', () => {
    render(<UploadFileModal show={true} onClose={mockOnClose} onUpload={mockOnUpload} />);
    
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const dropzone = screen.getByText('Click to upload').parentElement?.parentElement;
    
    fireEvent.dragOver(dropzone!);
    fireEvent.drop(dropzone!, { dataTransfer: { files: [file] } });
    
    expect(screen.getByTestId('file-name-input')).toHaveValue('test.pdf');
  });

  it('handles checkbox toggles', () => {
    render(<UploadFileModal show={true} onClose={mockOnClose} onUpload={mockOnUpload} />);
    
    const callRecordingCheckbox = screen.getByTestId('call-recording-checkbox');
    const callTranscriptCheckbox = screen.getByTestId('call-transcript-checkbox');
    
    fireEvent.click(callRecordingCheckbox);
    fireEvent.click(callTranscriptCheckbox);
    
    expect(callRecordingCheckbox).toBeChecked();
    expect(callTranscriptCheckbox).toBeChecked();
  });

  it('shows upload progress when uploading', async () => {
    mockOnUpload.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<UploadFileModal show={true} onClose={mockOnClose} onUpload={mockOnUpload} />);
    
    // Select a file
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByTestId('file-input');
    fireEvent.change(input, { target: { files: [file] } });
    
    // Submit the form
    const uploadButton = screen.getByTestId('upload-button');
    fireEvent.click(uploadButton);
    
    // Check for progress bar
    expect(screen.getByTestId('upload-progress')).toBeInTheDocument();
    
    // Wait for upload to complete
    await waitFor(() => {
      expect(mockOnUpload).toHaveBeenCalledWith({
        file,
        fileName: 'test.pdf',
        isCallRecording: false,
        isCallTranscript: false,
      });
    });
  });

  it('disables upload button when no file is selected', () => {
    render(<UploadFileModal show={true} onClose={mockOnClose} onUpload={mockOnUpload} />);
    
    const uploadButton = screen.getByTestId('upload-button');
    expect(uploadButton).toBeDisabled();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(<UploadFileModal show={true} onClose={mockOnClose} onUpload={mockOnUpload} />);
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });
}); 