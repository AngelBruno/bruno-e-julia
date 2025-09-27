// src/services/tablesService.js
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "./firebase";

const tablesCol = collection(db, "tables");

export function listenTopTables(limitN = 5, cb) {
  const q = query(tablesCol, orderBy("count", "desc"));
  return onSnapshot(q, (snap) => {
    const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    cb(all.slice(0, limitN));
  });
}

export async function listAllTables() {
  const snap = await getDocs(tablesCol);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function initTable(id, name) {
  const ref = doc(db, "tables", id);
  await setDoc(ref, {
    name,
    count: 0,
    updatedAt: new Date(),
  }, { merge: true });
}

export async function addToTable(id, qty, secret) {
  const ref = doc(db, "tables", id);
  await updateDoc(ref, {
    count: increment(qty),
    updatedAt: new Date(),
    ...(secret ? { secret } : {})
  });
}

export async function setTableCount(id, newCount, secret) {
  const ref = doc(db, "tables", id);
  await updateDoc(ref, {
    count: newCount,
    updatedAt: new Date(),
    ...(secret ? { secret } : {})
  });
}