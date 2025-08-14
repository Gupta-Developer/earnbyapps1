
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
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp, deleteDoc } from "firebase/firestore";


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
      setTask(prev => ({ ...prev, [name]: value === '' ? 0 : parseFloat(value) }));
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
      const file = e.target.files[0];
      const maxSize = 5 * 1024 * 1024; // 5MB limit
      
      if (file.size > maxSize) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive"
        });
        return;
      }
      
      if (e.target.name === 'icon') {
          setIconFile(file);
      }
      if (e.target.name === 'banner') {
          setBannerFile(file);
      }
    }
  };

  const handleSwitchChange = (field: 'isInstant' | 'isHighPaying') => (checked: boolean) => {
    setTask(prev => ({ ...prev, [field]: checked }));
  };
  
  const convertFileToBase64 = async (file: File): Promise<string> => {
      console.log("Converting file to base64:", { fileName: file.name, fileSize: file.size });
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
              const base64String = reader.result as string;
              console.log("File converted to base64 successfully");
              resolve(base64String);
          };
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(file);
      });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Form submission started");
    console.log("Task data:", task);
    console.log("Icon file:", iconFile);
    console.log("Banner file:", bannerFile);
    console.log("FAQs:", faqs);
    
    // Test Firebase connectivity
    try {
        console.log("Testing Firebase connectivity...");
        const testDoc = await addDoc(collection(db, "test"), { test: true, timestamp: serverTimestamp() });
        console.log("Firebase test successful, document ID:", testDoc.id);
        // Clean up test document
        await deleteDoc(testDoc);
    } catch (error) {
        console.error("Firebase connectivity test failed:", error);
        toast({ 
            title: "Firebase Error", 
            description: `Cannot connect to database: ${error.message}`, 
            variant: "destructive" 
        });
        return;
    }
    
    if (!task.name || (task.reward as number) <= 0 || !task.description || !task.steps || !task.link) {
        console.log("Validation failed:", {
            name: !!task.name,
            reward: task.reward,
            description: !!task.description,
            steps: !!task.steps,
            iconFile: !!iconFile,
            link: !!task.link
        });
        toast({
            title: "Missing Fields",
            description: "Please fill out all required fields (icon is optional for now due to CORS issues).",
            variant: "destructive"
        });
        return;
    }
    
    console.log("Validation passed, starting submission");
    setIsSubmitting(true);
    
         try {
         let iconUrl = "https://placehold.co/400x400/png?text=Task+Icon";
         let bannerUrl = null;
         
         // Convert icon file to base64 if provided
         if (iconFile) {
             try {
                 console.log("Converting icon file to base64...");
                 iconUrl = await convertFileToBase64(iconFile);
                 console.log("Icon converted to base64 successfully");
             } catch (error) {
                 console.error("Icon conversion failed:", error);
                 toast({
                     title: "Icon Error",
                     description: "Failed to process icon file. Using placeholder.",
                     variant: "destructive"
                 });
             }
         }
         
         // Convert banner file to base64 if provided
         if (bannerFile) {
             try {
                 console.log("Converting banner file to base64...");
                 bannerUrl = await convertFileToBase64(bannerFile);
                 console.log("Banner converted to base64 successfully");
             } catch (error) {
                 console.error("Banner conversion failed:", error);
                 toast({
                     title: "Banner Error",
                     description: "Failed to process banner file.",
                     variant: "destructive"
                 });
             }
         }
         
         const newTask: any = {
             ...task,
             reward: Number(task.reward) || 0,
             totalReward: Number(task.totalReward) || 0,
             isInstant: Boolean(task.isInstant),
             isHighPaying: Boolean(task.isHighPaying),
             faqs,
             icon: iconUrl,
             banner: bannerUrl || "",
             createdAt: serverTimestamp()
         };

        if (!newTask.youtubeLink) {
            delete newTask.youtubeLink;
        }

        console.log("Prepared task data:", newTask);
        console.log("Adding to Firestore...");

        const docRef = await addDoc(collection(db, "tasks"), newTask);
        console.log("Task added successfully with ID:", docRef.id);

        toast({
            title: "Task Added!",
            description: `${task.name} has been added successfully.`,
            className: "bg-accent text-accent-foreground border-accent"
        });
        router.push("/admin");
    } catch (error) {
        console.error("Error adding task:", error);
        console.error("Error details:", {
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        toast({ 
            title: "Error", 
            description: `Could not add task: ${error.message}`, 
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
                         <Input id="icon" name="icon" type="file" accept="image/*" onChange={handleFileChange} />
                         {iconFile && <p className="text-sm text-muted-foreground mt-2">Selected: {iconFile.name}</p>}
                         <p className="text-xs text-muted-foreground">Images will be stored as base64 data (no CORS issues)</p>
                     </div>
                     <div className="space-y-2">
                         <Label htmlFor="banner">Task Banner (Optional)</Label>
                         <Input id="banner" name="banner" type="file" accept="image/*" onChange={handleFileChange} />
                         {bannerFile && <p className="text-sm text-muted-foreground mt-2">Selected: {bannerFile.name}</p>}
                         <p className="text-xs text-muted-foreground">Images will be stored as base64 data (no CORS issues)</p>
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

    