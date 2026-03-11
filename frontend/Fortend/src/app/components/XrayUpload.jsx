import React, { useState, useCallback } from 'react';
import { uploadXray } from '../../services/api';

/**
 * XrayUpload Component
 * 
 * Example component demonstrating how to use uploadXray() API
 * with loading state and error handling
 */
const XrayUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Handle file selection
  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
    
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please select a valid image file (JPG, PNG, BMP)');
        return;
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setError('File size must be less than 10MB');
        return;
      }

      setSelectedFile(file);
      setError(null);
      setResult(null);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }, []);

  // Handle upload and AI prediction
  const handleUpload = useCallback(async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Call uploadXray with progress tracking
      const data = await uploadXray(selectedFile, (progress) => {
        setUploadProgress(progress);
      });

      setResult(data);
      console.log('Diagnosis result:', data);
    } catch (err) {
      setError(err.message || 'Failed to analyze image. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedFile]);

  // Clear selection
  const handleClear = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setUploadProgress(0);
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        X-ray Image Analysis
      </h2>

      {/* File Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload X-ray Image
        </label>
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/bmp"
          onChange={handleFileChange}
          disabled={loading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <p className="mt-1 text-xs text-gray-500">
          Supported formats: JPG, PNG, BMP (Max 10MB)
        </p>
      </div>

      {/* Image Preview */}
      {previewUrl && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preview
          </label>
          <div className="relative">
            <img
              src={previewUrl}
              alt="X-ray preview"
              className="max-w-full h-auto max-h-64 rounded-lg border"
            />
            {!loading && (
              <button
                onClick={handleClear}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                title="Remove image"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!selectedFile || loading}
        className={`w-full py-3 px-4 rounded-lg font-semibold text-white
          ${!selectedFile || loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
          } transition-colors duration-200`}
      >
        {loading ? 'Analyzing...' : 'Analyze Image'}
      </button>

      {/* Loading State with Progress */}
      {loading && (
        <div className="mt-6">
          <div className="flex items-center justify-center mb-4">
            {/* Spinner */}
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          
          <p className="text-center text-sm text-gray-600 mt-2">
            {uploadProgress < 100 
              ? `Uploading... ${uploadProgress}%` 
              : 'AI is analyzing the image...'}
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Result Display */}
      {result && !loading && (
        <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-4">
            Analysis Result
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Predicted Stage</p>
              <p className="text-xl font-bold text-gray-900">
                {result.prediction || result.stage}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Confidence</p>
              <p className="text-xl font-bold text-gray-900">
                {result.confidence}
              </p>
            </div>
          </div>

          {result.recommendation && (
            <div className="mt-4 pt-4 border-t border-green-200">
              <p className="text-sm text-gray-600">Recommendation</p>
              <p className="text-gray-800">{result.recommendation}</p>
            </div>
          )}

          {result.processed_by && (
            <div className="mt-4 text-xs text-gray-500">
              Processed by: {result.processed_by}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default XrayUpload;
