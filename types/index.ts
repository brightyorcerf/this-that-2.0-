export interface Poll {
  id: string;
  slug: string;
  upload_token: string;
  is_upload_open: boolean;
  created_at: string;
}

export interface Image {
  id: string;
  poll_id: string;
  image_url: string;
  rating: number;
  wins: number;
  losses: number;
  uploader_hash: string | null;
  created_at: string;
}

export interface Vote {
  id: string;
  poll_id: string;
  winner_image_id: string;
  loser_image_id: string;
  voter_hash: string;
  created_at: string;
}