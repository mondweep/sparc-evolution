/**
 * Utility functions for handling file downloads
 */

/**
 * Download a blob as a file
 * @param {Blob} blob - The blob to download
 * @param {string} filename - The filename for the download
 */
export const downloadBlob = (blob, filename) => {
  try {
    // Create a URL for the blob
    const url = window.URL.createObjectURL(blob)
    
    // Create a temporary anchor element
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    anchor.style.display = 'none'
    
    // Add to DOM, click, and remove
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    
    // Clean up the URL
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading file:', error)
    throw new Error('Failed to download file. Please try again.')
  }
}

/**
 * Download data as a JSON file
 * @param {Object} data - The data to export
 * @param {string} filename - The filename (without extension)
 */
export const downloadJSON = (data, filename) => {
  try {
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    downloadBlob(blob, `${filename}.json`)
  } catch (error) {
    console.error('Error downloading JSON:', error)
    throw new Error('Failed to export JSON data.')
  }
}

/**
 * Download text content as a file
 * @param {string} content - The text content
 * @param {string} filename - The filename with extension
 * @param {string} mimeType - The MIME type (default: text/plain)
 */
export const downloadText = (content, filename, mimeType = 'text/plain') => {
  try {
    const blob = new Blob([content], { type: mimeType })
    downloadBlob(blob, filename)
  } catch (error) {
    console.error('Error downloading text file:', error)
    throw new Error('Failed to export text file.')
  }
}

/**
 * Extract filename from Content-Disposition header or create a default
 * @param {Object} response - Axios response object
 * @param {string} defaultName - Default filename if not found in headers
 * @returns {string} The filename
 */
export const getFilenameFromResponse = (response, defaultName = 'download') => {
  try {
    const contentDisposition = response.headers['content-disposition']
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
      if (filenameMatch && filenameMatch[1]) {
        return filenameMatch[1].replace(/['"]/g, '')
      }
    }
    
    // If no filename in headers, create one based on content type
    const contentType = response.headers['content-type']
    if (contentType) {
      if (contentType.includes('pdf')) return `${defaultName}.pdf`
      if (contentType.includes('json')) return `${defaultName}.json`
      if (contentType.includes('csv')) return `${defaultName}.csv`
      if (contentType.includes('markdown')) return `${defaultName}.md`
    }
    
    return defaultName
  } catch (error) {
    console.error('Error extracting filename:', error)
    return defaultName
  }
}

/**
 * Handle API response for file downloads
 * @param {Promise} apiCall - The API call promise
 * @param {string} defaultFilename - Default filename if not in response
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
export const handleExportDownload = async (apiCall, defaultFilename, onSuccess, onError) => {
  try {
    const response = await apiCall
    const filename = getFilenameFromResponse(response, defaultFilename)
    
    downloadBlob(response.data, filename)
    
    if (onSuccess) {
      onSuccess(filename)
    }
  } catch (error) {
    console.error('Export download failed:', error)
    
    let errorMessage = 'Export failed. Please try again.'
    
    if (error.response) {
      // Server responded with error
      if (error.response.status === 501) {
        errorMessage = 'Export feature not available. Please contact support.'
      } else if (error.response.status === 403) {
        errorMessage = 'You do not have permission to export this content.'
      } else if (error.response.status === 404) {
        errorMessage = 'Content not found or no longer available.'
      }
    } else if (error.request) {
      // Network error
      errorMessage = 'Network error. Please check your connection.'
    }
    
    if (onError) {
      onError(errorMessage)
    } else {
      throw new Error(errorMessage)
    }
  }
}

/**
 * Format current date for filenames
 * @returns {string} Formatted date string (YYYY-MM-DD)
 */
export const getCurrentDateString = () => {
  return new Date().toISOString().split('T')[0]
}

/**
 * Create export filename with timestamp
 * @param {string} prefix - Filename prefix
 * @param {string} extension - File extension (with dot)
 * @param {boolean} includeTime - Include time in filename
 * @returns {string} Generated filename
 */
export const createExportFilename = (prefix, extension, includeTime = false) => {
  const date = new Date()
  const dateString = date.toISOString().split('T')[0]
  
  if (includeTime) {
    const timeString = date.toISOString().split('T')[1].split('.')[0].replace(/:/g, '-')
    return `${prefix}_${dateString}_${timeString}${extension}`
  }
  
  return `${prefix}_${dateString}${extension}`
}