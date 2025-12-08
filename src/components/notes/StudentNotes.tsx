import { useState, useRef } from 'react';
import { useNotesStore, StudentNote } from '@/store/notesStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  StickyNote, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Clock,
  BookOpen 
} from 'lucide-react';
import { toast } from 'sonner';

interface StudentNotesProps {
  courseId: string;
  lectureId: string;
  currentVideoTime?: number;
}

const StudentNotes = ({ courseId, lectureId, currentVideoTime = 0 }: StudentNotesProps) => {
  const { notes, addNote, updateNote, deleteNote, getNotesByLecture } = useNotesStore();
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const lectureNotes = getNotesByLecture(courseId, lectureId);

  const formatTimestamp = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddNote = () => {
    if (!newNoteContent.trim()) {
      toast.error('Please enter some content for your note');
      return;
    }

    addNote(courseId, lectureId, newNoteContent.trim(), currentVideoTime);
    setNewNoteContent('');
    setIsAddingNote(false);
    toast.success('Note added successfully!');
  };

  const handleUpdateNote = (noteId: string) => {
    if (!editContent.trim()) {
      toast.error('Note content cannot be empty');
      return;
    }

    updateNote(noteId, editContent.trim());
    setEditingNoteId(null);
    setEditContent('');
    toast.success('Note updated!');
  };

  const handleDeleteNote = (noteId: string) => {
    deleteNote(noteId);
    toast.success('Note deleted');
  };

  const startEditing = (note: StudentNote) => {
    setEditingNoteId(note.id);
    setEditContent(note.content);
  };

  return (
    <Card className="glass border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="h-5 w-5 text-primary" />
            My Notes
          </CardTitle>
          {!isAddingNote && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddingNote(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Note
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Note Form */}
        {isAddingNote && (
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg border border-border/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Timestamp: {formatTimestamp(currentVideoTime)}</span>
            </div>
            <Textarea
              ref={textareaRef}
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Write your note here..."
              className="min-h-[100px] resize-none"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={handleAddNote} className="gap-2">
                <Save className="h-4 w-4" />
                Save Note
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAddingNote(false);
                  setNewNoteContent('');
                }}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Notes List */}
        {lectureNotes.length === 0 && !isAddingNote ? (
          <div className="text-center py-8 text-muted-foreground">
            <StickyNote className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No notes yet for this lecture</p>
            <p className="text-sm">Click "Add Note" to start taking notes</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {lectureNotes.map((note) => (
              <div
                key={note.id}
                className="p-4 bg-muted/30 rounded-lg border border-border/30 space-y-2"
              >
                {editingNoteId === note.id ? (
                  <div className="space-y-3">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-[80px] resize-none"
                      autoFocus
                    />
                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={() => handleUpdateNote(note.id)}>
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingNoteId(null);
                          setEditContent('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm whitespace-pre-wrap flex-1">{note.content}</p>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => startEditing(note)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteNote(note.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimestamp(note.timestamp)}
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentNotes;
