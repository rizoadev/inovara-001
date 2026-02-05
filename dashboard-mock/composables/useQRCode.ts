import QRCode from 'qrcode'

export const useQRCode = () => {
  const generateQR = async (text: string): Promise<string> => {
    try {
      // Generate QR code as data URL
      const dataUrl = await QRCode.toDataURL(text, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      return dataUrl
    } catch (error) {
      console.error('Error generating QR code:', error)
      throw error
    }
  }

  const downloadQR = async (text: string, filename: string = 'qrcode.png') => {
    try {
      const dataUrl = await generateQR(text)
      
      // Create download link
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = filename
      link.click()
    } catch (error) {
      console.error('Error downloading QR code:', error)
      throw error
    }
  }

  return {
    generateQR,
    downloadQR
  }
}
