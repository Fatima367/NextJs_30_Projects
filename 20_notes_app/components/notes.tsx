"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { FilePenIcon, TrashIcon } from "lucide-react";

type Notes = {
  id: number;
  title: string;
  content: string;
};

const defaultNotes: Notes[] = [
  {
    id: 1,
    title: "Grocery List",
    content: "Milk, Eggs, Bread, Apples",
  },
  {
    id: 2,
    title: "Meeting Notes",
    content: "Discuss new project timeline, assign tasks to team",
  },
  {
    id: 3,
    title: "Idea for App",
    content: "Develop a note-taking app with a clean and minimalist design",
  },
];

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }

  };   
   return [storedValue, setValue] as const;
}


export default function NotesAppComponent() {
  const [notes, setNotes] :any = useLocalStorage<Notes[]>("notes", defaultNotes);
  const [newnote, setNewNote] = useState<{ title: string; content: string }>({
    title: "",
    content: "",
  });
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAddNote = (): void => {
    if (newnote.title.trim() && newnote.content.trim()) {
      const newNoteWithId = { id: Date.now(), ...newnote };
      setNotes([...notes, newNoteWithId]);
      setNewNote({ title: "", content: "" });
    }
  };

  const handleEditNote = (id: number): void => {
    const noteToEdit = notes.find((note :any) => note.id === id);
    if (noteToEdit) {
      setNewNote({ title: noteToEdit.title, content: noteToEdit.content });
      setEditingNoteId(id);
    }
  };

  const handleUpdateNote = (): void => {
    if (newnote.title.trim() && newnote.content.trim()) {
      setNotes(
        notes.map((note : any) =>
          note.id === editingNoteId
            ? { id: note.id, title: newnote.title, content: newnote.content }
            : note
        )
      );
      setNewNote({ title: "", content: "" });
      setEditingNoteId(null);
    }
  };

  const handleDeleteNote = (id: number): void => {
    setNotes(notes.filter((note : any) => note.id !== id));
  };
  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground bg-gradient-to-l
    from-purple-50 via-white to-purple-50">
      <header className="bg-muted p-2 shadow bg-purple-950">
        <h1 className="text-2xl font-bold text-white font-serif ml-4">Note Taker</h1>
      </header>
      <main className="flex-1 overflow-auto p-4">
        <div className="mb-4 flex flex-col justify-center items-center space-y-3">
          <input
            type="text"
            placeholder="Title..."
            value={newnote.title || ""}
            onChange={(e) => setNewNote({ ...newnote, title: e.target.value })}
            className="w-7/12 rounded-md border border-input bg-background p-2 text-foreground 
            focus:outline-none focus:ring-1 focus:ring-primary bg-purple-50 shadow-md
            placeholder-black"
          />

          <textarea
            placeholder="Content..."
            value={newnote.content || ""}
            onChange={(e) =>
              setNewNote({ ...newnote, content: e.target.value })
            }
            className="mt-2 w-7/12 rounded-md border border-input bg-background p-2 text-foreground 
            focus:outline-none focus:ring-1 focus:ring-primary bg-purple-50 shadow-md
            placeholder-black"
            rows={4}
          />
          </div>
          <div className="justify-center flex">

          {editingNoteId === null ? (
            <Button onClick={handleAddNote} className="mt-2 bg-red-600 text-white shadow-md">
              Add Note
            </Button>
          ) : (
            <Button onClick={handleUpdateNote} className="mt-2 bg-red-600 text-white shadow-md">
              Update Note
            </Button>
          )}
        </div>
        <br />

        <div className="gap-6 flex flex-wrap justify-center">
          {notes.map((note : any) => (
            <Card key={note.id} className="p-4 bg-purple-100 w-2/5 shadow-md ring-2 ring-purple-50
             ring-offset-2 ring-offset-purple-300">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">{note.title}</h2>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditNote(note.id)}
                  >
                    <FilePenIcon className="h-4 w-4 text-blue-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    <TrashIcon className="h-4 w-4 text-red-700" />
                  </Button>
                </div>
              </div>
              <p className="mt-2 text-muted-foreground">{note.content}</p>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
