import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from 'sonner'

interface NewCardProps {
    onNoteCreated: (content: string) => void
}

let speechRecognition: SpeechRecognition | null;

export default function NewNoteCard({ onNoteCreated }: NewCardProps) {
    const [shouldShowOnboarding, setShouldShowOnboarding] = useState<boolean>(true)
    const [content, setContent] = useState<string>('')
    const [isRecording, setIsRecording] = useState<boolean>(false)

    function handleStartEditor() {
        if(isRecording) setIsRecording(false);
        setShouldShowOnboarding(false)
    }

    function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
        setContent(event.target.value)

        if (event.target.value === '') {
            setContent('');
            setShouldShowOnboarding(true)
        }
    }

    function handleSaveNote(event: FormEvent) {
        event.preventDefault();

        if (content) {
            onNoteCreated(content)
            toast.success("Nota criada com sucesso")
            setContent('');
            setShouldShowOnboarding(true)
        } else {
            toast.warning("Informe um conteúdo!")
        }
    }


    function handleStartRecording() {
        const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window

        if(!isSpeechRecognitionAPIAvailable) {
            alert('Seu navegador não suporta a api de gravação!')
            return;
        }

        setIsRecording(true)

        const SpeachRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

        speechRecognition = new SpeachRecognitionAPI();

        speechRecognition.lang = 'pt-BR';
        speechRecognition.continuous = true;
        speechRecognition.maxAlternatives = 1;
        speechRecognition.interimResults = true;

        speechRecognition.onresult = (event) => {
            const transcription = Array.from(event.results).reduce((text, result) => {
                return text.concat(result[0].transcript)
            }, '')


            setContent(transcription);
        }

        speechRecognition.onerror = (event) => {
            console.error(event)
        }

        speechRecognition.start()
    }

    function handleStopRecording() {
        setIsRecording(false)

        if(speechRecognition != null) {
            speechRecognition.stop();
        }
    }

    return (
        <Dialog.Root>
            <Dialog.Trigger className="rounded-md bg-slate-700 p-5 flex text-left flex-col gap-3 hover:ring-2 hover:ring-slate-600 outline-none focus-visible:ring-2 focus-visible:ring-lime-400">
                <span className="text-sm font-medium text-slate-200">Adicionar nota</span>
                <p className="text-sm leading-6 text-slate-400">Grave uma nota em aúdio que será convertida para texto automaticamente</p>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="inset-0 fixed bg-black/50" />
                <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none">
                    <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
                        <X className="size-5" />
                    </Dialog.Close>
                    <form className="flex-1 flex flex-col">
                        <div className="flex flex-1 flex-col gap-3 p-5">
                            <span className="text-sm font-medium text-slate-300">Adicionar Nota</span>
                            {shouldShowOnboarding ? (
                                <p className="text-sm leading-6 text-slate-400">
                                    Comece <button type="button" onClick={handleStartRecording} className="font-medium text-lime-400 hover:underline">gravando uma nota</button> em audio ou se preferir <button type="button" onClick={handleStartEditor} className="font-medium text-lime-400 hover:underline">em texto</button>
                                </p>
                            ) : (<textarea value={content} onChange={handleContentChanged} autoFocus className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none" />)}
                        </div>

                        {isRecording ? (
                            <button onClick={handleStopRecording} type="button" className="flex items-center justify-center gap-2 w-full bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100">
                                <div className="animate-pulse size-3 rounded-full bg-red-500"/>
                                Gravando! (Clique p/ interromper)
                            </button>
                        ) : (
                            <button onClick={handleSaveNote} type="button" className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500">
                                Salvar Nota
                            </button>
                        )}
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}