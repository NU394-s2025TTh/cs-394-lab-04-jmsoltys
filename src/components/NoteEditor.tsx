// REFERENCE SOLUTION - Do not distribute to students
// src/components/NoteEditor.tsx
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

//* DONE: Import the saveNote function from your noteService call this to save the note to firebase
import { saveNote } from '../services/noteService';
import { Note } from '../types/Note';

interface NoteEditorProps {
  initialNote?: Note;
  onSave?: (note: Note) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ initialNote, onSave }) => {
  // State for the current note being edited
  // remove the eslint disable when you implement the state

  const [note, setNote] = useState<Note>(() => {
    return (
      initialNote || {
        id: uuidv4(),
        title: '',
        content: '',
        lastUpdated: Date.now(),
      }
    );
  });

  //* DONE: create state for saving status
  const [currentlySaving, setCurrentlySaving] = useState(false);
  //* DONE: create state for error handling
  const [error, setError] = useState<string | null>(null);

  //* DONE: Update local state when initialNote changes in a useEffect (if editing an existing note)
  // This effect runs when the component mounts or when initialNote changes
  // It sets the note state to the initialNote if provided, or resets to a new empty note, with a unique ID
  useEffect(() => {
    setCurrentlySaving(true);

    if (initialNote) {
      setNote(initialNote);
    } else {
      setNote({
        id: uuidv4(),
        title: '',
        content: '',
        lastUpdated: Date.now(),
      });
    }

    setCurrentlySaving(false);
  }, [initialNote]);

  //* DONE: on form submit create a "handleSubmit" function that saves the note to Firebase and calls the onSave callback if provided
  // This function should also handle any errors that occur during saving and update the error state accordingly
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setCurrentlySaving(true);

    try {
      await saveNote(note);
      if (onSave) {
        onSave(note);
      }

      // test: clears the form after saving a new note
      if (!initialNote) {
        setNote({
          id: uuidv4(),
          title: '',
          content: '',
          lastUpdated: Date.now(),
        });
      }
    } catch (error) {
      //! console.error('Error in handleSubmit:', error);
      setError('Error in handleSubmit: ' + (error as Error).message);
    }

    setCurrentlySaving(false);
  };

  //* DONE: for each form field; add a change handler that updates the note state with the new value from the form
  //* DONE: disable fields and the save button while saving is happening
  //* DONE: for the save button, show "Saving..." while saving is happening and "Save Note" when not saving
  //* DONE: show an error message if there is an error saving the note
  return (
    <form onSubmit={handleSubmit} className="note-editor">
      {error && (
        <div>
          <p>Failed to save note</p>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={note.title}
          required
          placeholder="Enter note title"
          disabled={currentlySaving}
          onChange={(changeEvent) =>
            setNote((previousNote) => ({
              id: previousNote.id,
              title: changeEvent.target.value,
              content: previousNote.content,
              lastUpdated: Date.now(),
            }))
          }
        />
      </div>
      <div className="form-group">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          value={note.content}
          rows={5}
          required
          placeholder="Enter note content"
          disabled={currentlySaving}
          onChange={(changeEvent) =>
            setNote((previousNote) => ({
              id: previousNote.id,
              title: previousNote.title,
              content: changeEvent.target.value,
              lastUpdated: Date.now(),
            }))
          }
        />
      </div>

      <div className="form-actions">
        {/* button should be 'Saving' if saving, otherwise 'Update Note' when initialNote is provided, else 'SaveNote' */}
        <button type="submit">
          {currentlySaving ? 'Saving...' : initialNote ? 'Update Note' : 'Save Note'}
        </button>
      </div>
    </form>
  );
};

export default NoteEditor;
