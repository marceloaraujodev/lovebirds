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
// const qrcode = await generateQR(`http://localhost:3000/${url}`);
// console.log(qrcode)