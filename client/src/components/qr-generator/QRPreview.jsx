import { QRCodeSVG } from 'qrcode.react';

const QRPreview = ({ value, design }) => {
  if (!value) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-400">QR Code preview will appear here</p>
      </div>
    );
  }

  const getQRValue = () => {
    // Return the formatted value based on QR type
    return value;
  };

  return (
    <div className="sticky top-4">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Preview</h3>
        
        <div className="flex justify-center">
          <div
            className={`p-4 bg-white ${
              design.frame === 'rounded'
                ? 'rounded-2xl'
                : design.frame === 'circle'
                ? 'rounded-full'
                : design.frame === 'square'
                ? 'rounded-lg'
                : ''
            } ${design.frame !== 'none' ? 'shadow-md border-4 border-gray-200' : ''}`}
            style={{
              backgroundColor: design.bgColor,
            }}
          >
            <div className="relative">
              <QRCodeSVG
                value={getQRValue()}
                size={256}
                level="H"
                includeMargin={true}
                fgColor={design.fgColor}
                bgColor={design.bgColor}
                imageSettings={
                  design.logo
                    ? {
                        src: design.logo,
                        height: 48,
                        width: 48,
                        excavate: true,
                      }
                    : undefined
                }
              />
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center break-all">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default QRPreview;
