import { useState } from 'react';
import axios from 'axios';

const FileUploadWithText = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [text, setText] = useState(''); // State for text input
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]; // Store the selected file in a variable
      console.log(file); // Log the selected file
      setSelectedFile(file); // Update state with the selected file
    }
  };

  // Convert file to base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string); // Resolve with the base64 string
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file); // Read the file as a data URL (base64)
    });
  };

  // Handle form submission
  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Convert the selected file to base64
      const base64File = await convertFileToBase64(selectedFile);
      console.log(base64File);

      const response = await axios.post('https://backend2.vaibhavpal9935.workers.dev/api/v1/post/create', {
        file: base64File, // Send base64 file
        text: text, // Send text input
      }, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      console.log('File and text uploaded successfully:', response.data);
      // Handle success (you can display a success message or process the response)
      setText(''); // Clear the text area after submission
      setSelectedFile(null); // Clear the file input after submission
    } catch (err) {
      console.error('Error uploading file and text:', err);
      setError('Failed to upload file and text.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleUpload}>
        <h2>File Upload with Description</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        {/* File Input */}
        <div>
          <label htmlFor="file">Choose an image:</label>
          <input type="file" id="file" accept="image/*" onChange={handleFileChange} required />
        </div>

        {/* Text Area for description */}
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a description..."
            rows={5}
            cols={40}
            required
          ></textarea>
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
};

export default FileUploadWithText;
