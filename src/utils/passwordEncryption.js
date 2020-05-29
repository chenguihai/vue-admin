import CryptoJS from 'crypto-js' // AES包
import { JSEncrypt } from 'jsencrypt' // RSA包

// AES加密
const key = CryptoJS.enc.Utf8.parse('1234123412ABCDEF') // 十六位十六进制数作为密钥
const iv = CryptoJS.enc.Utf8.parse('ABCDEF1234123412') // 十六位十六进制数作为密钥偏移量

// 公钥
const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDW3AJoMnSBW/2P80TYHT/GQJ8k
Bxjb9TdJpXIquBcCjWiqjzpuUN1F/uyllm5u1X4XFxAviMwCWojOEoiTCI85b88Y
jfeXuas2VQpp7j0xzF9+wZckbvj8r/Zy5K5/xGtvbzt4QEOF/sGHuOEYXZ/Ptzam
iR0PeTwRBn2hdhGQBwIDAQAB
-----END PUBLIC KEY-----`

export default (userName, password) => {
  // 加密串
  let encryption = `USERLOGIN_KEY|${userName}|${password}|`
  // AES加密
  encryption = Encrypt(encryption)
  // RSA加密
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey(publicKey)
  encryption = encrypt.encrypt(encryption)

  return encryption
}

// AES加密方法
function Encrypt(word) {
  // let srcs = CryptoJS.enc.Utf8.parse(word);
  const encrypted = CryptoJS.AES.encrypt(word, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
}
