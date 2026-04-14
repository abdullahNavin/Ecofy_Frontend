export type Role           = "MEMBER" | "ADMIN";
export type IdeaStatus     = "DRAFT" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
export type VoteType       = "UPVOTE" | "DOWNVOTE";
export type PurchaseStatus = "pending" | "completed" | "refunded";

export interface User {
  id:         string;
  email:      string;
  name:       string;
  role:       Role;
  isActive:   boolean;
  avatarUrl?: string;
  createdAt:  string;
}

export interface Category {
  id:   string;
  name: string;
  slug: string;
}

export interface Idea {
  id:                 string;
  title:              string;
  slug:               string;
  problemStatement:   string;
  proposedSolution:   string;
  description:        string;
  images:             string[];
  isPaid:             boolean;
  price?:             number;
  status:             IdeaStatus;
  rejectionFeedback?: string;
  upvoteCount:        number;
  downvoteCount:      number;
  commentCount:       number;
  author:             Pick<User, "id" | "name" | "avatarUrl">;
  category:           Category;
  userVote?:          VoteType | null;   // Present when authenticated
  isPurchased?:       boolean;           // Present when authenticated
  createdAt:          string;
  updatedAt:          string;
}

export interface Comment {
  id:        string;
  content:   string;
  isDeleted: boolean;
  author:    Pick<User, "id" | "name" | "avatarUrl">;
  createdAt: string;
  replies:   Comment[];
}

export interface Purchase {
  id:        string;
  amount:    number;
  currency:  string;
  status:    PurchaseStatus;
  ideaId:    string;
  idea?:     Pick<Idea, "id" | "title" | "slug">;
  createdAt: string;
}

export interface PaginatedIdeas {
  data: Idea[];
  meta: {
    page:       number;
    limit:      number;
    total:      number;
    totalPages: number;
  };
}

export interface IdeaQueryParams {
  page?:     number;
  limit?:    number;
  sort?:     "recent" | "top_voted" | "most_commented";
  category?: string;
  paid?:     boolean;
  minVotes?: number;
  author?:   string;
  authorId?: string;
  userId?:   string;
  q?:        string;
}

export interface CreateIdeaDto {
  title:            string;
  categoryId:       string;
  problemStatement: string;
  proposedSolution: string;
  description:      string;
  images:           string[];
  isPaid:           boolean;
  price?:           number;
}
