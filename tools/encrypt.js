import path from 'path';
import encryptor from 'file-encryptor';
import recursive from 'recursive-readdir';
import fs from './lib/fs';
import del from 'del';

const encode = process.argv.includes('--encode');
const decode = process.argv.includes('--decode');
const clean = process.argv.includes('--clean');

async function encrypt() {

  const key = 'encryptor-key';
  const encodeFolder = path.resolve(__dirname, '../src');

  if (encode) {
    console.log(encodeFolder);

    recursive(encodeFolder, ['.DS_Store'], (err, files) => {
      if (err) return;
      files.forEach(file => {
        console.log(file);
        encryptor.encryptFile(file, `${file}.bin`, key, (err) => {
          // Encryption complete.
        });
      });
    });
  }

  if (decode) {
    recursive(encodeFolder, ['.DS_Store'], (err, files) => {
      if (err) return;
      files.forEach(file => {
        console.log(file);
        encryptor.decryptFile(file, file.replace('.bin', ''), key, (err) => {
          // Encryption complete.
        });
      });
    });
  }

  if (clean) {
    del(['build/**/*.js.bin', 'build/**/*.bin.txt']);
  }
}

export default encrypt;