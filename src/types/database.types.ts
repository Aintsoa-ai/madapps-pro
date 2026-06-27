export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  created_at: string;
}

export interface App {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  full_description: string | null;
  icon_url: string | null;
  banner_url: string | null;
  apk_url: string | null;
  developer_name: string;
  featured: boolean;
  status: string;
  category_id: string | null;
  created_at: string;
  updated_at: string;
  views_count?: number;
  downloads_count?: number;
  likes_count?: number;
  dislikes_count?: number;
  screenshots?: string[] | null;
  categories?: Category; // Relation
}
