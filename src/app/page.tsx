'use client'

import { ChangeEvent, useState } from "react";
import NewNoteCard from "./components/new-note-card";
import { NoteCard } from "./components/note-card";

interface PropsCard {
  id: string,
  date: Date,
  content: string
}

export default function Home() {
  const [search, setSearch] = useState<string>('');
  const [notes, setNotes] = useState<PropsCard[]>(() => {
    const notesStorage = localStorage.getItem('notes');

    if(notesStorage) {
      return JSON.parse(notesStorage)
    }

    return []
  });

  function onNoteCreated(content: string) {
    const newNote = {
      id: String(Math.random()),
      date: new Date(),
      content
    }

    const arrayNotes = [newNote, ...notes]

    setNotes(arrayNotes)

    localStorage.setItem('notes', JSON.stringify(arrayNotes))
  }

  function onNoteDeleted(id: string) {
    const notesArray = notes.filter(note => {
      return note.id != id
    })

    setNotes(notesArray)
    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;

    setSearch(query)
  }

  const filteredNotes = search != '' ? notes.filter(note => note.content.toLowerCase().includes(search.toLowerCase())) : notes;

  return (
    <div className='mx-auto max-w-6xl my-12 space-y-6 px-5'>
      <img src="./assets/logo-nlw-expert.svg" alt="logo" />
      <form className="w-full">
        <input onChange={handleSearch} className="2-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500" type="text" placeholder='Busque em suas notas...' />
      </form>

      <div className="h-px bg-slate-700" />

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
        <NewNoteCard onNoteCreated={onNoteCreated}/>

        {filteredNotes.map((card: PropsCard) => (
          <NoteCard onNoteDeleted={onNoteDeleted} key={card.id} id={card.id} date={card.date} content={card.content} />
        )) ?? ''}
      </div>
    </div>
  );
}
