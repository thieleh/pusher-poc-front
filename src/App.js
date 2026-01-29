import React, { useState, useEffect } from 'react';
import { Upload, CheckCircle, Clock, AlertCircle, Trash2, Zap } from 'lucide-react';
import Pusher from 'pusher-js';

const FileUploadPOC = () => {
  const [files, setFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState({});
  const [pusherConnected, setPusherConnected] = useState(false);
  const [selectedSize, setSelectedSize] = useState('small');

  const PUSHER_KEY = '';
  const PUSHER_CLUSTER = '';
  const BACKEND_URL = 'http://localhost:5000';

  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    mainCard: {
      maxWidth: '1200px',
      margin: '0 auto',
      background: 'white',
      borderRadius: '24px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      overflow: 'hidden',
      marginBottom: '2rem',
    },
    header: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '3rem 2rem',
      color: 'white',
    },
    headerContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem',
    },
    headerText: {
      flex: 1,
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
      margin: 0,
    },
    subtitle: {
      opacity: 0.9,
      fontSize: '1.1rem',
      margin: 0,
    },
    statusBadge: {
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '50px',
      padding: '0.75rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    },
    statusDot: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      position: 'relative',
    },
    statusDotConnected: {
      backgroundColor: '#10b981',
      animation: 'pulse 2s infinite',
    },
    statusDotDisconnected: {
      backgroundColor: '#ef4444',
    },
    infoSection: {
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)',
      padding: '1.5rem 2rem',
      borderBottom: '1px solid rgba(79, 70, 229, 0.1)',
    },
    infoContent: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1rem',
    },
    content: {
      padding: '3rem 2rem',
    },
    section: {
      marginBottom: '3rem',
    },
    sectionTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    },
    sectionAccent: {
      width: '4px',
      height: '24px',
      background: 'linear-gradient(to bottom, #667eea, #764ba2)',
      borderRadius: '2px',
    },
    controlsRow: {
      display: 'flex',
      gap: '1rem',
      flexWrap: 'wrap',
    },
    select: {
      flex: '1',
      minWidth: '200px',
      padding: '1rem',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      background: 'white',
      fontSize: '1rem',
      fontWeight: '500',
      color: '#374151',
      transition: 'all 0.2s',
    },
    primaryButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      padding: '1rem 2rem',
      borderRadius: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      fontSize: '1rem',
    },
    uploadArea: {
      border: '2px dashed #d1d5db',
      borderRadius: '12px',
      padding: '3rem',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s',
      background: '#fafafa',
    },
    uploadAreaHover: {
      borderColor: '#667eea',
      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
    },
    filesHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem',
      flexWrap: 'wrap',
      gap: '1rem',
    },
    fileCountBadge: {
      background: '#e0e7ff',
      color: '#4f46e5',
      padding: '0.5rem 1rem',
      borderRadius: '50px',
      fontSize: '0.875rem',
      fontWeight: '600',
      marginLeft: '0.5rem',
    },
    buttonGroup: {
      display: 'flex',
      gap: '0.5rem',
    },
    secondaryButton: {
      background: '#f3f4f6',
      color: '#374151',
      border: 'none',
      padding: '0.75rem 1rem',
      borderRadius: '8px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    successButton: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    fileItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1.5rem',
      background: 'white',
      border: '2px solid #f3f4f6',
      borderRadius: '12px',
      marginBottom: '1rem',
      transition: 'all 0.2s',
    },
    fileItemHover: {
      borderColor: '#e0e7ff',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    fileInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      flex: '1',
      minWidth: '0',
    },
    fileName: {
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '0.25rem',
      wordBreak: 'break-all',
      margin: '0 0 0.25rem 0',
    },
    fileSize: {
      fontSize: '0.75rem',
      color: '#6b7280',
      fontWeight: '500',
      margin: 0,
    },
    statusBadgeSmall: {
      padding: '0.5rem 1rem',
      borderRadius: '50px',
      fontSize: '0.75rem',
      fontWeight: '600',
      whiteSpace: 'nowrap',
    },
    infoCard: {
      background: 'white',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f3f4f6',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    infoCardHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '1.5rem',
    },
    infoCardIcon: {
      width: '32px',
      height: '32px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '1.2rem',
    },
    stepsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1rem',
    },
    stepItem: {
      display: 'flex',
      gap: '1rem',
      alignItems: 'flex-start',
    },
    stepNumber: {
      width: '24px',
      height: '24px',
      background: '#f0f9ff',
      color: '#0369a1',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: '0.75rem',
      flexShrink: '0',
    },
    stepText: {
      fontSize: '0.875rem',
      color: '#6b7280',
      lineHeight: '1.5',
      margin: 0,
    },
    hidden: {
      display: 'none',
    },
  };

useEffect(() => {
  try {
    const pusher = new Pusher('aacb803057f5403e7b33', {
      cluster: 'us2',
      encrypted: true
    });

    const channel = pusher.subscribe('file-uploads');
    
    channel.bind('pusher:subscription_succeeded', () => {
      setPusherConnected(true);
      console.log('✅ Connected to Pusher');
    });

    channel.bind('pusher:subscription_error', (error) => {
      console.error('❌ Pusher subscription error:', error);
      setPusherConnected(false);
    });

    channel.bind('upload-status', (data) => {
      console.log('📡 Received status update:', data);
      setUploadStatus(prev => ({
        ...prev,
        [data.fileId]: {
          status: data.status,
          progress: data.progress
        }
      }));
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
      console.log('Disconnected from Pusher');
    };
  } catch (error) {
    console.error('Error setting up Pusher:', error);
    setPusherConnected(false);
  }
}, []);

  const generateTestFile = (size) => {
    const sizes = {
      small: 1024 * 100,
      medium: 1024 * 1024 * 5,
      large: 1024 * 1024 * 20
    };

    const byteSize = sizes[size];
    const blob = new Blob([new ArrayBuffer(byteSize)], { type: 'application/octet-stream' });
    return new File([blob], `test-file-${size}-${Date.now()}.bin`, { type: 'application/octet-stream' });
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const handleGenerateTestFile = () => {
    const testFile = generateTestFile(selectedSize);
    setFiles(prev => [...prev, testFile]);
  };

  const uploadFile = async (file, index) => {
    const fileId = `${file.name}-${Date.now()}`;
    
    setUploadStatus(prev => ({
      ...prev,
      [fileId]: { status: 'in_progress', progress: 0 }
    }));

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileId', fileId);

    try {
      console.log(`📤 Uploading file: ${file.name} (${formatFileSize(file.size)})`);
      
      const response = await fetch(`${BACKEND_URL}/api/upload`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Upload successful:', result);
      } else {
        console.error('❌ Upload failed:', response.statusText);
        setUploadStatus(prev => ({
          ...prev,
          [fileId]: { status: 'failed', progress: 0 }
        }));
      }
    } catch (error) {
      console.error('❌ Upload error:', error);
      setUploadStatus(prev => ({
        ...prev,
        [fileId]: { status: 'failed', progress: 0 }
      }));
    }
  };

  const handleUploadAll = () => {
    files.forEach((file, index) => uploadFile(file, index));
  };

  const handleClearFiles = () => {
    setFiles([]);
    setUploadStatus({});
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getStatusIcon = (status) => {
    if (!status) return <Clock style={{width: '20px', height: '20px', color: '#9ca3af'}} />;
    
    switch (status.status) {
      case 'in_progress':
        return <Clock style={{width: '20px', height: '20px', color: '#3b82f6', animation: 'spin 1s linear infinite'}} />;
      case 'completed':
        return <CheckCircle style={{width: '20px', height: '20px', color: '#10b981'}} />;
      case 'failed':
        return <AlertCircle style={{width: '20px', height: '20px', color: '#ef4444'}} />;
      default:
        return <Clock style={{width: '20px', height: '20px', color: '#9ca3af'}} />;
    }
  };

  const getStatusText = (status) => {
    if (!status) return 'Pending';
    
    switch (status.status) {
      case 'in_progress':
        return `In Progress (${status.progress}%)`;
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      default:
        return 'Pending';
    }
  };

  const getStatusBadgeStyle = (status) => {
    let baseStyle = {...styles.statusBadgeSmall};
    
    if (!status) {
      baseStyle.background = '#f3f4f6';
      baseStyle.color = '#374151';
    } else {
      switch (status.status) {
        case 'in_progress':
          baseStyle.background = '#dbeafe';
          baseStyle.color = '#1e40af';
          break;
        case 'completed':
          baseStyle.background = '#d1fae5';
          baseStyle.color = '#047857';
          break;
        case 'failed':
          baseStyle.background = '#fee2e2';
          baseStyle.color = '#dc2626';
          break;
        default:
          baseStyle.background = '#f3f4f6';
          baseStyle.color = '#374151';
      }
    }
    
    return baseStyle;
  };

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @media (max-width: 768px) {
            .container { padding: 1rem !important; }
            .header { padding: 2rem 1rem !important; }
            .title { font-size: 2rem !important; }
            .content { padding: 2rem 1rem !important; }
            .controls-row { flex-direction: column !important; }
            .select { min-width: auto !important; }
          }
        `}
      </style>
      
      <div style={styles.container}>
        <div style={styles.mainCard}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerContent}>
              <div style={styles.headerText}>
                <h1 style={styles.title}>File Upload POC</h1>
                <p style={styles.subtitle}>Real-time WebSocket status tracking with Pusher</p>
              </div>
              <div style={styles.statusBadge}>
                <div style={{
                  ...styles.statusDot,
                  ...(pusherConnected ? styles.statusDotConnected : styles.statusDotDisconnected)
                }}></div>
                <span style={{fontWeight: '500', fontSize: '0.875rem'}}>
                  {pusherConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div style={styles.infoSection}>
            <div style={styles.infoContent}>
              <Zap style={{width: '24px', height: '24px', color: '#4f46e5', flexShrink: 0, marginTop: '2px'}} />
              <div>
                <h3 style={{fontWeight: '600', color: '#1e40af', marginBottom: '0.5rem', margin: '0 0 0.5rem 0'}}>
                  WebSocket Status Tracking Active
                </h3>
                <p style={{color: '#1e40af', fontSize: '0.875rem', margin: 0}}>
                  Upload progress is tracked in real-time via Pusher WebSocket. Watch the status update instantly as files are processed.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div style={styles.content}>
            {/* Test File Generator */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>
                <div style={styles.sectionAccent}></div>
                Generate Test File
              </h2>
              <div style={styles.controlsRow} className="controls-row">
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  style={styles.select}
                  className="select"
                >
                  <option value="small">Small (100KB) - Quick Test</option>
                  <option value="medium">Medium (5MB) - Standard File</option>
                  <option value="large">Large (20MB) - Stress Test</option>
                </select>
                <button
                  onClick={handleGenerateTestFile}
                  style={styles.primaryButton}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 10px 25px -5px rgba(102, 126, 234, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Generate Test File
                </button>
              </div>
            </div>

            {/* Upload Area */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>
                <div style={{...styles.sectionAccent, background: 'linear-gradient(to bottom, #764ba2, #f093fb)'}}></div>
                Upload Your Files
              </h2>
              <div
                style={styles.uploadArea}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#667eea';
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.background = '#fafafa';
                }}
                onClick={() => document.getElementById('fileInput').click()}
              >
                <Upload style={{width: '48px', height: '48px', color: '#9ca3af', marginBottom: '1rem', display: 'block', margin: '0 auto 1rem auto'}} />
                <p style={{fontWeight: '500', color: '#374151', marginBottom: '0.25rem', margin: '0 0 0.25rem 0'}}>
                  Click to select files or drag and drop
                </p>
                <p style={{fontSize: '0.75rem', color: '#6b7280', margin: 0}}>Support for multiple files</p>
                <input
                  id="fileInput"
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  style={{display: 'none'}}
                />
              </div>
            </div>
            {/* Files List */}
            {files.length > 0 && (
              <div style={styles.section}>
                <div style={styles.filesHeader}>
                  <h2 style={styles.sectionTitle}>
                    <div style={{...styles.sectionAccent, background: 'linear-gradient(to bottom, #f093fb, #f5576c)'}}></div>
                    Files Queue
                    <span style={styles.fileCountBadge}>{files.length}</span>
                  </h2>
                  <div style={styles.buttonGroup}>
                    <button
                      onClick={handleClearFiles}
                      style={styles.secondaryButton}
                      onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
                      onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
                    >
                      <Trash2 style={{width: '16px', height: '16px'}} />
                      Clear
                    </button>
                    <button
                      onClick={handleUploadAll}
                      style={styles.successButton}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      Upload All
                    </button>
                  </div>
                </div>

                <div>
                {files.map((file, index) => {
                    const fileKey = `${file.name}-${index}`;
                    const status = Object.entries(uploadStatus).find(([key, value]) => 
                      key.includes(file.name)
                    )?.[1];
                    return (
                      <div
                        key={index}
                        style={styles.fileItem}
                        onMouseEnter={(e) => {
                          e.target.style.borderColor = '#e0e7ff';
                          e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.borderColor = '#f3f4f6';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        <div style={styles.fileInfo}>
                          {getStatusIcon(status)}
                          <div style={{flex: 1, minWidth: 0}}>
                            <h4 style={styles.fileName}>{file.name}</h4>
                            <p style={styles.fileSize}>{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <div style={{marginLeft: '1rem'}}>
                          <span style={getStatusBadgeStyle(status)}>
                            {getStatusText(status)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div style={styles.infoCard}>
          <div style={styles.infoCardHeader}>
            <div style={styles.infoCardIcon}>ℹ️</div>
            <h3 style={{fontWeight: 'bold', color: '#1f2937', fontSize: '1.125rem', margin: 0}}>How It Works</h3>
          </div>
          <div style={styles.stepsGrid}>
            <div style={styles.stepItem}>
              <div style={{...styles.stepNumber, background: '#dbeafe', color: '#1e40af'}}>1</div>
              <p style={styles.stepText}>Files are uploaded via HTTP POST to the backend API</p>
            </div>
            <div style={styles.stepItem}>
              <div style={{...styles.stepNumber, background: '#e0e7ff', color: '#5b21b6'}}>2</div>
              <p style={styles.stepText}>Backend processes chunks and triggers Pusher events</p>
            </div>
            <div style={styles.stepItem}>
              <div style={{...styles.stepNumber, background: '#fce7f3', color: '#be185d'}}>3</div>
              <p style={styles.stepText}>Real-time status updates via WebSocket connection</p>
            </div>
            <div style={styles.stepItem}>
              <div style={{...styles.stepNumber, background: '#d1fae5', color: '#047857'}}>4</div>
              <p style={styles.stepText}>Frontend receives updates and reflects progress instantly</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FileUploadPOC;