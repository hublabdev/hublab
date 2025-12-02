/**
 * PDF Viewer Capsule - Document Viewer
 *
 * Cross-platform PDF viewer with navigation, zoom,
 * annotations, and text search capabilities.
 */

import type { CapsuleDefinition } from './types'

export const PDFViewerCapsule: CapsuleDefinition = {
  id: 'pdf-viewer',
  name: 'PDF Viewer',
  description: 'PDF document viewer with navigation, zoom, annotations, and search',
  category: 'media',
  tags: ['pdf', 'document', 'viewer', 'reader', 'annotations'],
  version: '1.0.0',

  props: {
    source: {
      type: 'string',
      required: true,
      description: 'PDF source URL or base64 data',
    },
    initialPage: {
      type: 'number',
      default: 1,
      description: 'Initial page number',
    },
    initialZoom: {
      type: 'number',
      default: 1,
      description: 'Initial zoom level (1 = 100%)',
    },
    minZoom: {
      type: 'number',
      default: 0.5,
      description: 'Minimum zoom level',
    },
    maxZoom: {
      type: 'number',
      default: 3,
      description: 'Maximum zoom level',
    },
    showToolbar: {
      type: 'boolean',
      default: true,
      description: 'Show navigation toolbar',
    },
    showThumbnails: {
      type: 'boolean',
      default: false,
      description: 'Show page thumbnails sidebar',
    },
    showSearch: {
      type: 'boolean',
      default: true,
      description: 'Enable text search',
    },
    enableAnnotations: {
      type: 'boolean',
      default: false,
      description: 'Enable annotation tools',
    },
    enableTextSelection: {
      type: 'boolean',
      default: true,
      description: 'Allow text selection and copy',
    },
    pageMode: {
      type: 'string',
      default: 'single',
      description: 'Page display mode: single, continuous, two-page',
    },
    fitMode: {
      type: 'string',
      default: 'width',
      description: 'Fit mode: width, height, page, auto',
    },
    theme: {
      type: 'string',
      default: 'light',
      description: 'Viewer theme: light, dark, sepia',
    },
    onPageChange: {
      type: 'function',
      description: 'Callback when page changes',
    },
    onZoomChange: {
      type: 'function',
      description: 'Callback when zoom changes',
    },
    onDocumentLoad: {
      type: 'function',
      description: 'Callback when document loads',
    },
    onError: {
      type: 'function',
      description: 'Callback when error occurs',
    },
  },

  platforms: {
    web: {
      dependencies: ['react', 'tailwindcss', 'pdfjs-dist'],
      components: {
        // Full PDF Viewer with all features
        PDFViewer: `
import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker
pdfjsLib.GlobalWorkerOptions.workerSrc = \`//cdnjs.cloudflare.com/ajax/libs/pdf.js/\${pdfjsLib.version}/pdf.worker.min.js\`;

interface PDFViewerProps {
  source: string;
  initialPage?: number;
  initialZoom?: number;
  minZoom?: number;
  maxZoom?: number;
  showToolbar?: boolean;
  showThumbnails?: boolean;
  showSearch?: boolean;
  enableAnnotations?: boolean;
  enableTextSelection?: boolean;
  pageMode?: 'single' | 'continuous' | 'two-page';
  fitMode?: 'width' | 'height' | 'page' | 'auto';
  theme?: 'light' | 'dark' | 'sepia';
  onPageChange?: (page: number) => void;
  onZoomChange?: (zoom: number) => void;
  onDocumentLoad?: (numPages: number) => void;
  onError?: (error: Error) => void;
  className?: string;
}

interface SearchResult {
  page: number;
  index: number;
  text: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({
  source,
  initialPage = 1,
  initialZoom = 1,
  minZoom = 0.5,
  maxZoom = 3,
  showToolbar = true,
  showThumbnails = false,
  showSearch = true,
  enableAnnotations = false,
  enableTextSelection = true,
  pageMode = 'single',
  fitMode = 'width',
  theme = 'light',
  onPageChange,
  onZoomChange,
  onDocumentLoad,
  onError,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdf, setPdf] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [numPages, setNumPages] = useState(0);
  const [zoom, setZoom] = useState(initialZoom);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [thumbnailsVisible, setThumbnailsVisible] = useState(showThumbnails);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Theme colors
  const themeStyles = useMemo(() => {
    switch (theme) {
      case 'dark':
        return {
          bg: 'bg-gray-900',
          toolbar: 'bg-gray-800 border-gray-700',
          text: 'text-gray-100',
          border: 'border-gray-700',
          button: 'hover:bg-gray-700',
          canvas: 'invert',
        };
      case 'sepia':
        return {
          bg: 'bg-amber-50',
          toolbar: 'bg-amber-100 border-amber-200',
          text: 'text-amber-900',
          border: 'border-amber-200',
          button: 'hover:bg-amber-200',
          canvas: 'sepia',
        };
      default:
        return {
          bg: 'bg-gray-100',
          toolbar: 'bg-white border-gray-200',
          text: 'text-gray-900',
          border: 'border-gray-200',
          button: 'hover:bg-gray-100',
          canvas: '',
        };
    }
  }, [theme]);

  // Load PDF document
  useEffect(() => {
    const loadPDF = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const loadingTask = pdfjsLib.getDocument(source);
        const pdfDoc = await loadingTask.promise;

        setPdf(pdfDoc);
        setNumPages(pdfDoc.numPages);
        onDocumentLoad?.(pdfDoc.numPages);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load PDF');
        setError(error.message);
        onError?.(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPDF();
  }, [source, onDocumentLoad, onError]);

  // Render current page
  const renderPage = useCallback(async () => {
    if (!pdf || !canvasRef.current) return;

    try {
      const page = await pdf.getPage(currentPage);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Calculate scale based on fit mode
      const container = containerRef.current;
      let scale = zoom;

      if (container && fitMode !== 'auto') {
        const viewport = page.getViewport({ scale: 1 });

        switch (fitMode) {
          case 'width':
            scale = (container.clientWidth - 48) / viewport.width * zoom;
            break;
          case 'height':
            scale = (container.clientHeight - 48) / viewport.height * zoom;
            break;
          case 'page':
            const scaleX = (container.clientWidth - 48) / viewport.width;
            const scaleY = (container.clientHeight - 48) / viewport.height;
            scale = Math.min(scaleX, scaleY) * zoom;
            break;
        }
      }

      const viewport = page.getViewport({ scale });
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvasContext: ctx,
        viewport,
      }).promise;
    } catch (err) {
      console.error('Error rendering page:', err);
    }
  }, [pdf, currentPage, zoom, fitMode]);

  // Render when page or zoom changes
  useEffect(() => {
    renderPage();
  }, [renderPage]);

  // Navigation functions
  const goToPage = useCallback((page: number) => {
    const newPage = Math.max(1, Math.min(numPages, page));
    setCurrentPage(newPage);
    onPageChange?.(newPage);
  }, [numPages, onPageChange]);

  const prevPage = () => goToPage(currentPage - 1);
  const nextPage = () => goToPage(currentPage + 1);

  // Zoom functions
  const handleZoom = useCallback((newZoom: number) => {
    const clampedZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
    setZoom(clampedZoom);
    onZoomChange?.(clampedZoom);
  }, [minZoom, maxZoom, onZoomChange]);

  const zoomIn = () => handleZoom(zoom + 0.25);
  const zoomOut = () => handleZoom(zoom - 0.25);
  const resetZoom = () => handleZoom(1);

  // Search function
  const handleSearch = useCallback(async () => {
    if (!pdf || !searchQuery.trim()) return;

    setIsSearching(true);
    const results: SearchResult[] = [];

    try {
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const text = textContent.items
          .map((item: any) => item.str)
          .join(' ');

        const regex = new RegExp(searchQuery, 'gi');
        let match;
        let index = 0;

        while ((match = regex.exec(text)) !== null) {
          results.push({
            page: i,
            index: index++,
            text: text.substring(Math.max(0, match.index - 20), match.index + searchQuery.length + 20),
          });
        }
      }

      setSearchResults(results);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  }, [pdf, searchQuery, numPages]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          prevPage();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          nextPage();
          break;
        case '+':
        case '=':
          e.preventDefault();
          zoomIn();
          break;
        case '-':
          e.preventDefault();
          zoomOut();
          break;
        case '0':
          e.preventDefault();
          resetZoom();
          break;
        case 'f':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setSearchOpen(true);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, zoom]);

  if (error) {
    return (
      <div className={\`flex items-center justify-center h-64 \${themeStyles.bg} rounded-lg \${className}\`}>
        <div className="text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={\`flex flex-col h-full \${themeStyles.bg} rounded-lg overflow-hidden \${className}\`}>
      {/* Toolbar */}
      {showToolbar && (
        <div className={\`flex items-center gap-2 px-4 py-2 \${themeStyles.toolbar} border-b\`}>
          {/* Page navigation */}
          <div className="flex items-center gap-1">
            <button
              onClick={prevPage}
              disabled={currentPage <= 1}
              className={\`p-2 rounded \${themeStyles.button} disabled:opacity-50\`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex items-center gap-2 px-2">
              <input
                type="number"
                value={currentPage}
                onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
                className={\`w-12 px-2 py-1 text-center rounded border \${themeStyles.border} bg-transparent \${themeStyles.text}\`}
                min={1}
                max={numPages}
              />
              <span className={\`\${themeStyles.text}\`}>/ {numPages}</span>
            </div>

            <button
              onClick={nextPage}
              disabled={currentPage >= numPages}
              className={\`p-2 rounded \${themeStyles.button} disabled:opacity-50\`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className={\`h-6 w-px \${themeStyles.border}\`} />

          {/* Zoom controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={zoomOut}
              disabled={zoom <= minZoom}
              className={\`p-2 rounded \${themeStyles.button} disabled:opacity-50\`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
              </svg>
            </button>

            <span className={\`px-2 min-w-[60px] text-center \${themeStyles.text}\`}>
              {Math.round(zoom * 100)}%
            </span>

            <button
              onClick={zoomIn}
              disabled={zoom >= maxZoom}
              className={\`p-2 rounded \${themeStyles.button} disabled:opacity-50\`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
              </svg>
            </button>
          </div>

          <div className="flex-1" />

          {/* Thumbnails toggle */}
          <button
            onClick={() => setThumbnailsVisible(!thumbnailsVisible)}
            className={\`p-2 rounded \${themeStyles.button} \${thumbnailsVisible ? 'bg-blue-100 text-blue-600' : ''}\`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>

          {/* Search toggle */}
          {showSearch && (
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={\`p-2 rounded \${themeStyles.button} \${searchOpen ? 'bg-blue-100 text-blue-600' : ''}\`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Search bar */}
      {searchOpen && (
        <div className={\`flex items-center gap-2 px-4 py-2 \${themeStyles.toolbar} border-b\`}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search in document..."
            className={\`flex-1 px-3 py-1.5 rounded border \${themeStyles.border} bg-transparent \${themeStyles.text}\`}
            autoFocus
          />
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
          <button
            onClick={() => {
              setSearchOpen(false);
              setSearchQuery('');
              setSearchResults([]);
            }}
            className={\`p-1.5 rounded \${themeStyles.button}\`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Search results */}
      {searchResults.length > 0 && (
        <div className={\`max-h-40 overflow-y-auto px-4 py-2 \${themeStyles.toolbar} border-b\`}>
          <p className={\`text-sm \${themeStyles.text} mb-2\`}>
            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
          </p>
          <div className="space-y-1">
            {searchResults.slice(0, 10).map((result, i) => (
              <button
                key={i}
                onClick={() => goToPage(result.page)}
                className={\`w-full text-left px-3 py-2 rounded \${themeStyles.button} text-sm\`}
              >
                <span className="font-medium text-blue-600">Page {result.page}</span>
                <span className={\`ml-2 \${themeStyles.text}\`}>...{result.text}...</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Thumbnails sidebar */}
        {thumbnailsVisible && (
          <div className={\`w-48 \${themeStyles.toolbar} border-r overflow-y-auto p-2\`}>
            {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={\`
                  w-full p-2 mb-2 rounded text-center
                  \${currentPage === pageNum ? 'bg-blue-100 border-2 border-blue-500' : themeStyles.button}
                \`}
              >
                <div className="aspect-[3/4] bg-white border rounded mb-1 flex items-center justify-center text-gray-400">
                  {pageNum}
                </div>
                <span className={\`text-xs \${themeStyles.text}\`}>Page {pageNum}</span>
              </button>
            ))}
          </div>
        )}

        {/* PDF canvas */}
        <div
          ref={containerRef}
          className="flex-1 overflow-auto flex items-start justify-center p-6"
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              <p className={\`mt-4 \${themeStyles.text}\`}>Loading PDF...</p>
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              className={\`shadow-lg \${themeStyles.canvas} \${enableTextSelection ? 'select-text' : 'select-none'}\`}
            />
          )}
        </div>
      </div>
    </div>
  );
};
`,

        // Simple PDF Embed
        PDFEmbed: `
import React from 'react';

interface PDFEmbedProps {
  source: string;
  title?: string;
  height?: string | number;
  className?: string;
}

export const PDFEmbed: React.FC<PDFEmbedProps> = ({
  source,
  title = 'PDF Document',
  height = '600px',
  className = '',
}) => {
  return (
    <div className={\`bg-gray-100 rounded-lg overflow-hidden \${className}\`}>
      <iframe
        src={\`\${source}#toolbar=1&navpanes=0\`}
        title={title}
        width="100%"
        height={height}
        className="border-0"
      />
    </div>
  );
};
`,

        // PDF Download Button
        PDFDownloadButton: `
import React from 'react';

interface PDFDownloadButtonProps {
  source: string;
  filename?: string;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({
  source,
  filename = 'document.pdf',
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(source);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const baseStyles = 'inline-flex items-center gap-2 font-medium rounded-lg transition-colors';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    ghost: 'text-blue-600 hover:bg-blue-50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      onClick={handleDownload}
      className={\`\${baseStyles} \${variants[variant]} \${sizes[size]} \${className}\`}
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      {children || 'Download PDF'}
    </button>
  );
};
`,

        // PDF Page Navigator
        PDFPageNavigator: `
import React from 'react';

interface PDFPageNavigatorProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showInput?: boolean;
  showFirstLast?: boolean;
  className?: string;
}

export const PDFPageNavigator: React.FC<PDFPageNavigatorProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showInput = true,
  showFirstLast = true,
  className = '',
}) => {
  const goToPage = (page: number) => {
    const newPage = Math.max(1, Math.min(totalPages, page));
    onPageChange(newPage);
  };

  return (
    <div className={\`flex items-center gap-2 \${className}\`}>
      {showFirstLast && (
        <button
          onClick={() => goToPage(1)}
          disabled={currentPage <= 1}
          className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          title="First page"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      )}

      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Previous page"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {showInput ? (
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={currentPage}
            onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
            className="w-16 px-2 py-1 text-center border rounded"
            min={1}
            max={totalPages}
          />
          <span className="text-gray-500">of {totalPages}</span>
        </div>
      ) : (
        <span className="px-3 text-gray-700">
          {currentPage} / {totalPages}
        </span>
      )}

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Next page"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {showFirstLast && (
        <button
          onClick={() => goToPage(totalPages)}
          disabled={currentPage >= totalPages}
          className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Last page"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
};
`,
      },
    },

    ios: {
      dependencies: ['SwiftUI', 'PDFKit'],
      minimumVersion: '15.0',
      components: {
        // Native PDF Viewer
        PDFViewerView: `
import SwiftUI
import PDFKit

// MARK: - PDF Viewer View
struct PDFViewerView: View {
    let url: URL
    @State private var currentPage: Int = 1
    @State private var totalPages: Int = 0
    @State private var zoom: CGFloat = 1.0
    @State private var showThumbnails: Bool = false
    @State private var searchText: String = ""
    @State private var isSearching: Bool = false

    var onPageChange: ((Int) -> Void)?
    var onError: ((Error) -> Void)?

    var body: some View {
        GeometryReader { geometry in
            HStack(spacing: 0) {
                // Thumbnails sidebar
                if showThumbnails {
                    ThumbnailSidebar(
                        url: url,
                        currentPage: currentPage,
                        onPageSelect: { page in
                            currentPage = page
                            onPageChange?(page)
                        }
                    )
                    .frame(width: 120)
                    .transition(.move(edge: .leading))
                }

                // Main PDF view
                VStack(spacing: 0) {
                    // Toolbar
                    PDFToolbar(
                        currentPage: $currentPage,
                        totalPages: totalPages,
                        zoom: $zoom,
                        showThumbnails: $showThumbnails,
                        searchText: $searchText,
                        isSearching: $isSearching,
                        onPageChange: onPageChange
                    )

                    // PDF content
                    PDFKitView(
                        url: url,
                        currentPage: $currentPage,
                        zoom: $zoom,
                        searchText: searchText,
                        onLoad: { pages in
                            totalPages = pages
                        },
                        onError: onError
                    )
                }
            }
        }
        .animation(.easeInOut, value: showThumbnails)
    }
}

// MARK: - PDFKit Wrapper
struct PDFKitView: UIViewRepresentable {
    let url: URL
    @Binding var currentPage: Int
    @Binding var zoom: CGFloat
    let searchText: String
    var onLoad: ((Int) -> Void)?
    var onError: ((Error) -> Void)?

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    func makeUIView(context: Context) -> PDFView {
        let pdfView = PDFView()
        pdfView.autoScales = true
        pdfView.displayMode = .singlePageContinuous
        pdfView.displayDirection = .vertical
        pdfView.delegate = context.coordinator

        // Load document
        if let document = PDFDocument(url: url) {
            pdfView.document = document
            onLoad?(document.pageCount)
        } else {
            onError?(NSError(
                domain: "PDFViewer",
                code: -1,
                userInfo: [NSLocalizedDescriptionKey: "Failed to load PDF"]
            ))
        }

        // Add notification observer for page changes
        NotificationCenter.default.addObserver(
            context.coordinator,
            selector: #selector(Coordinator.pageChanged),
            name: .PDFViewPageChanged,
            object: pdfView
        )

        return pdfView
    }

    func updateUIView(_ pdfView: PDFView, context: Context) {
        pdfView.scaleFactor = zoom

        // Go to page if changed externally
        if let document = pdfView.document,
           let page = document.page(at: currentPage - 1),
           pdfView.currentPage != page {
            pdfView.go(to: page)
        }

        // Handle search
        if !searchText.isEmpty {
            pdfView.document?.findString(searchText, withOptions: .caseInsensitive)
        }
    }

    class Coordinator: NSObject, PDFViewDelegate {
        var parent: PDFKitView

        init(_ parent: PDFKitView) {
            self.parent = parent
        }

        @objc func pageChanged(_ notification: Notification) {
            guard let pdfView = notification.object as? PDFView,
                  let currentPage = pdfView.currentPage,
                  let document = pdfView.document,
                  let pageIndex = document.index(for: currentPage) else { return }

            DispatchQueue.main.async {
                self.parent.currentPage = pageIndex + 1
            }
        }
    }
}

// MARK: - PDF Toolbar
struct PDFToolbar: View {
    @Binding var currentPage: Int
    let totalPages: Int
    @Binding var zoom: CGFloat
    @Binding var showThumbnails: Bool
    @Binding var searchText: String
    @Binding var isSearching: Bool
    var onPageChange: ((Int) -> Void)?

    var body: some View {
        HStack(spacing: 16) {
            // Thumbnails toggle
            Button(action: { showThumbnails.toggle() }) {
                Image(systemName: "sidebar.left")
                    .foregroundColor(showThumbnails ? .blue : .primary)
            }

            Divider().frame(height: 20)

            // Page navigation
            HStack(spacing: 8) {
                Button(action: {
                    if currentPage > 1 {
                        currentPage -= 1
                        onPageChange?(currentPage)
                    }
                }) {
                    Image(systemName: "chevron.left")
                }
                .disabled(currentPage <= 1)

                Text("\\(currentPage) / \\(totalPages)")
                    .font(.system(.body, design: .monospaced))
                    .frame(minWidth: 80)

                Button(action: {
                    if currentPage < totalPages {
                        currentPage += 1
                        onPageChange?(currentPage)
                    }
                }) {
                    Image(systemName: "chevron.right")
                }
                .disabled(currentPage >= totalPages)
            }

            Divider().frame(height: 20)

            // Zoom controls
            HStack(spacing: 8) {
                Button(action: { zoom = max(0.5, zoom - 0.25) }) {
                    Image(systemName: "minus.magnifyingglass")
                }
                .disabled(zoom <= 0.5)

                Text("\\(Int(zoom * 100))%")
                    .font(.system(.body, design: .monospaced))
                    .frame(minWidth: 50)

                Button(action: { zoom = min(3.0, zoom + 0.25) }) {
                    Image(systemName: "plus.magnifyingglass")
                }
                .disabled(zoom >= 3.0)
            }

            Spacer()

            // Search
            if isSearching {
                HStack {
                    TextField("Search...", text: $searchText)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .frame(width: 200)

                    Button(action: { isSearching = false; searchText = "" }) {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundColor(.secondary)
                    }
                }
            } else {
                Button(action: { isSearching = true }) {
                    Image(systemName: "magnifyingglass")
                }
            }
        }
        .padding(.horizontal)
        .padding(.vertical, 8)
        .background(Color(.systemBackground))
        .overlay(
            Divider(), alignment: .bottom
        )
    }
}

// MARK: - Thumbnail Sidebar
struct ThumbnailSidebar: View {
    let url: URL
    let currentPage: Int
    let onPageSelect: (Int) -> Void

    @State private var thumbnails: [Int: UIImage] = [:]

    var body: some View {
        ScrollViewReader { proxy in
            ScrollView {
                LazyVStack(spacing: 8) {
                    if let document = PDFDocument(url: url) {
                        ForEach(0..<document.pageCount, id: \\.self) { index in
                            ThumbnailCell(
                                page: document.page(at: index),
                                pageNumber: index + 1,
                                isSelected: currentPage == index + 1,
                                onTap: { onPageSelect(index + 1) }
                            )
                            .id(index)
                        }
                    }
                }
                .padding(8)
            }
            .background(Color(.systemGray6))
            .onChange(of: currentPage) { newPage in
                withAnimation {
                    proxy.scrollTo(newPage - 1, anchor: .center)
                }
            }
        }
    }
}

struct ThumbnailCell: View {
    let page: PDFPage?
    let pageNumber: Int
    let isSelected: Bool
    let onTap: () -> Void

    @State private var thumbnail: UIImage?

    var body: some View {
        VStack(spacing: 4) {
            if let thumbnail = thumbnail {
                Image(uiImage: thumbnail)
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(height: 120)
                    .cornerRadius(4)
                    .overlay(
                        RoundedRectangle(cornerRadius: 4)
                            .stroke(isSelected ? Color.blue : Color.clear, lineWidth: 2)
                    )
            } else {
                Rectangle()
                    .fill(Color(.systemGray5))
                    .frame(height: 120)
                    .cornerRadius(4)
            }

            Text("\\(pageNumber)")
                .font(.caption)
                .foregroundColor(isSelected ? .blue : .secondary)
        }
        .onTapGesture(perform: onTap)
        .onAppear {
            generateThumbnail()
        }
    }

    private func generateThumbnail() {
        guard let page = page else { return }

        DispatchQueue.global(qos: .userInitiated).async {
            let thumbnail = page.thumbnail(of: CGSize(width: 100, height: 140), for: .mediaBox)

            DispatchQueue.main.async {
                self.thumbnail = thumbnail
            }
        }
    }
}

// MARK: - Simple PDF Preview
struct SimplePDFPreview: View {
    let url: URL
    @State private var document: PDFDocument?

    var body: some View {
        Group {
            if let document = document {
                PDFKitRepresentable(document: document)
            } else {
                ProgressView("Loading PDF...")
            }
        }
        .onAppear {
            document = PDFDocument(url: url)
        }
    }
}

struct PDFKitRepresentable: UIViewRepresentable {
    let document: PDFDocument

    func makeUIView(context: Context) -> PDFView {
        let pdfView = PDFView()
        pdfView.document = document
        pdfView.autoScales = true
        return pdfView
    }

    func updateUIView(_ pdfView: PDFView, context: Context) {}
}

// MARK: - Usage Example
struct PDFViewerExample: View {
    let pdfURL = Bundle.main.url(forResource: "sample", withExtension: "pdf")!

    var body: some View {
        NavigationView {
            PDFViewerView(
                url: pdfURL,
                onPageChange: { page in
                    print("Page changed to: \\(page)")
                },
                onError: { error in
                    print("Error: \\(error)")
                }
            )
            .navigationTitle("Document")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}
`,
      },
    },

    android: {
      dependencies: [
        'androidx.compose.ui:ui',
        'androidx.compose.material3:material3',
        'com.github.ArtifexSoftware:mupdf-android-viewer-mini:1.24.5',
      ],
      minimumSdk: 24,
      components: {
        // Compose PDF Viewer
        PDFViewer: `
package com.hublab.capsules.pdfviewer

import android.content.Context
import android.graphics.Bitmap
import android.graphics.pdf.PdfRenderer
import android.net.Uri
import android.os.ParcelFileDescriptor
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.io.File

// Data classes
data class PDFPage(
    val index: Int,
    val bitmap: Bitmap?,
    val width: Int,
    val height: Int
)

sealed class PDFViewerState {
    object Loading : PDFViewerState()
    data class Ready(val totalPages: Int) : PDFViewerState()
    data class Error(val message: String) : PDFViewerState()
}

// Main PDF Viewer Composable
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PDFViewer(
    uri: Uri,
    modifier: Modifier = Modifier,
    initialPage: Int = 1,
    showToolbar: Boolean = true,
    showThumbnails: Boolean = false,
    theme: PDFTheme = PDFTheme.LIGHT,
    onPageChange: (Int) -> Unit = {},
    onError: (String) -> Unit = {}
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()

    var state by remember { mutableStateOf<PDFViewerState>(PDFViewerState.Loading) }
    var currentPage by remember { mutableStateOf(initialPage) }
    var zoom by remember { mutableStateOf(1f) }
    var offset by remember { mutableStateOf(Offset.Zero) }
    var thumbnailsVisible by remember { mutableStateOf(showThumbnails) }
    var renderer by remember { mutableStateOf<PdfRenderer?>(null) }
    var currentBitmap by remember { mutableStateOf<Bitmap?>(null) }

    // Theme colors
    val backgroundColor = when (theme) {
        PDFTheme.LIGHT -> Color.White
        PDFTheme.DARK -> Color(0xFF1E1E1E)
        PDFTheme.SEPIA -> Color(0xFFF5E6D3)
    }

    // Load PDF
    LaunchedEffect(uri) {
        withContext(Dispatchers.IO) {
            try {
                val fileDescriptor = context.contentResolver.openFileDescriptor(uri, "r")
                fileDescriptor?.let { fd ->
                    val pdfRenderer = PdfRenderer(fd)
                    renderer = pdfRenderer
                    state = PDFViewerState.Ready(pdfRenderer.pageCount)

                    // Render first page
                    renderPage(pdfRenderer, currentPage - 1)?.let {
                        currentBitmap = it
                    }
                }
            } catch (e: Exception) {
                state = PDFViewerState.Error(e.message ?: "Failed to load PDF")
                onError(e.message ?: "Failed to load PDF")
            }
        }
    }

    // Render page when changed
    LaunchedEffect(currentPage) {
        renderer?.let { r ->
            withContext(Dispatchers.IO) {
                renderPage(r, currentPage - 1)?.let {
                    currentBitmap = it
                }
            }
        }
        onPageChange(currentPage)
    }

    // Cleanup
    DisposableEffect(Unit) {
        onDispose {
            renderer?.close()
        }
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(backgroundColor)
    ) {
        // Toolbar
        if (showToolbar) {
            PDFToolbar(
                currentPage = currentPage,
                totalPages = (state as? PDFViewerState.Ready)?.totalPages ?: 0,
                zoom = zoom,
                thumbnailsVisible = thumbnailsVisible,
                onPageChange = { page ->
                    currentPage = page.coerceIn(1, (state as? PDFViewerState.Ready)?.totalPages ?: 1)
                },
                onZoomChange = { zoom = it.coerceIn(0.5f, 3f) },
                onThumbnailsToggle = { thumbnailsVisible = !thumbnailsVisible }
            )
        }

        Row(modifier = Modifier.weight(1f)) {
            // Thumbnails sidebar
            if (thumbnailsVisible && state is PDFViewerState.Ready) {
                ThumbnailSidebar(
                    renderer = renderer,
                    totalPages = (state as PDFViewerState.Ready).totalPages,
                    currentPage = currentPage,
                    onPageSelect = { currentPage = it }
                )
            }

            // PDF content
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxHeight(),
                contentAlignment = Alignment.Center
            ) {
                when (val currentState = state) {
                    is PDFViewerState.Loading -> {
                        CircularProgressIndicator()
                    }

                    is PDFViewerState.Error -> {
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Icon(
                                imageVector = Icons.Default.Error,
                                contentDescription = null,
                                modifier = Modifier.size(48.dp),
                                tint = MaterialTheme.colorScheme.error
                            )
                            Spacer(modifier = Modifier.height(16.dp))
                            Text(
                                text = currentState.message,
                                color = MaterialTheme.colorScheme.error
                            )
                        }
                    }

                    is PDFViewerState.Ready -> {
                        currentBitmap?.let { bitmap ->
                            PDFPageView(
                                bitmap = bitmap,
                                zoom = zoom,
                                offset = offset,
                                onZoomChange = { zoom = it.coerceIn(0.5f, 3f) },
                                onOffsetChange = { offset = it }
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun PDFPageView(
    bitmap: Bitmap,
    zoom: Float,
    offset: Offset,
    onZoomChange: (Float) -> Unit,
    onOffsetChange: (Offset) -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .pointerInput(Unit) {
                detectTransformGestures { _, pan, gestureZoom, _ ->
                    onZoomChange(zoom * gestureZoom)
                    onOffsetChange(offset + pan)
                }
            }
            .graphicsLayer {
                scaleX = zoom
                scaleY = zoom
                translationX = offset.x
                translationY = offset.y
            },
        contentAlignment = Alignment.Center
    ) {
        Canvas(
            modifier = Modifier
                .aspectRatio(bitmap.width.toFloat() / bitmap.height)
                .fillMaxSize()
        ) {
            drawImage(bitmap.asImageBitmap())
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun PDFToolbar(
    currentPage: Int,
    totalPages: Int,
    zoom: Float,
    thumbnailsVisible: Boolean,
    onPageChange: (Int) -> Unit,
    onZoomChange: (Float) -> Unit,
    onThumbnailsToggle: () -> Unit
) {
    TopAppBar(
        title = { },
        navigationIcon = {
            IconButton(onClick = onThumbnailsToggle) {
                Icon(
                    imageVector = if (thumbnailsVisible) Icons.Default.MenuOpen else Icons.Default.Menu,
                    contentDescription = "Toggle thumbnails"
                )
            }
        },
        actions = {
            // Page navigation
            IconButton(
                onClick = { onPageChange(currentPage - 1) },
                enabled = currentPage > 1
            ) {
                Icon(Icons.Default.ChevronLeft, "Previous page")
            }

            Text(
                text = "$currentPage / $totalPages",
                modifier = Modifier.padding(horizontal = 8.dp)
            )

            IconButton(
                onClick = { onPageChange(currentPage + 1) },
                enabled = currentPage < totalPages
            ) {
                Icon(Icons.Default.ChevronRight, "Next page")
            }

            Divider(
                modifier = Modifier
                    .height(24.dp)
                    .width(1.dp)
                    .padding(horizontal = 8.dp)
            )

            // Zoom controls
            IconButton(
                onClick = { onZoomChange(zoom - 0.25f) },
                enabled = zoom > 0.5f
            ) {
                Icon(Icons.Default.ZoomOut, "Zoom out")
            }

            Text(
                text = "${(zoom * 100).toInt()}%",
                modifier = Modifier.padding(horizontal = 4.dp)
            )

            IconButton(
                onClick = { onZoomChange(zoom + 0.25f) },
                enabled = zoom < 3f
            ) {
                Icon(Icons.Default.ZoomIn, "Zoom in")
            }
        }
    )
}

@Composable
private fun ThumbnailSidebar(
    renderer: PdfRenderer?,
    totalPages: Int,
    currentPage: Int,
    onPageSelect: (Int) -> Unit
) {
    val scope = rememberCoroutineScope()
    var thumbnails by remember { mutableStateOf<Map<Int, Bitmap>>(emptyMap()) }

    LaunchedEffect(renderer) {
        renderer?.let { r ->
            withContext(Dispatchers.IO) {
                val newThumbnails = mutableMapOf<Int, Bitmap>()
                for (i in 0 until totalPages) {
                    renderPage(r, i, 100)?.let { bitmap ->
                        newThumbnails[i] = bitmap
                    }
                }
                thumbnails = newThumbnails
            }
        }
    }

    LazyColumn(
        modifier = Modifier
            .width(100.dp)
            .fillMaxHeight()
            .background(MaterialTheme.colorScheme.surfaceVariant),
        contentPadding = PaddingValues(8.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        items(totalPages) { index ->
            ThumbnailItem(
                thumbnail = thumbnails[index],
                pageNumber = index + 1,
                isSelected = currentPage == index + 1,
                onClick = { onPageSelect(index + 1) }
            )
        }
    }
}

@Composable
private fun ThumbnailItem(
    thumbnail: Bitmap?,
    pageNumber: Int,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(8.dp))
            .background(
                if (isSelected) MaterialTheme.colorScheme.primaryContainer
                else MaterialTheme.colorScheme.surface
            )
            .clickable(onClick = onClick)
            .padding(4.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        thumbnail?.let { bitmap ->
            Canvas(
                modifier = Modifier
                    .fillMaxWidth()
                    .aspectRatio(bitmap.width.toFloat() / bitmap.height)
            ) {
                drawImage(bitmap.asImageBitmap())
            }
        } ?: Box(
            modifier = Modifier
                .fillMaxWidth()
                .aspectRatio(0.7f)
                .background(Color.LightGray)
        )

        Spacer(modifier = Modifier.height(4.dp))

        Text(
            text = pageNumber.toString(),
            style = MaterialTheme.typography.labelSmall,
            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
            color = if (isSelected)
                MaterialTheme.colorScheme.primary
            else
                MaterialTheme.colorScheme.onSurface
        )
    }
}

// Helper function to render a PDF page
private fun renderPage(renderer: PdfRenderer, pageIndex: Int, maxWidth: Int = 1000): Bitmap? {
    if (pageIndex < 0 || pageIndex >= renderer.pageCount) return null

    return try {
        val page = renderer.openPage(pageIndex)
        val scale = maxWidth.toFloat() / page.width
        val width = (page.width * scale).toInt()
        val height = (page.height * scale).toInt()

        val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
        bitmap.eraseColor(android.graphics.Color.WHITE)

        page.render(bitmap, null, null, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY)
        page.close()

        bitmap
    } catch (e: Exception) {
        null
    }
}

// Theme enum
enum class PDFTheme {
    LIGHT, DARK, SEPIA
}

// Extension to make clickable
private fun Modifier.clickable(onClick: () -> Unit): Modifier = this.pointerInput(Unit) {
    detectTapGestures(onTap = { onClick() })
}
`,
      },
    },

    desktop: {
      dependencies: ['tauri', 'react', 'tailwindcss', 'pdfjs-dist'],
      components: {
        // Desktop PDF Viewer
        DesktopPDFViewer: `
import React, { useState, useCallback, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = \`//cdnjs.cloudflare.com/ajax/libs/pdf.js/\${pdfjsLib.version}/pdf.worker.min.js\`;

declare global {
  interface Window {
    __TAURI__?: {
      dialog: {
        open: (options: { filters?: Array<{ name: string; extensions: string[] }> }) => Promise<string | null>;
      };
      fs: {
        readBinaryFile: (path: string) => Promise<Uint8Array>;
      };
    };
  }
}

interface DesktopPDFViewerProps {
  initialFile?: string;
  theme?: 'light' | 'dark' | 'sepia';
  onFileOpen?: (path: string) => void;
  className?: string;
}

export const DesktopPDFViewer: React.FC<DesktopPDFViewerProps> = ({
  initialFile,
  theme = 'light',
  onFileOpen,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdf, setPdf] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [filePath, setFilePath] = useState<string | null>(initialFile || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [thumbnails, setThumbnails] = useState<Map<number, string>>(new Map());

  // Theme styles
  const themeStyles = {
    light: {
      bg: 'bg-gray-100',
      sidebar: 'bg-white border-gray-200',
      toolbar: 'bg-white border-gray-200',
      text: 'text-gray-900',
    },
    dark: {
      bg: 'bg-gray-900',
      sidebar: 'bg-gray-800 border-gray-700',
      toolbar: 'bg-gray-800 border-gray-700',
      text: 'text-gray-100',
    },
    sepia: {
      bg: 'bg-amber-50',
      sidebar: 'bg-amber-100 border-amber-200',
      toolbar: 'bg-amber-100 border-amber-200',
      text: 'text-amber-900',
    },
  }[theme];

  // Open file dialog
  const handleOpenFile = useCallback(async () => {
    if (window.__TAURI__) {
      const selected = await window.__TAURI__.dialog.open({
        filters: [{ name: 'PDF', extensions: ['pdf'] }],
      });

      if (selected && typeof selected === 'string') {
        setFilePath(selected);
        onFileOpen?.(selected);
      }
    } else {
      // Web fallback
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.pdf';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const url = URL.createObjectURL(file);
          setFilePath(url);
          onFileOpen?.(file.name);
        }
      };
      input.click();
    }
  }, [onFileOpen]);

  // Load PDF
  useEffect(() => {
    if (!filePath) return;

    const loadPDF = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let data: ArrayBuffer;

        if (window.__TAURI__ && !filePath.startsWith('blob:')) {
          const bytes = await window.__TAURI__.fs.readBinaryFile(filePath);
          data = bytes.buffer;
        } else {
          const response = await fetch(filePath);
          data = await response.arrayBuffer();
        }

        const pdfDoc = await pdfjsLib.getDocument({ data }).promise;
        setPdf(pdfDoc);
        setNumPages(pdfDoc.pageCount);
        setCurrentPage(1);

        // Generate thumbnails
        const thumbs = new Map<number, string>();
        for (let i = 1; i <= Math.min(pdfDoc.pageCount, 50); i++) {
          const page = await pdfDoc.getPage(i);
          const viewport = page.getViewport({ scale: 0.2 });
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: ctx, viewport }).promise;
          thumbs.set(i, canvas.toDataURL('image/jpeg', 0.5));
        }
        setThumbnails(thumbs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load PDF');
      } finally {
        setIsLoading(false);
      }
    };

    loadPDF();
  }, [filePath]);

  // Render current page
  useEffect(() => {
    if (!pdf || !canvasRef.current) return;

    const renderPage = async () => {
      const page = await pdf.getPage(currentPage);
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;

      const container = containerRef.current;
      let scale = zoom;

      if (container) {
        const viewport = page.getViewport({ scale: 1 });
        scale = Math.min(
          (container.clientWidth - 48) / viewport.width,
          (container.clientHeight - 48) / viewport.height
        ) * zoom;
      }

      const viewport = page.getViewport({ scale });
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: ctx, viewport }).promise;
    };

    renderPage();
  }, [pdf, currentPage, zoom]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      switch (e.key) {
        case 'ArrowLeft':
          setCurrentPage(p => Math.max(1, p - 1));
          break;
        case 'ArrowRight':
          setCurrentPage(p => Math.min(numPages, p + 1));
          break;
        case 'o':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            handleOpenFile();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [numPages, handleOpenFile]);

  return (
    <div className={\`flex flex-col h-full \${themeStyles.bg} \${className}\`}>
      {/* Toolbar */}
      <div className={\`flex items-center gap-4 px-4 py-2 \${themeStyles.toolbar} border-b\`}>
        <button
          onClick={handleOpenFile}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
          </svg>
          Open
        </button>

        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={\`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 \${sidebarOpen ? 'bg-blue-100 text-blue-600' : ''}\`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </button>

        {pdf && (
          <>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <span className={\`\${themeStyles.text} min-w-[80px] text-center\`}>
                {currentPage} / {numPages}
              </span>

              <button
                onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))}
                disabled={currentPage >= numPages}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />

            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
                disabled={zoom <= 0.5}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                </svg>
              </button>

              <span className={\`\${themeStyles.text} min-w-[50px] text-center\`}>
                {Math.round(zoom * 100)}%
              </span>

              <button
                onClick={() => setZoom(z => Math.min(3, z + 0.25))}
                disabled={zoom >= 3}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Thumbnails sidebar */}
        {sidebarOpen && pdf && (
          <div className={\`w-40 \${themeStyles.sidebar} border-r overflow-y-auto\`}>
            <div className="p-2 space-y-2">
              {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={\`
                    w-full p-2 rounded text-center transition-colors
                    \${currentPage === pageNum
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  \`}
                >
                  {thumbnails.has(pageNum) ? (
                    <img
                      src={thumbnails.get(pageNum)}
                      alt={\`Page \${pageNum}\`}
                      className="w-full rounded border"
                    />
                  ) : (
                    <div className="aspect-[3/4] bg-gray-200 rounded" />
                  )}
                  <span className={\`text-xs mt-1 block \${themeStyles.text}\`}>
                    {pageNum}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PDF canvas */}
        <div
          ref={containerRef}
          className="flex-1 overflow-auto flex items-center justify-center p-6"
        >
          {isLoading && (
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              <p className={\`mt-4 \${themeStyles.text}\`}>Loading...</p>
            </div>
          )}

          {error && (
            <div className="text-center">
              <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {!isLoading && !error && !pdf && (
            <button
              onClick={handleOpenFile}
              className="flex flex-col items-center gap-4 p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors"
            >
              <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className={\`\${themeStyles.text} font-medium\`}>Open PDF file</span>
              <span className="text-gray-400 text-sm">or drag and drop</span>
            </button>
          )}

          {pdf && (
            <canvas ref={canvasRef} className="shadow-xl rounded" />
          )}
        </div>
      </div>
    </div>
  );
};
`,
      },
    },
  },

  examples: [
    {
      title: 'Basic PDF Viewer',
      description: 'Full-featured PDF viewer with toolbar',
      code: `
<PDFViewer
  source="/documents/sample.pdf"
  showToolbar={true}
  showThumbnails={true}
  showSearch={true}
  theme="light"
  onPageChange={(page) => console.log('Page:', page)}
  onDocumentLoad={(pages) => console.log('Total pages:', pages)}
/>
`,
    },
    {
      title: 'Simple PDF Embed',
      description: 'Browser-native PDF embedding',
      code: `
<PDFEmbed
  source="/documents/report.pdf"
  title="Annual Report"
  height="800px"
/>
`,
    },
    {
      title: 'PDF Download Button',
      description: 'Button to download PDF file',
      code: `
<PDFDownloadButton
  source="/documents/manual.pdf"
  filename="user-manual.pdf"
  variant="primary"
>
  Download Manual
</PDFDownloadButton>
`,
    },
    {
      title: 'Dark Theme Viewer',
      description: 'PDF viewer with dark theme',
      code: `
<PDFViewer
  source={pdfUrl}
  theme="dark"
  pageMode="continuous"
  fitMode="width"
  initialZoom={1.5}
/>
`,
    },
  ],
}
