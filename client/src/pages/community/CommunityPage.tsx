/**
 * CommunityPage.tsx
 * 
 * Migrated as part of the repository reorganization.
 */
import { CosmicBackground } from "@/components/features/cosmic/CosmicBackground";
import { CommunityFeedbackLoop } from "@/components/community/CommunityFeedbackLoop";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "wouter";
import { ChevronRight, Heart, Users, Star, MessageSquare } from "lucide-react";
import { CosmicIcon } from "@/components/cosmic/ui/cosmic-icons";
import { ComingSoonNotice } from '@/components/common/ComingSoonNotice';

// Define the feedback item type to match the component's expectations
interface FeedbackItem {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  date: string;
  category: string;
  status: "pending" | "implemented" | "considering" | "declined";
  votes: number;
  userVoted?: boolean;
  comments: number;
}

// Sample data for feedback items
const sampleFeedbackItems: FeedbackItem[] = [
  {
    id: "feedback-1",
    user: {
      name: "Astral Explorer",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    content:
      "The Astral Projection album completely transformed my meditation practice. I've been able to achieve states of consciousness I never thought possible. Would love to see more guided journeys specifically for lucid dreaming!",
    date: "2 days ago",
    category: "suggestion",
    status: "considering",
    votes: 42,
    userVoted: true,
    comments: 5,
  },
  {
    id: "feedback-2",
    user: {
      name: "Quantum Healer",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    content:
      "I've noticed that the 528 Hz tracks sometimes have a slight background noise that can be distracting during deep meditation sessions. Could this be cleaned up in future releases?",
    date: "1 week ago",
    category: "bug",
    status: "implemented",
    votes: 38,
    userVoted: false,
    comments: 7,
  },
  {
    id: "feedback-3",
    user: {
      name: "Cosmic Voyager",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    content:
      "It would be amazing to have a feature that allows us to create custom playlists that follow the chakra system from root to crown. This would help create a complete journey through all energy centers.",
    date: "2 weeks ago",
    category: "feature",
    status: "pending",
    votes: 27,
    userVoted: false,
    comments: 3,
  },
  {
    id: "feedback-4",
    user: {
      name: "Frequency Adept",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    content:
      "The binaural beat generator is incredible, but it would be even better if we could save our custom frequency combinations and share them with the community!",
    date: "3 weeks ago",
    category: "feature",
    status: "implemented",
    votes: 56,
    userVoted: true,
    comments: 12,
  },
];

export default function CommunityPage() {
  const { toast } = useToast();
  const [feedbackItems, setFeedbackItems] = useState(sampleFeedbackItems);

  const handleVote = (id: string) => {
    setFeedbackItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const userVoted = !item.userVoted;
          return {
            ...item,
            votes: userVoted ? item.votes + 1 : item.votes - 1,
            userVoted,
          };
        }
        return item;
      })
    );
  };

  const handleSubmitFeedback = (feedback: { content: string; category: string }) => {
    // In a real app, you would send this to your API
    toast({
      title: "Feedback submitted",
      description: "Thank you for your valuable input! We'll review it soon.",
    });

    // Add to local state (simulating real behavior)
    const newFeedback: FeedbackItem = {
      id: `feedback-${Math.random().toString(36).substr(2, 9)}`,
      user: {
        name: "Cosmic Contributor",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      content: feedback.content,
      date: "Just now",
      category: feedback.category,
      status: "pending", // explicitly typed as one of the allowed values
      votes: 1,
      userVoted: true,
      comments: 0,
    };

    setFeedbackItems((prev) => [newFeedback, ...prev]);
  };

  const handleComment = (id: string) => {
    setFeedbackItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            comments: item.comments + 1,
          };
        }
        return item;
      })
    );

    toast({
      title: "Comment added",
      description: "Your comment has been added to the discussion.",
    });
  };

  return (
    <div className="min-h-screen relative">
      <CosmicBackground opacity={0.4} />
      <ComingSoonNotice 
          pageName="Community Hub"
          features={[
            "User Profiles & Connections",
            "Discussion Forums",
            "Live Chat Rooms",
            "Community Events Calendar",
            "User-Generated Content Sharing",
            "Cosmic Journey Stories",
            "Expert Q&A Sessions",
            "Community Challenges & Goals"
          ]}
          estimatedCompletion="Q1 2025"
        />
    </div>
  );
}