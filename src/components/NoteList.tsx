// src/components/NoteList.tsx
import React, { useEffect, useState } from 'react';

import { subscribeToNotes } from '../services/noteService';
import { Note, Notes } from '../types/Note';
import NoteItem from './NoteItem';

interface NoteListProps {
  onEditNote?: (note: Note) => void;
}

const NoteList: React.FC<NoteListProps> = ({ onEditNote }) => {
  //* DONE: manage state for notes, loading status, and error message
  const [notesList, setNotesList] = useState<Notes>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //* DONE: load notes using subscribeToNotes from noteService, use useEffect to manage the subscription; try/catch to handle errors (see lab 3)
  //* DONE: handle unsubscribing from the notes when the component unmounts
  try {
    useEffect(() => {
      // 1. Set loading state
      setIsLoading(true);

      // 2. Subscribe to data
      const unsubscribe = subscribeToNotes(
        (notes) => {
          setNotesList(notes);
          setIsLoading(false);
        },
        (error) => {
          console.error('Error when calling subscribeToNotes from NoteList:', error);
          setError(
            error instanceof Error
              ? error.message
              : 'Error when calling subscribeToNotes from NoteList',
          );
          setIsLoading(false);
        },
      );

      // 3. Return cleanup function
      return () => {
        unsubscribe();
      };
    }, []); // Empty dependency array = run once on mount
  } catch (error) {
    console.error('Error in NoteList when loading notes using subscribeToNotes:', error);
    setError(
      error instanceof Error
        ? error.message
        : 'Error in NoteList when loading notes using subscribeToNotes',
    );
    setIsLoading(false);
  }

  return (
    <div className="note-list">
      <h2>Notes</h2>
      {error && <p>{error}</p>}
      {isLoading ? (
        <p>Loading notes...</p>
      ) : Object.values(notesList).length === 0 ? (
        // If no notes, show a message
        <p>No notes yet. Create your first note!</p>
      ) : (
        <div className="notes-container">
          {Object.values(notesList)
            // Sort by lastUpdated (most recent first)
            .sort((a, b) => b.lastUpdated - a.lastUpdated)
            .map((note) => (
              <NoteItem key={note.id} note={note} onEdit={onEditNote} />
            ))}
        </div>
      )}
    </div>
  );
};

export default NoteList;
