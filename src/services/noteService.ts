// REFERENCE SOLUTION - Do not distribute to students
// src/services/noteService.ts
//* DONE: Import functions like setDoc, deleteDoc, onSnapshot from Firebase Firestore to interact with the database
import { collection, deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { DocumentData, QuerySnapshot, Unsubscribe } from 'firebase/firestore';

//* DONE: Import the Firestore instance from your Firebase configuration file
import { db } from '../firebase-config';
import { Note, Notes } from '../types/Note';

const NOTES_COLLECTION = 'notes';

/**
 * Creates or updates a note in Firestore
 * @param note Note object to save
 * @returns Promise that resolves when the note is saved
 */
export async function saveNote(note: Note): Promise<void> {
  //* DONE: save the note to Firestore in the NOTES_COLLECTION collection
  // Use setDoc to create or update the note document; throw an error if it fails
  try {
    // should call setDoc with the correct parameters, using either collection or full path
    await setDoc(doc(collection(db, NOTES_COLLECTION), note.id), note);
  } catch (error) {
    console.error('Error in saveNote:', error);
    throw new Error(`Error in saveNote: ${error}`);
  }
}

/**
 * Deletes a note from Firestore
 * @param noteId ID of the note to delete
 * @returns Promise that resolves when the note is deleted
 */
export async function deleteNote(noteId: string): Promise<void> {
  //* DONE: delete the note from Firestore in the NOTES_COLLECTION collection
  // Use deleteDoc to remove the note document; throw an error if it fails
  try {
    await deleteDoc(doc(collection(db, NOTES_COLLECTION), noteId));
  } catch (error) {
    console.error('Error in deleteNote:', error);
    throw new Error(`Error in deleteNote: ${error}`);
  }
}

/**
 * Transforms a Firestore snapshot into a Notes object
 * @param snapshot Firestore query snapshot
 * @returns Notes object with note ID as keys
 */
export function transformSnapshot(snapshot: QuerySnapshot<DocumentData>): Notes {
  const notes: Notes = {};

  snapshot.docs.forEach((doc) => {
    const noteData = doc.data() as Note;
    notes[doc.id] = noteData;
  });

  return notes;
}

/**
 * Subscribes to changes in the notes collection
 * @param onNotesChange Callback function to be called when notes change
 * @param onError Optional error handler for testing
 * @returns Unsubscribe function to stop listening for changes
 */

export function subscribeToNotes(
  onNotesChange: (notes: Notes) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  //* DONE: subscribe to the notes collection in Firestore
  // Use onSnapshot to listen for changes; call onNotesChange with the transformed notes
  // Handle errors by calling onError if provided
  // Returns proper (not empty) unsubscribe function to stop listening for changes
  const unsubscribe: Unsubscribe = onSnapshot(
    collection(db, NOTES_COLLECTION),
    (snapshot) => {
      const transformedNotes = transformSnapshot(snapshot);
      onNotesChange(transformedNotes);
    },
    (error) => {
      if (onError) {
        //! console.error('Error in subscribeToNotes:', error);
        onError(error);
      }
    },
  );

  return unsubscribe;
}
