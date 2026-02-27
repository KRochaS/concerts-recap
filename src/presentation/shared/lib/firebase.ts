import { initializeApp } from 'firebase/app';
import {
  getDownloadURL,
  getStorage,
  ref,
  StorageReference,
  uploadBytes,
  uploadBytesResumable,
} from 'firebase/storage';

const FIREBASE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

initializeApp(FIREBASE_CONFIG);

const STORAGE = getStorage();

export async function uploadFile(
  pathFolderOnStorage: string,
  file: File
): Promise<string> {
  try {
    const FILE_REF = ref(
      STORAGE,
      `${pathFolderOnStorage}_${Date.now().toString()}${file.name}`
    );
    await uploadBytes(FILE_REF, file);
    const url = await getFileUrl(FILE_REF, file);
    return url;
  } catch (error) {
    throw error;
  }
}

export async function getFileUrl(
  FILE_REF: StorageReference,
  file: File
): Promise<string> {
  const UPLOAD_TASK = uploadBytesResumable(FILE_REF, file);
  const FILE_URL = await getDownloadURL(UPLOAD_TASK.snapshot.ref);
  return FILE_URL;
}
