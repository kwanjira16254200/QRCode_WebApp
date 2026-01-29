import { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';

export const useQRCode = (options) => {
  const qrCodeRef = useRef(null);
  const qrCodeInstance = useRef(null);

  useEffect(() => {
    if (!qrCodeInstance.current) {
      qrCodeInstance.current = new QRCodeStyling(options);
    } else {
      qrCodeInstance.current.update(options);
    }

    if (qrCodeRef.current) {
      qrCodeRef.current.innerHTML = '';
      qrCodeInstance.current.append(qrCodeRef.current);
    }
  }, [options]);

  const download = (format = 'png', name = 'qrcode') => {
    qrCodeInstance.current.download({
      extension: format,
      name: name
    });
  };

  return { qrCodeRef, download };
};
