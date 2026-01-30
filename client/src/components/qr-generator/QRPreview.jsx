import { useQRCode } from '../../hooks/useQRCode';

const QRPreview = ({ value, design }) => {
  if (!value) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-400">QR Code preview will appear here</p>
      </div>
    );
  }

  // Special handling for image upload preview
  if (value === 'QR Code will be generated after saving') {
    return (
      <div className="lg:sticky lg:top-4">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 text-center">Preview</h3>
          
          <div className="flex justify-center">
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center p-4">
                <p className="text-gray-600 font-medium mb-2">📸 Images Ready</p>
                <p className="text-gray-400 text-sm">QR Code will be generated</p>
                <p className="text-gray-400 text-sm">after saving</p>
              </div>
            </div>
          </div>

          <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-600 text-center">✓ Your images are uploaded and ready. The QR code will link to your gallery.</p>
          </div>
        </div>
      </div>
    );
  }

  const qrOptions = {
    width: 256,
    height: 256,
    data: value,
    margin: 10,
    qrOptions: {
      typeNumber: 0,
      mode: 'Byte',
      errorCorrectionLevel: 'H'
    },
    dotsOptions: {
      color: design.fgColor || '#000000',
      type: design.dotStyle || 'rounded'
    },
    cornersSquareOptions: {
      color: design.fgColor || '#000000',
      type: design.cornerStyle || 'extra-rounded'
    },
    cornersDotOptions: {
      color: design.fgColor || '#000000',
      type: 'dot'
    },
    backgroundOptions: {
      color: design.bgColor || '#ffffff',
    },
    imageOptions: {
      crossOrigin: 'anonymous',
      margin: 10
    },
    image: design.logo || undefined
  };

  const { qrCodeRef } = useQRCode(qrOptions);

  return (
    <div className="lg:sticky lg:top-4">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 text-center">Preview</h3>
        
        <div className="flex justify-center">
          <div
            className={`p-3 sm:p-4 bg-white ${
              design.frame === 'rounded'
                ? 'rounded-2xl'
                : design.frame === 'circle'
                ? 'rounded-full overflow-hidden'
                : design.frame === 'square'
                ? 'rounded-lg'
                : ''
            } ${design.frame !== 'none' ? 'shadow-md border-4 border-gray-200' : ''}`}
            style={{
              backgroundColor: design.bgColor,
              width: design.frame === 'circle' ? '288px' : 'auto',
              height: design.frame === 'circle' ? '288px' : 'auto',
              display: design.frame === 'circle' ? 'flex' : 'block',
              alignItems: design.frame === 'circle' ? 'center' : 'initial',
              justifyContent: design.frame === 'circle' ? 'center' : 'initial',
            }}
          >
            <div ref={qrCodeRef} />
          </div>
        </div>

        <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center break-all">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default QRPreview;
