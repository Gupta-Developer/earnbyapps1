
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ShieldAlert, PlusCircle, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Faq } from "@/lib/types";
import { db, storage } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


export default function AddTaskPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAdmin, loading } = useAuth();
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [faqs, setFaqs] = useState<Faq[]>([]);


  const [task, setTask] = useState({
    name: "",
    reward: 0,
    totalReward: 0,
    hint: "",
    description: "",
    steps: "",
    link: "",
    youtubeLink: "",
    isInstant: false,
    isHighPaying: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'number') {
      setTask(prev => ({ ...prev, [name]: value === '' ? '' : parseFloat(value) }));
    } else {
      setTask(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
  };
  
  const addFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (e.target.name === 'icon') {
          setIconFile(e.target.files[0]);
      }
      if (e.target.name === 'banner') {
          setBannerFile(e.target.files[0]);
      }
    }
  };

  const handleSwitchChange = (field: 'isInstant' | 'isHighPaying') => (checked: boolean) => {
    setTask(prev => ({ ...prev, [field]: checked }));
  };
  
  const uploadFile = async (file: File, path: string): Promise<string> => {
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!task.name || (task.reward as number) <= 0 || !task.description || !task.steps || !iconFile || !task.link) {
        toast({
            title: "Missing Fields",
            description: "Please fill out all required fields, including the icon and link.",
            variant: "destructive"
        });
        return;
    }
    setIsSubmitting(true);
    
    try {
        const iconUrl = await uploadFile(iconFile, `task-icons/${Date.now()}-${iconFile.name}`);
        let bannerUrl = null;
        if(bannerFile) {
           bannerUrl = await uploadFile(bannerFile, `task-banners/${Date.now()}-${bannerFile.name}`);
        }
        
        const newTask = {
            ...task,
            faqs,
            icon: iconUrl,
            banner: bannerUrl || "",
            createdAt: serverTimestamp()
        };

        await addDoc(collection(db, "tasks"), newTask);

        toast({
            title: "Task Added!",
            description: `${task.name} has been added successfully.`,
            className: "bg-accent text-accent-foreground border-accent"
        });
        router.push("/admin");
    } catch (error) {
        console.error("Error adding task:", error);
        toast({ title: "Error", description: "Could not add task.", variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center h-full">
            <p>Loading...</p>
        </div>
    )
  }

  if (!isAdmin) {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center p-4">
            <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
            <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
            <p className="text-lg text-muted-foreground mt-2">Only administrators can access this page.</p>
        </div>
    );
  }

  return (
    <div className="p-4">
         <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
        </Button>
        <Card className="shadow-lg rounded-lg max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Add a New Task</CardTitle>
                <CardDescription>Fill in the details for the new task to make it available to users.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Task Name</Label>
                        <Input id="name" name="name" placeholder="e.g. PlayerzPot" value={task.name} onChange={handleChange} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="reward">User Payout (₹)</Label>
                            <Input id="reward" name="reward" type="number" placeholder="e.g. 120" value={task.reward} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="totalReward">Total Reward (₹)</Label>
                            <Input id="totalReward" name="totalReward" type="number" placeholder="e.g. 150" value={task.totalReward} onChange={handleChange} />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="link">Task Link</Label>
                        <Input id="link" name="link" placeholder="e.g. https://example.com/download" value={task.link} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="icon">Task Icon</Label>
                        <Input id="icon" name="icon" type="file" accept="image/*" onChange={handleFileChange} required />
                        {iconFile && <p className="text-sm text-muted-foreground mt-2">Selected: {iconFile.name}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="banner">Task Banner (Optional)</Label>
                        <Input id="banner" name="banner" type="file" accept="image/*" onChange={handleFileChange} />
                        {bannerFile && <p className="text-sm text-muted-foreground mt-2">Selected: {bannerFile.name}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="hint">Icon AI Hint</Label>
                        <Input id="hint" name="hint" placeholder="e.g. cricket player" value={task.hint} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" placeholder="A short, engaging description for the user." value={task.description} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="steps">Steps to Complete (one per line)</Label>
                        <Textarea id="steps" name="steps" placeholder="1. Download the app.
2. Register an account.
3. Complete one level." value={task.steps} onChange={handleChange} required className="min-h-[120px]" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="youtubeLink">YouTube Video Link</Label>
                        <Input id="youtubeLink" name="youtubeLink" placeholder="e.g. https://www.youtube.com/embed/your_video_id" value={task.youtubeLink} onChange={handleChange} />
                    </div>
                     <div className="space-y-4">
                        <Label>Frequently Asked Questions</Label>
                        {faqs.map((faq, index) => (
                        <div key={index} className="p-4 border rounded-lg space-y-3 relative">
                            <div className="space-y-1">
                            <Label htmlFor={`faq-q-${index}`}>Question</Label>
                            <Input
                                id={`faq-q-${index}`}
                                value={faq.question}
                                onChange={(e) => handleFaqChange(index, "question", e.target.value)}
                                placeholder="e.g. How long does verification take?"
                            />
                            </div>
                            <div className="space-y-1">
                            <Label htmlFor={`faq-a-${index}`}>Answer</Label>
                             <Textarea
                                id={`faq-a-${index}`}
                                value={faq.answer}
                                onChange={(e) => handleFaqChange(index, "answer", e.target.value)}
                                placeholder="e.g. It usually takes 24-48 hours."
                            />
                            </div>
                            <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFaq(index)}
                            className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                            >
                            <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        ))}
                         <Button type="button" variant="outline" size="sm" onClick={addFaq} className="w-full">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add FAQ
                        </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch id="isHighPaying" checked={task.isHighPaying} onCheckedChange={handleSwitchChange('isHighPaying')} />
                        <Label htmlFor="isHighPaying">High Paying Task?</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch id="isInstant" checked={task.isInstant} onCheckedChange={handleSwitchChange('isInstant')} />
                        <Label htmlFor="isInstant">Instant Payment?</Label>
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button type="submit" size="lg" className="shadow-md" disabled={isSubmitting}>
                            {isSubmitting ? 'Adding Task...' : 'Add Task'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    </div>
  );
}
