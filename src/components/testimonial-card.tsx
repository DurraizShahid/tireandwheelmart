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
  rating = 5, // Default to 5 stars
}: TestimonialCardProps) => {
  return (
    <Card className="flex flex-col justify-between h-full p-6 shadow-lg border-none bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <CardContent className="p-0 mb-4 flex-grow">
        <div className="flex items-center mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-5 w-5",
                i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300 dark:text-gray-600"
              )}
            />
          ))}
        </div>
        <p className="text-lg italic text-muted-foreground leading-relaxed">
          &ldquo;{quote}&rdquo;
        </p>
      </CardContent>
      <CardHeader className="p-0 flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={avatarSrc} alt={author} />
          <AvatarFallback className="bg-blue-600 text-white text-lg font-semibold">
            {author.split(" ").map((n) => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-xl font-semibold text-primary dark:text-primary-foreground">
            {author}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
      </CardHeader>
    </Card>
  );
};

export default TestimonialCard;