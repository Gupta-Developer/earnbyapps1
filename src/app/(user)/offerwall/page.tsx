"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const offers = [
  {
    id: 1,
    title: "Special Bonus Offer",
    description: "Complete 3 tasks today and get a ₹50 bonus!",
    imageUrl: "https://placehold.co/600x400.png",
    hint: "gift box",
  },
  {
    id: 2,
    title: "Weekend Bonanza",
    description: "Earn double rewards on all tasks this weekend.",
    imageUrl: "https://placehold.co/600x400.png",
    hint: "calendar money",
  },
  {
    id: 3,
    title: "Refer a Friend",
    description: "Invite a friend and you both get ₹100 when they cash out.",
    imageUrl: "https://placehold.co/600x400.png",
    hint: "people handshake",
  },
];

export default function OfferwallPage() {
  return (
    <div className="p-4 space-y-6">
      <header className="text-center">
        <h1 className="text-2xl font-bold">Offerwall</h1>
        <p className="text-muted-foreground">Check out these exclusive offers!</p>
      </header>

      <div className="space-y-4">
        {offers.map((offer) => (
          <Card key={offer.id} className="shadow-md rounded-lg overflow-hidden">
            <Image
              src={offer.imageUrl}
              alt={offer.title}
              width={600}
              height={400}
              className="w-full h-32 object-cover"
              data-ai-hint={offer.hint}
            />
            <CardHeader>
              <CardTitle>{offer.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{offer.description}</p>
              <Button className="w-full">Claim Offer</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
