
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
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";


export default function AddTaskPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAdmin, loading } = useAuth();
  const [iconFile, setIconFile] = useState<File | null>(null);

  const [task, setTask] = useState({
    name: "",
    reward: 0,
    hint: "",
    description: "",
    steps: "",
    isInstant: false,
    isHighPaying: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (name === 'reward') {
      setTask(prev => ({ ...prev, reward: value === '' ? 0 : parseFloat(value) }));
    } else {
      setTask(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIconFile(e.target.files[0]);
    }
  };

  const handleSwitchChange = (field: 'isInstant' | 'isHighPaying') => (checked: boolean) => {
    setTask(prev => ({ ...prev, [field]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.name || task.reward <= 0 || !task.description || !task.steps || !iconFile) {
        toast({
            title: "Missing Fields",
            description: "Please fill out all required fields, including the icon.",
            variant: "destructive"
        });
        return;
    }
    setIsSubmitting(true);
    try {
        let iconUrl = "";
        if (iconFile) {
            const storageRef = ref(storage, `task-icons/${Date.now()}_${iconFile.name}`);
            const snapshot = await uploadBytes(storageRef, iconFile);
            iconUrl = await getDownloadURL(snapshot.ref);
        }

        const taskData = {
          name: task.name,
          reward: Number(task.reward),
          hint: task.hint,
          description: task.description,
          steps: task.steps,
          isInstant: task.isInstant,
          isHighPaying: task.isHighPaying,
          icon: iconUrl,
        };

        await addDoc(collection(db, "tasks"), taskData);

        toast({
            title: "Task Added!",
            description: `${task.name} has been added successfully.`,
            className: "bg-accent text-accent-foreground border-accent"
        });
        router.push("/admin");
    } catch (error) {
        console.error("Error adding task: ", error);
        toast({
            title: "Error",
            description: "Could not add the task. Check console for details.",
            variant: "destructive"
        });
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
    <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-4 sm:p-8">
             <Button variant="outline" size="sm" onClick={() => router.back()} className="mb-4">
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
                        <div className="space-y-2">
                            <Label htmlFor="reward">Reward Amount (₹)</Label>
                            <Input id="reward" name="reward" type="number" placeholder="e.g. 120" value={task.reward} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="icon">Task Icon</Label>
                            <Input id="icon" name="icon" type="file" accept="image/*" onChange={handleFileChange} required />
                            {iconFile && <p className="text-sm text-muted-foreground">Selected: {iconFile.name}</p>}
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
                            <Textarea id="steps" name="steps" placeholder="1. Download the app.\n2. Register an account.\n3. Complete one level." value={task.steps} onChange={handleChange} required className="min-h-[120px]" />
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
    </div>
  );
}
