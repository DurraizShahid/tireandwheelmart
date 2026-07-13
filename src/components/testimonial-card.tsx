"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestimonialCardProps {
  quote: string;
  author: string;
  title: string;
  avatarSrc?: string;
  rating?: number;
}

const TestimonialCard = ({
  quote,
  author,
  title,
  avatarSrc,
  rating = 0,
}: TestimonialCardProps) => {
  return (
    <Card className="flex flex-col h-full p-4 shadow-md border-none bg-gradient-to-br from-gray-50 to-gray-100">
      <CardContent className="p-0 mb-3 flex-grow">
        <div className="flex items-center mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-4 w-4",
                i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
              )}
            />
          ))}
        </div>
        <p className="text-sm italic text-muted-foreground leading-relaxed">
          &ldquo;{quote}&rdquo;
        </p>
      </CardContent>
      <CardHeader className="p-0">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarSrc} alt={author} />
            <AvatarFallback className="bg-blue-600 text-white text-sm font-semibold">
              {author.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="text-left">
            <CardTitle className="text-base font-semibold text-foreground">
              {author}
            </CardTitle>
            <p className="text-xs text-muted-foreground">{title}</p>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default TestimonialCard;