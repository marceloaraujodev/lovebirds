import QRCode from 'qrcode';

// generate qr code for user
const generateQRCode = async (text) => {
  try {
    return await QRCode.toDataURL(text);
  } catch (err) {
    console.error(err)
  }
};

export default generateQRCode;
