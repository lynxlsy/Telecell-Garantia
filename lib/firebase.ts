// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, Timestamp, deleteDoc, doc } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBe8A29HwcswAoVdV_XBYqqa2SFO0TV7XE",
  authDomain: "lynxtelecell.firebaseapp.com",
  projectId: "lynxtelecell",
  storageBucket: "lynxtelecell.firebasestorage.app",
  messagingSenderId: "184320429498",
  appId: "1:184320429498:web:95d538852b52939f7ca183"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Interface for warranty receipt data
export interface WarrantyReceipt {
  id?: string;
  customerName: string;
  cpf: string;
  phone: string;
  city: string;
  state: string;
  productType: string;
  brand: string;
  model: string;
  romMemory: string;
  ramMemory: string;
  imei1: string;
  imei2?: string;
  saleValue: number;
  saleValueInWords: string;
  warrantyDuration: string;
  issueCity: string;
  issueDate: string;
  signatureName: string;
  observations?: string;
  companyName: string;
  companyLegalName: string;
  companyCNPJ: string;
  companyStateRegistration: string;
  companyAddress: string;
  companyPhone1: string;
  companyPhone2: string;
  createdAt: Timestamp;
}

// Function to save a warranty receipt to Firestore
export async function saveWarrantyReceipt(receipt: Omit<WarrantyReceipt, 'id' | 'createdAt'>): Promise<string> {
  try {
    // Remove undefined values to prevent Firestore errors
    const cleanReceipt = Object.keys(receipt).reduce((acc, key) => {
      const value = (receipt as any)[key];
      if (value !== undefined && value !== '') {
        (acc as any)[key] = value;
      }
      return acc;
    }, {} as Omit<WarrantyReceipt, 'id' | 'createdAt'>);
    
    const docRef = await addDoc(collection(db, "warranty_receipts"), {
      ...cleanReceipt,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
}

// Function to get all warranty receipts from Firestore
export async function getAllWarrantyReceipts(): Promise<WarrantyReceipt[]> {
  try {
    const q = query(collection(db, "warranty_receipts"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt
    } as WarrantyReceipt));
  } catch (error) {
    console.error("Error getting documents: ", error);
    throw error;
  }
}

// Function to delete a warranty receipt from Firestore
export async function deleteWarrantyReceipt(receiptId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "warranty_receipts", receiptId));
  } catch (error) {
    console.error("Error deleting document: ", error);
    throw error;
  }
}

export { db };