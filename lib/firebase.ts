// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, Timestamp, deleteDoc, doc, where, updateDoc } from "firebase/firestore";

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
  cpf?: string;
  cnpj?: string;
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

// Interface para armazenar informações do cliente associadas ao CPF ou CNPJ
export interface CustomerData {
  id?: string;
  cpf?: string;
  cnpj?: string;
  name: string;
  phone: string;
  city: string;
  state: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Função para salvar ou atualizar informações do cliente associadas ao CPF ou CNPJ
export async function saveCustomerData(customer: Omit<CustomerData, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    let q;
    // Verificar se é CPF ou CNPJ para fazer a busca correta
    if (customer.cpf) {
      q = query(collection(db, "customer_data"), where("cpf", "==", customer.cpf));
    } else if (customer.cnpj) {
      q = query(collection(db, "customer_data"), where("cnpj", "==", customer.cnpj));
    } else {
      throw new Error("É necessário fornecer CPF ou CNPJ para salvar os dados do cliente");
    }
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Se já existir, atualizar o registro existente
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, {
        ...customer,
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } else {
      // Se não existir, criar um novo registro
      const docRef = await addDoc(collection(db, "customer_data"), {
        ...customer,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    }
  } catch (error) {
    console.error("Error adding/updating customer document: ", error);
    throw error;
  }
}

// Função para buscar informações do cliente pelo CPF
export async function getCustomerDataByCpf(cpf: string): Promise<CustomerData | null> {
  try {
    const q = query(collection(db, "customer_data"), where("cpf", "==", cpf));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt,
        updatedAt: doc.data().updatedAt
      } as CustomerData;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting customer document: ", error);
    throw error;
  }
}

// Função para buscar informações do cliente pelo CNPJ
export async function getCustomerDataByCnpj(cnpj: string): Promise<CustomerData | null> {
  try {
    const q = query(collection(db, "customer_data"), where("cnpj", "==", cnpj));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt,
        updatedAt: doc.data().updatedAt
      } as CustomerData;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting customer document: ", error);
    throw error;
  }
}

// Função para atualizar automaticamente os dados do cliente ao salvar um recibo
export async function updateCustomerFromReceipt(receipt: Omit<WarrantyReceipt, 'id' | 'createdAt'>): Promise<void> {
  try {
    // Verificar se o campo CPF ou CNPJ contém um documento válido
    let cpfValue: string | undefined = undefined;
    let cnpjValue: string | undefined = undefined;
    
    if (receipt.cpf) {
      const numericValue = receipt.cpf.replace(/\D/g, '');
      
      if (numericValue.length === 11) {
        // É um CPF
        cpfValue = receipt.customerName === receipt.cpf ? undefined : receipt.cpf;
      } else if (numericValue.length === 14) {
        // É um CNPJ
        cnpjValue = receipt.customerName === receipt.cpf ? undefined : receipt.cpf;
      }
    } else if (receipt.cnpj) {
      const numericValue = receipt.cnpj.replace(/\D/g, '');
      
      if (numericValue.length === 14) {
        // É um CNPJ
        cnpjValue = receipt.customerName === receipt.cnpj ? undefined : receipt.cnpj;
      }
    }
    
    const customerData: Omit<CustomerData, 'id' | 'createdAt' | 'updatedAt'> = {
      cpf: cpfValue,
      cnpj: cnpjValue,
      name: receipt.customerName,
      phone: receipt.phone,
      city: receipt.city,
      state: receipt.state
    };
    
    await saveCustomerData(customerData);
  } catch (error) {
    console.error("Error updating customer from receipt: ", error);
    throw error;
  }
}

export { db };